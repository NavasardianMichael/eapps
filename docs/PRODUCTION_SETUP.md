# Production setup

The one-time, app-specific steps to run eapps on the server at **https://eapps.site**, in
order. Assumed to be in place already, so nothing here creates a user or installs them:

- the existing `michael` user, with sudo
- Node 24 at `/usr/bin/node` (the unit runs `/usr/bin/node server.js`)
- nginx and certbot, with certbot's nginx plugin

The site has **no server layer**: no API, no database, no Docker container, no env file on the
server. Compared with crossword, that removes the API unit and vhost, the database, the server
environment and `ENV_API_BASE64`. What remains is one systemd unit, one vhost and one
certificate.

How the pipeline works is in [DEPLOYMENT.md](DEPLOYMENT.md).

Nothing is downloaded on the server. Each step links the files from this repo's `deployment/`
folder, each followed by the command that creates and opens it on the server. Open the repo file,
copy all of it, run the command, paste into nano (right-click, or `Ctrl+Shift+V`), then save
with `Ctrl+O`, `Enter` and exit with `Ctrl+X`. Then run that step's commands.

To update a file that is already there, empty it first, then open and paste as above:
`sudo truncate -s 0 <path>`.

**[DNS]** DNS provider · **[SRV]** server, as `michael` · **[GH]** GitHub repo settings

Each step is marked **(once)**, done once for the app, or **(any time)**, safe to repeat. A
deploy never touches the files these steps put on the server, so when one of them changes in
the repo, its step says what to redo.

## Environment: one layer

|         | Development                                                         | Production                                                                                        |
| ------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **App** | `.env.local` in the repo root, from [.env.example](../.env.example) | one GitHub secret per key (step 5), built into the bundle by the pipeline. No file on the server. |

Every value is public: each `NEXT_PUBLIC_*` value ends up in the browser bundle.

## 1. DNS **[DNS]** (once)

| Type  | Name             | Value           | Serves                           |
| ----- | ---------------- | --------------- | -------------------------------- |
| A     | `eapps.site`     | `<SERVER_IPV4>` | the site (HTTP → HTTPS)          |
| AAAA  | `eapps.site`     | `<SERVER_IPV6>` | the site (HTTP → HTTPS)          |
| CNAME | `www.eapps.site` | `eapps.site`    | redirect to `https://eapps.site` |

The apex record is `@` at most DNS providers. Leave the apps' own records
(`crossword.eapps.site`, `api.crossword.eapps.site`, …) as they are: this step adds to the zone
and changes none of them. Some providers refuse a CNAME on `www` next to other records for that
name; then use an A/AAAA pair for `www` with the same addresses.

The IPv6 address must really reach the server: Let's Encrypt checks over IPv6 first, so a wrong
AAAA record makes certbot fail. If the zone is on Cloudflare, set every record to **DNS only**.

Check before going on (both should print the server's address):

```bash
nslookup eapps.site
nslookup www.eapps.site
```

## 2. systemd unit **[SRV]** (once)

Paste [eapps-web.service](../deployment/eapps-web.service) into:

```bash
sudo nano /etc/systemd/system/eapps-web.service
```

`sudo nano` creates it owned by `root`, mode `644`. Then create the deployment directory,
load the unit and start it on every boot:

```bash
mkdir -p /home/michael/apps/eapps/releases
sudo systemctl daemon-reload
sudo systemctl enable eapps-web
```

Then let the deploy workflow restart this service, and nothing else, without a password. Open
the rule file in nano through `visudo`, which checks the syntax on save and creates the file
with the mode `440` that sudo requires:

```bash
sudo EDITOR=nano visudo -f /etc/sudoers.d/eapps-deploy
```

Paste this line, then save and exit as above:

```text
michael ALL=(root) NOPASSWD: /usr/bin/systemctl restart eapps-web
```

The path must be where `systemctl` really is; `command -v systemctl` prints it, and
`/usr/bin/systemctl` is the usual one. Check the rule works (no password prompt):

```bash
sudo -n systemctl restart eapps-web
```

Before the first deploy that restart fails because `current` does not exist yet; what matters
is that sudo does not ask for a password.

Check port 7008 is free (no output means free; crossword holds 7007):

```bash
ss -ltn | grep ':7008 '
```

If the `.service` file changes in the repo later, paste it again, then run
`sudo systemctl daemon-reload && sudo systemctl restart eapps-web`.

## 3. Certificate, auto-renewing **[SRV]** (once)

The vhost in step 4 references this certificate, so issue it first. One certificate covers
`eapps.site` and `www.eapps.site`; it is separate from the apps' certificates
(`crossword.eapps.site`, …), which this step does not touch. `certonly --nginx` lets certbot
answer Let's Encrypt's check through nginx by itself and only fetches the certificate: it never
edits a vhost file.

certbot's nginx plugin is needed. If `sudo certbot plugins` does not list `nginx`, install it
with `sudo apt install python3-certbot-nginx`.

```bash
sudo certbot certonly --nginx -d eapps.site -d www.eapps.site --deploy-hook "systemctl reload nginx"
```

The certificate renews by itself: certbot's timer renews it before it expires, the same way it
was issued, and the `--deploy-hook`, saved in its renewal config, reloads nginx afterwards. The
timer is one for the whole server, shared with the other apps' certificates, so there is
nothing to set up for it here.

Check this certificate only. The dry run asks for a test certificate and changes nothing; it
should end with "all simulated renewals succeeded":

```bash
sudo certbot renew --dry-run --cert-name eapps.site
```

And see what it covers and when it expires:

```bash
sudo certbot certificates --cert-name eapps.site
```

## 4. nginx **[SRV]** (once)

Paste [eapps.site.conf](../deployment/eapps.site.conf) into:

```bash
sudo nano /etc/nginx/sites-available/eapps.site.conf
```

`sudo nano` creates it owned by `root`, mode `644`. Then enable it:

```bash
sudo ln -sf /etc/nginx/sites-available/eapps.site.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Run the reload only if `nginx -t` says `syntax is ok` and `test is successful`. Until the first
deploy, `https://eapps.site` answers 502: nginx is ready, the app is not there yet.

If the `.conf` file changes in the repo later, paste it again, then run
`sudo nginx -t && sudo systemctl reload nginx`.

## 5. GitHub secrets **[GH]** (once)

Settings → Secrets and variables → Actions → **Secrets** tab → **Repository secrets** → **New
repository secret**. Every value below goes there: not in the Variables tab, and not under
Settings → Environments, whose secrets the deploy jobs cannot read (a value there arrives
empty, and the build stops with "NEXT_PUBLIC_SITE_URL is empty").

Deploy:

| Name       | Value                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `SSH_HOST` | `<SERVER_IPV4>`                                                                                                    |
| `SSH_USER` | `michael`                                                                                                          |
| `SSH_KEY`  | your existing private key (its public half is already in `/home/michael/.ssh/authorized_keys`), BEGIN to END lines |
| `SSH_PORT` | only if SSH is not on 22                                                                                           |
| `APP_DIR`  | `/home/michael/apps/eapps`                                                                                         |

App, the production twins of the keys in `.env.local`. The first is required: the build stops
if it is empty, loopback, `http://` or ends with `/`. The rest are optional, and an empty or
missing one turns that feature off:

| Name                                   | Value                                                                         |
| -------------------------------------- | ----------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | `https://eapps.site` (exactly: https, no trailing `/`)                        |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | only for a URL-prefix property verified by HTML tag (step 7 uses DNS instead) |

A saved secret cannot be viewed again, and logs show it as `***`. To check or fix one, overwrite
it with the right value.

Unlike `.env.local`, these are not a file: change one here, then redeploy (re-run **Deploy to
Production**), because they are built into the bundle.

## 6. First deploy **[GH]** (once)

Actions → **Deploy to Production** → **Run workflow**. After that, every merge to `master`
deploys automatically (except changes to docs and `deployment/` only), and every pull request
runs **CI** first.

Check it (any time):

```powershell
curl.exe -sI https://eapps.site/en              # 200
curl.exe -sI https://eapps.site/                # 307 -> /en (or /ru, /hy by browser language)
curl.exe -sI https://www.eapps.site             # 301 -> https://eapps.site/
curl.exe -sI http://eapps.site                  # 301 -> https://eapps.site/
curl.exe -s  https://eapps.site/robots.txt      # Sitemap: https://eapps.site/sitemap.xml
curl.exe -s  https://eapps.site/llms.txt        # links to https://eapps.site/..., never localhost
```

## 7. Google Search Console **[DNS]** (once, after the first deploy)

Google only: no other search engine is targeted for now. This site is a hub; the apps are what
should rank, so one **Domain** property covers the hub and every `*.eapps.site` app, and each
app gets its own reports on top.

1. Search Console → add property → **Domain** → `eapps.site` (no `https://`, no `www`).
2. Add the `google-site-verification=…` value it shows as a **TXT** record on the zone root
   (`@`) at the DNS provider, beside the records from step 1, then **Verify**. DNS can take a
   while to propagate. Verified by DNS, the property needs no secret and survives every
   deploy; `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` stays empty.
3. In the Domain property → **Sitemaps**, submit the hub's and each app's sitemap:
   `https://eapps.site/sitemap.xml` (3 URLs — `/en`, `/ru`, `/hy` — each with hreflang and
   `x-default`), `https://crossword.eapps.site/sitemap.xml`, and so on for every
   `*.eapps.site` app.
4. For per-app reports, add a **URL prefix** property per app (`https://crossword.eapps.site/`).
   Under a verified Domain property they need no verification of their own.
5. Check the structured data with Google's Rich Results Test and validator.schema.org on
   `https://eapps.site/en`, and the link preview on opengraph.xyz.

Apps on other domains (`*.mnavasardian.com`, `regionify.pro`) are not covered by this property;
each domain needs its own.
