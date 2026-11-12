// drift-engine.js — canvas drift field with gentle physics
class DriftEngine {
  constructor(canvas) {
    this.c = canvas; this.ctx = canvas.getContext('2d');
    this.flares = []; this.lines = []; this.t = 0;
    this.resize(); window.addEventListener('resize', () => this.resize());
    requestAnimationFrame(() => this.loop());
  }
  resize() { this.w = this.c.width = innerWidth; this.h = this.c.height = innerHeight; }
  add(flare) {
    flare.x = flare.x !== undefined ? flare.x : Math.random() * this.w;
    flare.y = flare.y !== undefined ? flare.y : Math.random() * this.h;
    flare.vx = (Math.random() - .5) * .18;
    flare.vy = (Math.random() - .5) * .18;
    flare.wob = Math.random() * Math.PI * 2;
    this.flares.push(flare);
    return flare;
  }
  remove(id) { this.flares = this.flares.filter(f => f.id !== id); }
  findNear(x, y, r) {
    let best = null, bd = r * r;
    for (const f of this.flares) {
      const d = (f.x - x) * (f.x - x) + (f.y - y) * (f.y - y);
      if (d < bd) { bd = d; best = f; }
    }
    return best;
  }
  echoLine(from, to) { this.lines.push({ from, to, life: 1 }); }
  loop() {
    this.t += .016;
    const ctx = this.ctx;
    const bg = getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#0d0f1a';
    ctx.fillStyle = bg; ctx.fillRect(0, 0, this.w, this.h);

    // echo trace lines
    this.lines = this.lines.filter(l => (l.life -= .004) > 0);
    for (const l of this.lines) {
      ctx.strokeStyle = 'rgba(255,255,255,' + (l.life * .3) + ')';
      ctx.setLineDash([4, 6]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(l.from.x, l.from.y); ctx.lineTo(l.to.x, l.to.y); ctx.stroke();
      ctx.setLineDash([]);
    }

    for (const f of this.flares) {
      f.wob += .02;
      f.x += f.vx + Math.sin(f.wob) * .08;
      f.y += f.vy + Math.cos(f.wob * .8) * .08;
      if (f.x < -60) f.x = this.w + 60; if (f.x > this.w + 60) f.x = -60;
      if (f.y < -60) f.y = this.h + 60; if (f.y > this.h + 60) f.y = -60;

      const r = 6 + Math.sin(this.t * 2 + f.wob) * 1.5;
      const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r * 5);
      grad.addColorStop(0, f.mood);
      grad.addColorStop(.35, f.mood + '55');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(f.x, f.y, r * 5, 0, 7); ctx.fill();
      ctx.fillStyle = f.mood;
      ctx.beginPath(); ctx.arc(f.x, f.y, r, 0, 7); ctx.fill();

      if (f.text) {
        ctx.font = '600 11px system-ui';
        ctx.fillStyle = 'rgba(255,255,255,.75)';
        const txt = f.text.length > 18 ? f.text.slice(0, 17) + '…' : f.text;
        ctx.fillText(txt, f.x - ctx.measureText(txt).width / 2, f.y - r - 8);
      }
      if (f.caught) {
        ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(f.x, f.y, r + 5, 0, 7); ctx.stroke();
      }
    }
    requestAnimationFrame(() => this.loop());
  }
}