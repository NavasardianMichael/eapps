# Deployment — invariants

Host-side configuration templates. How the pipeline works and the secrets live in
[docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md), the ordered manual setup in
[docs/PRODUCTION_SETUP.md](../docs/PRODUCTION_SETUP.md); this file holds the rules that must not break.

```
deployment/
  eapps.site.conf     nginx, eapps.site -> 127.0.0.1:7008, www.eapps.site -> 301
  eapps-web.service   systemd, Next standalone
```

That is all of it: the site has **no server layer** — no API host, no database, no env file
on the server. Every setting is a `NEXT_PUBLIC_*` value built into the bundle by the pipeline.

**These are templates, not live config.** Nothing deploys them — they are copied to the
server by hand (PRODUCTION_SETUP steps 2 and 4). Paths assume
`APP_DIR=/home/michael/apps/eapps`. When you change one here, say so in the PR: someone has to
re-copy it. A push that touches only `deployment/` or docs does not deploy.

## Rules

- **The release symlink is the deploy mechanism.** The unit sets `WorkingDirectory` to
  `…/current`; `systemctl restart` is what promotes a release. Never point it at a concrete
  `releases/<sha>` path.
- **Never add `proxy_cache`.** `src/proxy.ts` answers `/` with a personalised 307
  (`Vary: Accept-Language, Cookie`, `no-store`). Pages are already prerendered inside Next.
- **One origin.** `https://eapps.site` is canonical; `www` and plain HTTP only redirect to it.
  `NEXT_PUBLIC_SITE_URL` must be exactly that origin — canonicals, hreflang, the sitemap,
  JSON-LD `@id`s and `/llms.txt` are all built from it.
- **This vhost owns the apex and www only.** Never add a wildcard `server_name`: the apps'
  subdomains (`crossword.eapps.site`, …) live on the same host with their own vhosts and
  certificates.
- **`proxy_buffering off` is load-bearing** — Next streams RSC payloads.
- **`/_next/static/` is served from disk, `immutable`; `/_next/image` is not** — it is the
  optimizer and must reach Node.
- **Port 7008** sits beside bookie (7004/9004/5004), hangman (7005), millionaire
  (7006/9006/5006) and crossword (7007/9007/5007) on the same host. Changing it means editing
  every file listed in docs/DEPLOYMENT.md "Ports".
