// flares.js — flare model & ghost generation
const Flares = {
  state: null,
  init(state) { this.state = state; },
  uid() { return 'f-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); },
  make(opts) {
    return {
      id: this.uid(), by: opts.by || 'you',
      text: opts.text || '', doodle: opts.doodle || null,
      mood: opts.mood || '#ff6b8b',
      ts: Date.now(), echoes: [], caught: false, mine: true
    };
  },
  drop(flare) { this.state.flares.push(flare); },
  catch(flare) { flare.caught = true; this.state.pouch.push(flare.id); },
  echo(flare, text) {
    flare.echoes.push({ by: 'you', text: text, ts: Date.now() });
  },
  ghosts() {
    const seeds = [
      'the night tastes like static', 'i miss tram stations', 'found a coin, felt rich',
      'sleep is a rumor', 'the clouds are gossiping', 'hot tea > hot takes',
      'somewhere a train is right on time', 'the moon owes me money'
    ];
    return seeds.map(s => ({
      id: this.uid(), by: 'ghost', text: s, doodle: null,
      mood: ['#7bdff2', '#ffd166', '#b8f2a9', '#d5b3ff', '#ff6b8b'][Math.floor(Math.random() * 5)],
      ts: Date.now() - Math.random() * 8.64e7, echoes: [], caught: false, mine: false
    }));
  }
};