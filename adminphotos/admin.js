(function () {
  const API = '/api/photos';
  const STATUS_API = '/api/status';
  const listEl = document.getElementById('photo-list');
  const messageEl = document.getElementById('message');
  const statusMessageEl = document.getElementById('status-message');
  const uploadInput = document.getElementById('upload-input');
  const uploadBtn = document.getElementById('upload-btn');
  const saveBtn = document.getElementById('save-order-btn');
  const vacantBtn = document.getElementById('status-vacant');
  const rentedBtn = document.getElementById('status-rented');
  const rentedUntilField = document.getElementById('rented-until-field');
  const rentedUntilInput = document.getElementById('rented-until');
  const saveStatusBtn = document.getElementById('save-status-btn');

  let photos = [];
  let dragIndex = null;
  let orderDirty = false;
  let rentalStatus = 'vacant';

  function showMessage(text, type, target) {
    const el = target || messageEl;
    if (!el) return;
    el.textContent = text;
    el.className = 'message visible ' + (type || 'info');
    if (type === 'success') {
      window.setTimeout(function () {
        if (el.textContent === text) {
          el.classList.remove('visible');
        }
      }, 3500);
    }
  }

  function setRentalUi(status, rentedUntil) {
    rentalStatus = status === 'rented' ? 'rented' : 'vacant';
    vacantBtn.classList.toggle('active', rentalStatus === 'vacant');
    rentedBtn.classList.toggle('active', rentalStatus === 'rented');
    rentedUntilField.hidden = rentalStatus !== 'rented';
    if (rentedUntil) {
      rentedUntilInput.value = rentedUntil;
    }
  }

  async function api(base, path, options) {
    const opts = Object.assign({ credentials: 'include' }, options || {});
    const res = await fetch(base + (path || ''), opts);
    const text = await res.text();
    var data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (_parseErr) {
        if (!res.ok) {
          var snippet = text.replace(/\s+/g, ' ').trim().slice(0, 120);
          throw new Error('Request failed (' + res.status + ')' + (snippet ? ': ' + snippet : ''));
        }
      }
    }
    if (!res.ok) {
      throw new Error(data.error || ('Request failed (' + res.status + ')'));
    }
    return data;
  }

  async function loadStatus() {
    try {
      const data = await api(STATUS_API, '');
      setRentalUi(data.status, data.rentedUntil);
    } catch (err) {
      showMessage('Failed to load rental status: ' + err.message, 'error', statusMessageEl);
    }
  }

  function isValidRentedUntil(value) {
    if (!value || typeof value !== 'string') return false;
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return false;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (year < 2000 || year > 2099) return false;
    const date = new Date(Date.UTC(year, month - 1, day));
    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }

  function validateRentedUntilInput() {
    const value = rentedUntilInput.value;
    if (!value) {
      rentedUntilInput.setCustomValidity('');
      return true;
    }
    if (!isValidRentedUntil(value)) {
      rentedUntilInput.setCustomValidity('Use a valid date with a 4-digit year (2000–2099).');
      return false;
    }
    rentedUntilInput.setCustomValidity('');
    return true;
  }

  async function saveStatus() {
    const status = rentalStatus;
    const rentedUntil = status === 'rented' ? rentedUntilInput.value : null;

    if (status === 'rented' && !rentedUntil) {
      showMessage('Choose a "rented until" date.', 'error', statusMessageEl);
      return;
    }

    if (status === 'rented' && !validateRentedUntilInput()) {
      showMessage('Year must be 4 digits (2000–2099).', 'error', statusMessageEl);
      rentedUntilInput.reportValidity();
      return;
    }

    saveStatusBtn.disabled = true;
    showMessage('Saving status…', 'info', statusMessageEl);
    try {
      const data = await api(STATUS_API, '', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status, rentedUntil: rentedUntil })
      });
      setRentalUi(data.status, data.rentedUntil);
      showMessage('Rental status saved. Public site updated.', 'success', statusMessageEl);
    } catch (err) {
      showMessage('Save failed: ' + err.message, 'error', statusMessageEl);
    } finally {
      saveStatusBtn.disabled = false;
    }
  }

  vacantBtn.addEventListener('click', function () {
    setRentalUi('vacant');
  });

  rentedBtn.addEventListener('click', function () {
    setRentalUi('rented', rentedUntilInput.value || null);
    if (!rentedUntilInput.value) {
      rentedUntilInput.focus();
    }
  });

  rentedUntilInput.addEventListener('input', validateRentedUntilInput);
  rentedUntilInput.addEventListener('change', validateRentedUntilInput);

  saveStatusBtn.addEventListener('click', saveStatus);

  function setOrderDirty(dirty) {
    orderDirty = dirty;
    if (saveBtn) {
      saveBtn.disabled = !dirty;
      saveBtn.textContent = dirty ? 'Save order' : 'Order saved';
    }
  }

  async function apiPhotos(path, options) {
    return api(API, path, options);
  }

  function render() {
    listEl.innerHTML = '';
    photos.forEach(function (photo, index) {
      const li = document.createElement('li');
      li.draggable = true;
      li.dataset.index = String(index);

      li.innerHTML =
        '<span class="drag-handle" aria-hidden="true">⠿</span>' +
        '<img class="thumb" src="/photos/' + encodeURIComponent(photo.filename) + '" alt="" width="72" height="54">' +
        '<span class="photo-name">' + photo.filename + '</span>' +
        '<span class="order-badge">#' + (index + 1) + '</span>' +
        '<div class="photo-actions">' +
          '<button type="button" class="btn btn-up" title="Move up">↑</button>' +
          '<button type="button" class="btn btn-down" title="Move down">↓</button>' +
          '<button type="button" class="btn btn-danger btn-delete" title="Delete">Delete</button>' +
        '</div>';

      li.addEventListener('dragstart', onDragStart);
      li.addEventListener('dragend', onDragEnd);
      li.addEventListener('dragover', onDragOver);
      li.addEventListener('dragleave', onDragLeave);
      li.addEventListener('drop', onDrop);

      li.querySelector('.btn-up').addEventListener('click', function () {
        movePhoto(index, index - 1);
      });
      li.querySelector('.btn-down').addEventListener('click', function () {
        movePhoto(index, index + 1);
      });
      li.querySelector('.btn-delete').addEventListener('click', function () {
        deletePhoto(photo.filename);
      });

      listEl.appendChild(li);
    });
  }

  function movePhoto(from, to) {
    if (to < 0 || to >= photos.length || from === to) return;
    const item = photos.splice(from, 1)[0];
    photos.splice(to, 0, item);
    render();
    setOrderDirty(true);
  }

  function onDragStart(e) {
    dragIndex = Number(e.currentTarget.dataset.index);
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(dragIndex));
  }

  function onDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    listEl.querySelectorAll('.drag-over').forEach(function (el) {
      el.classList.remove('drag-over');
    });
    dragIndex = null;
  }

  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
  }

  function onDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
  }

  function onDrop(e) {
    e.preventDefault();
    const targetIndex = Number(e.currentTarget.dataset.index);
    e.currentTarget.classList.remove('drag-over');
    if (dragIndex === null || dragIndex === targetIndex) return;
    movePhoto(dragIndex, targetIndex);
  }

  async function loadPhotos() {
    try {
      const data = await apiPhotos('');
      photos = Array.isArray(data) ? data : (data.photos || []);
      render();
      setOrderDirty(false);
    } catch (err) {
      showMessage('Failed to load photos: ' + err.message, 'error');
    }
  }

  async function saveOrder() {
    if (!orderDirty) return;
    saveBtn.disabled = true;
    showMessage('Saving order…', 'info');
    try {
      const data = await apiPhotos('/order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: photos.map(function (p) { return p.filename; }) })
      });
      photos = data.photos || photos;
      render();
      setOrderDirty(false);
      showMessage('Order saved. Public site updated.', 'success');
    } catch (err) {
      showMessage('Save failed: ' + err.message, 'error');
      saveBtn.disabled = false;
    }
  }

  async function deletePhoto(filename) {
    if (!window.confirm('Delete "' + filename + '" from the gallery? This cannot be undone.')) {
      return;
    }
    showMessage('Deleting…', 'info');
    try {
      const data = await apiPhotos('/' + encodeURIComponent(filename), { method: 'DELETE' });
      photos = data.photos || [];
      render();
      setOrderDirty(false);
      showMessage('Deleted ' + filename, 'success');
    } catch (err) {
      showMessage('Delete failed: ' + err.message, 'error');
    }
  }

  async function uploadPhoto(file) {
    const form = new FormData();
    form.append('photo', file);
    uploadBtn.disabled = true;
    showMessage('Uploading ' + file.name + '…', 'info');
    try {
      const data = await apiPhotos('', { method: 'POST', body: form });
      photos = data.photos || photos;
      render();
      setOrderDirty(false);
      showMessage('Uploaded ' + data.filename, 'success');
      uploadInput.value = '';
    } catch (err) {
      showMessage('Upload failed: ' + err.message, 'error');
    } finally {
      uploadBtn.disabled = false;
    }
  }

  uploadBtn.addEventListener('click', function () {
    const file = uploadInput.files && uploadInput.files[0];
    if (!file) {
      showMessage('Choose a file first.', 'error');
      return;
    }
    uploadPhoto(file);
  });

  uploadInput.addEventListener('change', function () {
    if (uploadInput.files && uploadInput.files[0]) {
      uploadBtn.disabled = false;
    }
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', saveOrder);
  }

  loadStatus();
  loadPhotos();
})();
