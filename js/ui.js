// ui.js — overlays, modals, pouch
const UI = {
  $: s => document.querySelector(s),
  open(id) { const m = UI.$(id); m.hidden = false; },
  close(id) { UI.$(id).hidden = true; },
  pouchCount(n) { UI.$('#pouch-count').textContent = n; },
  flareCard(f) {
    let h = '<div class="flare-card">';
    if (f.doodle) h += '<img src="' + f.doodle + '" style="width:100%;border-radius:8px">';
    if (f.text) h += '<div>' + f.escapeHtml(f.text) + '</div>';
    for (const e of f.echoes) h += '<div class="echo">↩ ' + f.escapeHtml(e.text) + '</div>';
    h += '<div class="meta">' + f.by + ' · ' + UI.ago(f.ts) + '</div></div>';
    return h;
  },
  ago(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + 'm';
    if (s < 86400) return Math.floor(s / 3600) + 'h';
    return Math.floor(s / 86400) + 'd';
  },
  escapeHtml(t) {
    return String(t).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
};