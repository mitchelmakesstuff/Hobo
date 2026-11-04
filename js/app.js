// app.js — bootstrap & wiring
(function () {
  let state = Store.load();
  Flares.init(state);
  const engine = new DriftEngine(document.getElementById('field'));
  let selectedMood = '#ff6b8b', activeFlare = null, themeIdx = 0, drawing = false;
  const themes = ['theme-night', 'theme-day', 'theme-dream'];

  // restore state
  document.body.className = state.theme || 'theme-night';
  themeIdx = Math.max(0, themes.indexOf(state.theme));
  const mine = state.flares.filter(f => f.mine);
  state.flares = Flares.ghosts().concat(mine);
  UI.pouchCount(state.pouch.length);

  // ghost flares appear over time
  setInterval(() => {
    if (state.flares.filter(f => f.by === 'ghost').length < 8) {
      engine.add(Flares.ghosts()[0]);
    }
  }, 20000);

  const persist = () => {
    state.theme = document.body.className;
    Store.save({ ...state, flares: state.flares.filter(f => f.mine || f.caught) });
  };

  // add existing flares to the field
  for (const f of state.flares) engine.add(f);
  state.flares = engine.flares;

  // theme cycle
  document.getElementById('btn-theme').onclick = () => {
    themeIdx = (themeIdx + 1) % themes.length;
    document.body.className = themes[themeIdx];
    persist();
  };

  // catch by tap
  engine.c.addEventListener('pointerdown', e => {
    const f = engine.findNear(e.clientX, e.clientY, 44);
    if (f) showCatch(f);
  });

  // ---- drop modal ----
  const moodBtns = document.querySelectorAll('.mood');
  moodBtns.forEach(b => b.onclick = () => {
    selectedMood = b.dataset.mood;
    moodBtns.forEach(x => x.classList.remove('sel'));
    b.classList.add('sel');
  });
  moodBtns[0].classList.add('sel');

  document.getElementById('btn-drop').onclick = () => UI.open('#modal-drop');
  document.getElementById('drop-cancel').onclick = () => UI.close('#modal-drop');

  document.querySelectorAll('.tab').forEach(t => t.onclick = () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.getElementById('drop-text').hidden = t.dataset.tab !== 'text';
    document.getElementById('drop-doodle').hidden = t.dataset.tab !== 'doodle';
  });

  // doodle pad
  const pad = document.getElementById('doodle-pad'), pctx = pad.getContext('2d');
  pctx.strokeStyle = '#fff'; pctx.lineWidth = 3; pctx.lineCap = 'round';
  const pos = e => {
    const r = pad.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (pad.width / r.width), y: (e.clientY - r.top) * (pad.height / r.height) };
  };
  pad.addEventListener('pointerdown', e => { drawing = true; const p = pos(e); pctx.beginPath(); pctx.moveTo(p.x, p.y); });
  pad.addEventListener('pointermove', e => { if (drawing) { const p = pos(e); pctx.lineTo(p.x, p.y); pctx.stroke(); } });
  pad.addEventListener('pointerup', () => drawing = false);
  document.getElementById('doodle-clear').onclick = () => pctx.clearRect(0, 0, pad.width, pad.height);

  document.getElementById('drop-send').onclick = () => {
    const text = document.getElementById('flare-text').value.trim();
    const doodle = document.getElementById('drop-doodle').hidden ? null : pad.toDataURL();
    if (!text && !doodle) return;
    const f = Flares.make({ text: text, doodle: doodle, mood: selectedMood });
    Flares.drop(f);
    engine.add(f);
    UI.close('#modal-drop');
    document.getElementById('flare-text').value = '';
    pctx.clearRect(0, 0, pad.width, pad.height);
    persist();
    flashHint('flare released — watch it drift');
  };

  // ---- catch modal ----
  function showCatch(f) {
    activeFlare = f;
    document.getElementById('catch-body').innerHTML = UI.flareCard(f);
    document.getElementById('echo-text').value = '';
    UI.open('#modal-catch');
  }
  document.getElementById('catch-close').onclick = () => UI.close('#modal-catch');
  document.getElementById('catch-keep').onclick = () => {
    if (!state.pouch.includes(activeFlare.id)) {
      Flares.catch(activeFlare);
      UI.pouchCount(state.pouch.length);
    }
    UI.close('#modal-catch'); persist();
    flashHint('kept in your pouch');
  };
  document.getElementById('echo-send').onclick = () => {
    const t = document.getElementById('echo-text').value.trim();
    if (!t || !activeFlare) return;
    const anchor = { x: activeFlare.x, y: activeFlare.y };
    Flares.echo(activeFlare, t);
    const echoFlare = Flares.make({ text: t, mood: activeFlare.mood });
    echoFlare.mine = true;
    Flares.drop(echoFlare);
    const placed = engine.add(echoFlare);
    engine.echoLine(anchor, placed);
    UI.close('#modal-catch'); persist();
    flashHint('echo drifting back');
  };

  // ---- pouch ----
  document.getElementById('btn-pouch').onclick = () => {
    const kept = state.flares.filter(f => state.pouch.includes(f.id));
    document.getElementById('pouch-list').innerHTML = kept.map(UI.flareCard).join('');
    UI.open('#modal-pouch');
  };
  document.getElementById('pouch-close').onclick = () => UI.close('#modal-pouch');

  function flashHint(msg) {
    const h = document.getElementById('hint');
    const old = h.textContent;
    h.textContent = msg;
    setTimeout(() => h.textContent = old, 2200);
  }

  window.addEventListener('beforeunload', persist);
})();