const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const SITE_ROOT = process.env.SITE_ROOT || path.join(__dirname, '..');
const PHOTOS_DIR = path.join(SITE_ROOT, 'photos');
const MANIFEST_PATH = path.join(__dirname, 'photos.json');
const PUBLIC_MANIFEST = path.join(SITE_ROOT, 'photos.json');

const EXCLUDED = new Set(['line-qr.png']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg']);
const MAX_BYTES = 10 * 1024 * 1024;

const DEFAULT_PHOTOS = [
  { filename: '01-living.svg' },
  { filename: '02-kitchen.svg' },
  { filename: '03-bedroom.svg' },
  { filename: '04-view.svg' },
  { filename: '05-bathroom.svg' },
  { filename: '06-building.svg' }
];

function ensureDirs() {
  if (!fs.existsSync(PHOTOS_DIR)) {
    fs.mkdirSync(PHOTOS_DIR, { recursive: true });
  }
}

function readManifest() {
  try {
    if (fs.existsSync(MANIFEST_PATH)) {
      const raw = fs.readFileSync(MANIFEST_PATH, 'utf8').trim();
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data) && data.length > 0) return data;
      }
    }
  } catch (err) {
    console.error('Failed to read manifest:', err.message);
  }
  writeManifest(DEFAULT_PHOTOS);
  return DEFAULT_PHOTOS.slice();
}

function writeManifest(photos) {
  const json = JSON.stringify(photos, null, 2) + '\n';
  try {
    fs.writeFileSync(MANIFEST_PATH, json, 'utf8');
    fs.writeFileSync(PUBLIC_MANIFEST, json, 'utf8');
  } catch (err) {
    if (err.code === 'EACCES') {
      throw Object.assign(new Error('Permission denied writing photos.json (run deploy to fix ownership)'), { status: 500 });
    }
    throw err;
  }
}

function apiError(err, fallback) {
  if (err.code === 'EACCES') {
    return 'Permission denied (photos directory or manifest not writable by API)';
  }
  return err.message || fallback;
}

function photoEntry(filename, extra) {
  const entry = { filename };
  if (extra && extra.alt) entry.alt = extra.alt;
  if (extra && extra.altKey) entry.altKey = extra.altKey;
  return entry;
}

function sanitizeFilename(name) {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, '-');
  return base || 'photo.jpg';
}

function uniqueFilename(desired) {
  const ext = path.extname(desired).toLowerCase();
  const stem = path.basename(desired, path.extname(desired)) || 'photo';
  let candidate = desired;
  let n = 1;
  while (fs.existsSync(path.join(PHOTOS_DIR, candidate))) {
    candidate = stem + '-' + n + ext;
    n += 1;
  }
  return candidate;
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    ensureDirs();
    cb(null, PHOTOS_DIR);
  },
  filename: function (_req, file, cb) {
    const safe = sanitizeFilename(file.originalname);
    cb(null, uniqueFilename(safe));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_BYTES },
  fileFilter: function (_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return cb(new Error('Only JPG, PNG, WebP, and SVG files are allowed'));
    }
    cb(null, true);
  }
});

const app = express();
app.use(express.json());

app.get('/api/photos', function (_req, res) {
  res.json(readManifest());
});

app.post('/api/photos', function (req, res) {
  upload.single('photo')(req, res, function (err) {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE'
        ? 'File too large (max 10 MB)'
        : err.message;
      return res.status(400).json({ error: message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const photos = readManifest();
    photos.push(photoEntry(req.file.filename));
    writeManifest(photos);
    res.status(201).json({ filename: req.file.filename, photos });
  });
});

app.delete('/api/photos/:filename', function (req, res) {
  const filename = path.basename(req.params.filename);
  if (EXCLUDED.has(filename)) {
    return res.status(403).json({ error: 'This file cannot be deleted via the API' });
  }

  const photos = readManifest();
  const index = photos.findIndex(function (p) { return p.filename === filename; });
  if (index === -1) {
    return res.status(404).json({ error: 'Photo not in gallery' });
  }

  const filePath = path.join(PHOTOS_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    photos.splice(index, 1);
    writeManifest(photos);
    res.json({ photos });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: apiError(err, 'Delete failed') });
  }
});

app.put('/api/photos/order', function (req, res) {
  const order = req.body && req.body.order;
  if (!Array.isArray(order) || order.length === 0) {
    return res.status(400).json({ error: 'Body must include order: [filenames]' });
  }

  const current = readManifest();
  const byName = Object.create(null);
  current.forEach(function (p) { byName[p.filename] = p; });

  const reordered = [];
  const seen = new Set();
  order.forEach(function (name) {
    const filename = path.basename(String(name));
    if (seen.has(filename) || !byName[filename]) return;
    seen.add(filename);
    reordered.push(byName[filename]);
  });

  current.forEach(function (p) {
    if (!seen.has(p.filename)) reordered.push(p);
  });

  writeManifest(reordered);
  res.json({ photos: reordered });
});

app.use(function (err, _req, res, _next) {
  console.error(err);
  res.status(err.status || 500).json({ error: apiError(err, 'Internal server error') });
});

ensureDirs();
readManifest();

app.listen(PORT, '127.0.0.1', function () {
  console.log('gyoenmae-api listening on 127.0.0.1:' + PORT);
  console.log('SITE_ROOT=' + SITE_ROOT);
});
