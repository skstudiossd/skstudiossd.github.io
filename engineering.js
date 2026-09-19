(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hover = matchMedia('(hover: hover)');
  const preview = document.getElementById('fighter-preview');
  const cover = document.getElementById('fighter-cover');
  let frame = 0;
  let hovering = false;
  let focused = false;
  const startOrbit = '45deg 60deg 105%';
  function stopSpin() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (preview) {
      preview.cameraOrbit = startOrbit;
      if (preview.jumpCameraToGoal) preview.jumpCameraToGoal();
    }
  }
  function startSpin() {
    stopSpin();
    if (!preview || !preview.loaded || reduceMotion.matches || !(hovering || focused) || document.hidden) return;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / 6000, 1);
      // One full orbit per hover/focus, ending at the original three-quarter view.
      const eased = t * t * (3 - 2 * t);
      preview.cameraOrbit = `${45 + 360 * eased}deg 60deg 105%`;
      preview.jumpCameraToGoal();
      if (t < 1) frame = requestAnimationFrame(tick);
      else stopSpin();
    }
    frame = requestAnimationFrame(tick);
  }
  if (cover) {
    cover.addEventListener('pointerenter', () => { hovering = hover.matches; startSpin(); });
    cover.addEventListener('pointerleave', () => { hovering = false; if (!focused) stopSpin(); });
    cover.addEventListener('focus', () => { focused = true; startSpin(); });
    cover.addEventListener('blur', () => { focused = false; if (!hovering) stopSpin(); });
    reduceMotion.addEventListener('change', stopSpin);
    document.addEventListener('visibilitychange', stopSpin);
  }
  document.querySelectorAll('model-viewer').forEach(model => {
    const fallback = model.parentElement.querySelector(':scope > img');
    function loaded() {
      model.classList.add('ready');
      if (fallback) fallback.hidden = true;
      if (model === preview) startSpin();
      if (model.id === 'fighter-detail') {
        document.getElementById('model-status').textContent = 'Interactive model ready.';
        document.getElementById('reset-model').hidden = false;
      }
    }
    model.addEventListener('load', loaded);
    if (model.loaded) loaded();
    model.addEventListener('error', () => {
      model.classList.remove('ready');
      if (fallback) fallback.hidden = false;
      if (model.id === 'fighter-detail') {
        document.getElementById('model-status').textContent = 'The interactive model could not load. You can view the preview or download the model below.';
        document.getElementById('reset-model').hidden = true;
      }
    });
  });
  const detail = document.getElementById('fighter-detail');
  if (detail) {
    document.getElementById('reset-model').addEventListener('click', () => {
      detail.cameraOrbit = startOrbit;
      detail.cameraTarget = 'auto auto auto';
      detail.fieldOfView = 'auto';
      if (reduceMotion.matches) detail.jumpCameraToGoal();
    });
    // Keep a usable static preview if the external viewer script is unavailable.
    setTimeout(() => {
      if (!customElements.get('model-viewer')) document.getElementById('model-status').textContent = '3D viewing is unavailable. The model preview and download are still available.';
    }, 15000);
  }
  const photo = document.getElementById('project-photo');
  if (photo) {
    const links = [...document.querySelectorAll('.photo-thumbs a')];
    let index = 0;
    function show(next) {
      index = (next + links.length) % links.length;
      photo.src = links[index].getAttribute('href');
      photo.alt = links[index].dataset.caption;
      document.getElementById('photo-caption').textContent = photo.alt;
      document.getElementById('photo-count').textContent = `${index + 1} / ${links.length}`;
      links.forEach((link, i) => {
        if (i === index) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }
    document.getElementById('gallery-controls').hidden = false;
    links.forEach((link, i) => link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); show(i);
    }));
    document.getElementById('photo-prev').addEventListener('click', () => show(index - 1));
    document.getElementById('photo-next').addEventListener('click', () => show(index + 1));
    document.querySelector('.project-media').addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); show(index + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
  }
})();
