# Towa — rental listing site

One-page site for **藤和新宿御苑コープII**. English / 日本語 toggle built in.

The public site is static. Photo carousel order is managed via a password-protected admin UI backed by a small Node API on the server.

---

## Quick start (local preview)

**Static site only** (uses `photos.json` in the repo):

```bash
cd towa
python3 -m http.server 8080
```

Open **http://localhost:8080**

**With admin API** (upload / reorder / delete):

```bash
cd towa/server
npm install
npm start
```

In another terminal, serve the site root (API runs on port 3000; static files on 8080). For full admin locally, use a reverse proxy or test on the deployed server.

---

## Project layout

```
towa/
├── index.html          # page structure
├── photos.json         # public carousel manifest (written by API on server)
├── css/style.css       # styles
├── js/
│   ├── i18n.js         # all text (EN + JA) + SEO metadata
│   └── main.js         # hero carousel (reads photos.json)
├── photos/             # image files
├── admin/              # password-protected photo admin UI
├── server/             # Node API (Express + multer)
└── deploy/             # nginx + systemd configs
```

---

## Add or change photos (admin)

**URL:** `/admin` on the deployed server (e.g. `http://167.172.79.34/admin`).

Sign in with the nginx Basic Auth credentials (stored only on the server at `/etc/nginx/.htpasswd`).

1. **Upload** — choose a `.jpg`, `.png`, `.webp`, or `.svg` (max 10 MB) and click **Upload photo**. New images appear at the end of the list.
2. **Reorder** — drag rows or use ↑ ↓, then click **Save order**. The public hero carousel updates immediately.
3. **Delete** — click **Delete** on a row and confirm. The file is removed from the server.

The public site reads `/photos.json` (no login required). The API writes that file whenever photos change.

Replace `photos/line-qr.png` manually to update the LINE QR code in the footer (not part of the carousel).

---

## Edit text (rent, terms, amenities, etc.)

All copy lives in **`js/i18n.js`** under `translations.en` and `translations.ja`.

Change a value in **both** blocks to keep languages in sync.

Examples:

| Key | What it controls |
|-----|------------------|
| `heroSub` | Line under the building name |
| `rentValue` | Rent in property details |
| `termPrice` | Price in 6-month / 1-year boxes |
| `amenity1` … `amenity6` | Bullet list under “About the unit” |
| `footerContact` | Footer heading |

Save the file and refresh the browser.

---

## LINE contact

In `index.html`, search for `line.me`. Update both links if your LINE URL changes:

```
https://line.me/ti/p/4zgIBrGzGk
```

---

## Deploy (DigitalOcean droplet)

Production runs at **167.172.79.34** with nginx + systemd.

```bash
# From your machine (rsync site files; excludes node_modules)
rsync -avz --exclude node_modules --exclude .git \
  ./ root@167.172.79.34:/var/www/gyoenmae/

# On the server
ssh root@167.172.79.34
cd /var/www/gyoenmae/server && npm install
cp /var/www/gyoenmae/deploy/gyoenmae-api.service /etc/systemd/system/
cp /var/www/gyoenmae/deploy/nginx-gyoenmae.conf /etc/nginx/sites-available/gyoenmae
systemctl daemon-reload
systemctl enable --now gyoenmae-api
nginx -t && systemctl reload nginx
```

Ensure `www-data` can write `photos/` and `photos.json`:

```bash
chown -R www-data:www-data /var/www/gyoenmae/photos /var/www/gyoenmae/photos.json
chown -R www-data:www-data /var/www/gyoenmae/server
```

---

## Language URLs (for sharing & Google)

| URL | Language |
|-----|----------|
| `yoursite.com/?lang=en` | English |
| `yoursite.com/?lang=ja` | Japanese |

The site remembers the last choice in the browser. SEO tags (`hreflang`, Open Graph, JSON-LD) update automatically.

---

## Admin API

Mutating endpoints (`POST`, `PUT`, `DELETE` under `/api/`) are protected by the same nginx Basic Auth as `/admin`. `GET /photos.json` is public so the hero carousel loads without hitting Node.

---

## Git (optional)

```bash
cd towa
git init
git add .
git commit -m "Initial rental listing site"
```

Then connect the repo to DigitalOcean for deploys on push.

---

## Checklist before going live

- [ ] Replace placeholder photos via `/admin` or `photos/` + `photos.json`
- [ ] Confirm rent, deposit, and terms in `js/i18n.js`
- [ ] Confirm LINE link and QR in footer
- [ ] Test both languages (top-left toggle)
- [ ] Test on mobile
