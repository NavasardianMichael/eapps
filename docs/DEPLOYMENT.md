# Deployment

Push to `master` → GitHub Actions verifies and builds → the standalone bundle lands on the
server → symlink flip → `systemctl restart eapps-web` → health check on `/en`. The same
machinery as crossword, minus the API and the database.

## Shape

```
  eapps.site ──► nginx ──► 127.0.0.1:7008  eapps-web  (Next standalone)
                      └──► /_next/static/  from disk
  www.eapps.site ──► 301 ──► eapps.site
```

```
$APP_DIR/                     /home/michael/apps/eapps
  releases/<sha>/             server.js · .next · public · node_modules
  current        -> releases/<sha>
```

`WorkingDirectory` in the unit points at `current`; systemd resolves the symlink at start, so
`systemctl restart` is what promotes a release.

## One-time server setup

1. **DNS:** `A` (and `AAAA`) records for `eapps.site` and `www.eapps.site` → the host. If the
   zone is on Cloudflare, keep both grey-clouded so origin nginx terminates TLS and HTTP-01
   renewal works (as for crossword's hosts).
2. **Directories:** `mkdir -p /home/michael/apps/eapps/releases`.
3. **Certificate** — before enabling the vhost, which names the certificate files:
   ```bash
   sudo certbot certonly --webroot -w /var/www/html -d eapps.site -d www.eapps.site
   ```
   (With a temporary challenge-only vhost for both names if nothing serves `:80` yet.)
4. **systemd:** copy `deployment/eapps-web.service` to `/etc/systemd/system/`, then
   `sudo systemctl daemon-reload && sudo systemctl enable eapps-web`. Allow the deploy user a
   passwordless `systemctl restart eapps-web` in `/etc/sudoers.d/`.
5. **nginx:** copy `deployment/eapps.site.conf` to `/etc/nginx/sites-available/`, symlink it
   into `sites-enabled`, `sudo nginx -t && sudo systemctl reload nginx`.
6. **GitHub secrets** (below), then **Run workflow** once.

## GitHub configuration

| Secret | Value |
|---|---|
| `SSH_HOST` | server hostname or IP |
| `SSH_USER` | `michael` |
| `SSH_KEY` | private half of the deploy key (full PEM) |
| `SSH_PORT` | optional, defaults to 22 |
| `APP_DIR` | `/home/michael/apps/eapps` |

Optional, inlined at build time (Secrets or Variables; empty turns the feature off):
`NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`,
`NEXT_PUBLIC_YANDEX_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`. The site origin
(`NEXT_PUBLIC_SITE_URL=https://eapps.site`) is fixed in `deploy.yml`, not a secret.

| Workflow | |
|---|---|
| `ci.yml` | PR → master: typecheck · gates · lint · catalogues · unit tests · build |
| `deploy.yml` | Push to `master` (or **Run workflow**): the same checks, build, boot the standalone bundle and require `/en` → 200, then ship |

## Ports

| Port | What | Declared in |
|---|---|---|
| 7008 | Next | `eapps-web.service`, `eapps.site.conf`, `deploy.yml` (`WEB_PORT`), `package.json` |

Bookie 7004/9004/5004, Hangman 7005, Millionaire 7006/9006/5006 and Crossword 7007/9007/5007
share the host.

## Operations

```bash
journalctl -u eapps-web -f
systemctl status eapps-web

# rollback
ls -t /home/michael/apps/eapps/releases
ln -sfn /home/michael/apps/eapps/releases/<sha> /home/michael/apps/eapps/current
sudo systemctl restart eapps-web
```

## After the first deploy

- Submit `https://eapps.site/sitemap.xml` in Google Search Console, Yandex Webmaster and Bing
  Webmaster Tools (3 URLs with hreflang + x-default). Bing also feeds Copilot and ChatGPT
  search. Put each verification token in its `NEXT_PUBLIC_*_VERIFICATION` and redeploy.
- Validate the structured data: Google's Rich Results Test and validator.schema.org on
  `https://eapps.site/en` (Organization, WebSite, CollectionPage → ItemList of
  SoftwareApplication, FAQPage).
- Check the link preview in a debugger (opengraph.xyz, Facebook Sharing Debugger).
- Link back: each listed app should link to `https://eapps.site` (footer or About page). The
  JSON-LD `Organization.owns` claims the apps; links from them confirm it.

## Gotchas

- **Never add `proxy_cache`** — `/` is a personalised 307 (`Vary: Accept-Language, Cookie`,
  `no-store`). Pages are already prerendered inside Next.
- **Changing `NEXT_PUBLIC_*` requires a rebuild** — they are inlined.
- **`deployment/` files are templates**, copied to the host by hand: changing one here changes
  nothing until it is re-copied. The deploy ignores pushes that touch only `deployment/` or docs.
