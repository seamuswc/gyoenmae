# Towa — rental listing site

Static one-page site for **藤和新宿御苑コープII**. No build step, no admin panel, no database.

English / 日本語 toggle built in.

---

## Quick start (local preview)

```bash
cd towa
python3 -m http.server 8080
```

Open **http://localhost:8080**

---

## Project layout

```
towa/
├── index.html      # page structure
├── css/style.css   # styles
├── js/
│   ├── i18n.js     # all text (EN + JA) + SEO metadata
│   └── main.js     # hero photo carousel
└── photos/         # images (drop files here)
```

---

## Add or change photos

1. Put your images in `photos/` (`.jpg`, `.png`, or `.webp` recommended).
2. Open `js/main.js` and update the `photos` array:

```js
const photos = [
  { src: 'photos/01-living.jpg' },
  { src: 'photos/02-kitchen.jpg' },
  // add more as needed
];
```

The hero uses left/right arrows (or keyboard ← →) to cycle through them. Order in the array = display order.

Replace `photos/line-qr.png` to update the LINE QR code in the footer.

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

## Deploy on DigitalOcean

Easiest: **App Platform → Static Site**.

1. Push this folder to GitHub (or GitLab).
2. In DigitalOcean: **Create App → Static Site**.
3. Connect the repo.
4. Settings:
   - **Build command:** leave empty
   - **Output directory:** `/` (repo root)
5. Deploy.

No Node, npm, or build required.

**Custom domain:** add it in App Platform → Settings → Domains. HTTPS is automatic.

---

## Language URLs (for sharing & Google)

| URL | Language |
|-----|----------|
| `yoursite.com/?lang=en` | English |
| `yoursite.com/?lang=ja` | Japanese |

The site remembers the last choice in the browser. SEO tags (`hreflang`, Open Graph, JSON-LD) update automatically.

---

## Admin (password-protected)

**URL:** `/admin` on the deployed server (e.g. `http://167.172.79.34/admin`).

Access is enforced by nginx HTTP Basic Auth. Credentials are stored only on the server at `/etc/nginx/.htpasswd` — they are never committed to git.

The admin page is a v1 shell for future photo management. Edit `admin/index.html` locally and redeploy the `admin/` folder to update it.

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

- [ ] Replace placeholder photos in `photos/` and `js/main.js`
- [ ] Confirm rent, deposit, and terms in `js/i18n.js`
- [ ] Confirm LINE link and QR in footer
- [ ] Test both languages (top-left toggle)
- [ ] Test on mobile
