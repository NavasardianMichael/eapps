# Deployment

Push to `master` → GitHub Actions verifies and builds → one tarball lands on the server →
symlink flip → `systemctl restart eapps-web` → health check on `/en`. The same machinery as
crossword and Bookie, on the same host — with the API half removed: this site has **no server
layer**.

## Shape

```
      eapps.site ──► nginx ──► 127.0.0.1:7008  eapps-web  (Next standalone)
                          └──► /_next/static/  from disk
  www.eapps.site ──► 301 ──► https://eapps.site
```

One origin, no API host, no database, nothing else to reach. Every page is prerendered at build
time; the Node process serves the prerendered HTML, the metadata routes (`/sitemap.xml`,
`/robots.txt`, `/opengraph-image`, `/llms.txt`, …) and the locale redirect on `/`.

On-host layout:

```
$APP_DIR/                     /home/michael/apps/eapps
  releases/<sha>/             server.js · .next · public · node_modules
  current        -> releases/<sha>
```

No `shared/` and no `db/`: there is no env file and no state on the server. Releases are
disposable, and nothing needs backing up.

`WorkingDirectory` in the unit points at `current`; systemd resolves the symlink at start, so
`systemctl restart` is what promotes a release.

## One-time server setup

The app-specific manual steps — DNS, systemd, the certificate, nginx, GitHub secrets, the first
deploy and search engines — in the order they have to happen, are
[PRODUCTION_SETUP.md](PRODUCTION_SETUP.md). The one ordering trap: the vhost names Let's Encrypt
files, so the certificate is issued **before** the vhost is enabled, with
`certbot certonly --nginx`: certbot answers the challenge through nginx by itself and never
rewrites the template, and `certbot renew` reuses the same method.

The first deploy creates the release directory and starts the service.

## GitHub configuration

**Repository secrets** (Settings → Secrets and variables → Actions):

| Name                   | Value                                     |
| ---------------------- | ----------------------------------------- |
| `SSH_HOST`             | server hostname or IP                     |
| `SSH_USER`             | `michael`                                 |
| `SSH_KEY`              | private half of the deploy key (full PEM) |
| `SSH_PORT`             | optional, defaults to 22                  |
| `APP_DIR`              | `/home/michael/apps/eapps`                |
| `NEXT_PUBLIC_SITE_URL` | `https://eapps.site`                      |

Optional, inlined at build time (empty turns the feature off):
`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — only needed for a URL-prefix property verified by HTML
tag; the Domain property in PRODUCTION_SETUP step 7 verifies by DNS and leaves it empty.

All of them are kept as Secrets. The `NEXT_PUBLIC_*` values are public anyway (inlined into the
browser bundle); the workflow also accepts them as Variables (`secrets.*` first, then
`vars.*`), so a Secret with the same name as a Variable wins. The build fails closed if
`NEXT_PUBLIC_SITE_URL` is missing, loopback, `http://` or ends with `/` — every canonical,
hreflang, sitemap entry, JSON-LD `@id` and `/llms.txt` link is built from it.

## The workflows

|              |                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yml`     | PR → master. typecheck · gates · lint · catalogues · unit tests · build. No services.                                           |
| `deploy.yml` | Push to `master` (or **Run workflow**). `verify` runs the non-build gates, `build` builds and boots the bundle, `deploy` ships. |

A push that changes only docs, Markdown, `deployment/` or `.claude/` does not deploy: those
files never reach the server through the pipeline.

The standalone bundle is booted in CI before it ships and must answer `/en` with 200: output
file tracing can miss files that only `node server.js` notices. Unlike crossword, there is no
API to wait for, so the smoke test renders a real page. On the host: extract, flip the symlink,
restart, poll `/en` (never `/`, which is a 307), keep the newest 3 releases.

## Ports

| Port | What | Declared in                                                                                        |
| ---- | ---- | -------------------------------------------------------------------------------------------------- |
| 7008 | Next | `eapps-web.service`, `eapps.site.conf`, `deploy.yml` (`WEB_PORT`), `package.json` (`dev`, `start`) |

Bookie holds 7004/9004/5004, hangman 7005, millionaire 7006/9006/5006 and crossword
7007/9007/5007 on the same host. Changing the port means editing every file in the row above —
grep for the old number afterwards.

## Operations

```bash
journalctl -u eapps-web -f
systemctl status eapps-web

# rollback
ls -t /home/michael/apps/eapps/releases
ln -sfn /home/michael/apps/eapps/releases/<sha> /home/michael/apps/eapps/current
sudo systemctl restart eapps-web
```

After the first deploy, submit `https://eapps.site/sitemap.xml` in Google Search Console (3 URLs —
`/en`, `/ru`, `/hy` — with hreflang and x-default); see PRODUCTION_SETUP step 7. Google is the
only search engine targeted for now. `/llms.txt` and `/llms-full.txt` summarise the site for AI
assistants.

## Gotchas

- **Two hostnames, one certificate.** `eapps.site` and `www.eapps.site` (301 to the apex, HTTP
  and HTTPS) share one Let's Encrypt certificate named `eapps.site`, issued and renewed over
  HTTP-01 with the nginx authenticator. It is separate from every app subdomain's certificate.
  If the zone is on Cloudflare, both records stay **DNS only**: proxying would break HTTP-01
  renewal and put a second TLS layer in front of nginx.
- **The apex vhost must not catch the apps.** `eapps.site.conf` names exactly `eapps.site` and
  `www.eapps.site` — never a wildcard — so `crossword.eapps.site` and the other app vhosts on
  the same nginx keep their own blocks.
- **`deploy` needs `build`, and `build` needs `verify`, to have succeeded.** No job runs on a
  skipped or failed predecessor.
- **Changing `NEXT_PUBLIC_*` requires a rebuild** — they are inlined. Re-run **Deploy to
  Production** after changing a secret.
- **Never add `proxy_cache`** — `/` is a personalised 307 (`Vary: Accept-Language, Cookie`,
  `no-store`). See `deployment/CLAUDE.md`.
- **`/_next/static/` is content-hashed and served `immutable`** from disk; `/_next/image` goes
  to Node.
