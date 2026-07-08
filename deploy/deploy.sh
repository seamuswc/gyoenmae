#!/usr/bin/env bash
# Sync site to production and fix API write permissions.
set -euo pipefail

HOST="${DEPLOY_HOST:-root@167.172.79.34}"
REMOTE_ROOT="${DEPLOY_ROOT:-/var/www/gyoenmae}"

rsync -avz --exclude node_modules --exclude .git \
  ./ "${HOST}:${REMOTE_ROOT}/"

ssh "${HOST}" bash -s <<EOF
set -euo pipefail
cd "${REMOTE_ROOT}/server" && npm install --omit=dev
chown -R www-data:www-data "${REMOTE_ROOT}/photos" "${REMOTE_ROOT}/photos.json" "${REMOTE_ROOT}/status.json"
chown -R www-data:www-data "${REMOTE_ROOT}/server"
cp "${REMOTE_ROOT}/deploy/nginx-gyoenmae.conf" /etc/nginx/sites-available/gyoenmae
if [[ -f /etc/nginx/.htpasswd ]]; then
  chown root:www-data /etc/nginx/.htpasswd
  chmod 640 /etc/nginx/.htpasswd
fi
nginx -t
systemctl reload nginx
systemctl restart gyoenmae-api
EOF

echo "Deploy complete: ${HOST}:${REMOTE_ROOT}"
