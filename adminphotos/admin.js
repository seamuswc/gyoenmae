(function () {
  const API = '/api/photos';
  const listEl = document.getElementById('photo-list');
  const messageEl = document.getElementById('message');
  const uploadInput = document.getElementById('upload-input');
  const uploadBtn = document.getElementById('upload-btn');
  const saveBtn = document.getElementById('save-order-btn');

  let photos = [];
  let dragIndex = null;
  let orderDirty = false;

  function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = 'message visible ' + (type || 'info');
    if (type === 'success') {
      window.setTimeout(function () {
        if (messageEl.textContent === text) {
          messageEl.classList.remove('visible');
        }
      }, 3500);
    }
  }

  function setOrderDirty(dirty) {
    orderDirty = dirty;
    if (saveBtn) {
      saveBtn.disabled = !dirty;
      saveBtn.textContent = dirty ? 'Save order' : 'Order saved';
    }
  }

  async function api(path, options) {
    const opts = Object.assign({ credentials: 'include' }, options || {});
    const res = await fetch(API + (path || ''), opts);
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
      const data = await api('');
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
      const data = await api('/order', {
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
      const data = await api('/' + encodeURIComponent(filename), { method: 'DELETE' });
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
      const data = await api('', { method: 'POST', body: form });
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

  loadPhotos();
})();
