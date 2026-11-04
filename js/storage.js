// storage.js — persistence layer
const Store = {
  KEY: 'hobo.drift.v1',
  load() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || this.fresh(); }
    catch (e) { return this.fresh(); }
  },
  save(state) { localStorage.setItem(this.KEY, JSON.stringify(state)); },
  fresh() {
    return { flares: [], pouch: [], theme: 'theme-night', me: this.myId() };
  },
  myId() {
    let id = localStorage.getItem('hobo.uid');
    if (!id) { id = 'u-' + Math.random().toString(36).slice(2, 10); localStorage.setItem('hobo.uid', id); }
    return id;
  }
};