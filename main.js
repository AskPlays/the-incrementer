// Made by AskPlays

import Upgrades from './js/upgrades.js';

const BuyModes = ["1x", "10x", "100x", "max"];

class Game {
  constructor() {
    this.number = 0;
    this.tick = 0;
    this.tickSpeed = 10;
    this.upgrades = {};
    this.states = {};
    this.buyMode = 0;
    
    this.E = {}
    const elts = ['cog', 'enable', 'buyMode', 'basic', 'number'];
    for(const id of elts) {
      this.E[id] = document.getElementById(id); 
    }
    this.listen('enable', "click", (e)=>{this.upgrade("cog1", 1); e.currentTarget.remove()});
    this.listen('buyMode', "click", (e)=>this.changeBuyMode());

    this.load();
  }
  update() {
    this.tick++;
    
    const keys = Object.keys(this.upgrades);
    for(const key of keys) {
      if(this.tick%Upgrades[key].ticks == 0) this.number += Upgrades[key].earn(this.upgrades[key]);
    }

    // display
    this.E.number.innerText = round(this.number);
    if(this.upgrades["cog1"]) {
      this.E.cog.style.animationName = this.tickSpeed >= 30 ? "rotate": "rotateTick";
      this.E.cog.style.animationTimingFunction = this.tickSpeed >= 30 ? "linear" : "ease-in-out";
      this.E.cog.style.animationDuration = 10/this.tickSpeed+"s";
    } else this.E.cog.style.animationDuration = "0s";
    // this.E.cog.style.transform = `rotate(${this.tick*20}deg)`;
    if(this.tick/this.tickSpeed % 10 == 0) this.save();
  }
  upgrade(id, amnt=null) {
    const upgrade = Upgrades[id];
    const repeats = amnt || ([1, 10, 100, Infinity])[this.buyMode];
    let repeat = 0;
    if(typeof this.upgrades[id] === "undefined") this.upgrades[id] = 0;
    while(this[upgrade.currency] > upgrade.cost(this.upgrades[id]) && repeat < repeats) {
      this[upgrade.currency] -= upgrade.cost(this.upgrades[id]);
      this.upgrades[id]++;
      repeat++;
    }
    this.E[upgrade.type].children[0].children[1].innerText = this.upgrades[id];
  }
  changeSpeed(spd) {
    this.tickSpeed = spd;
    clearInterval(this.interval);
    this.interval = setInterval(()=>{window.game.update()}, 1000/spd);
  }
  changeBuyMode() {
    this.buyMode = (this.buyMode+1)%BuyModes.length;
    this.E.buyMode.innerText = BuyModes[this.buyMode]; 
  }
  save() {
    localStorage.setItem('save', JSON.stringify({
      number: this.number,
      tick: this.tick,
      tickSpeed: this.tickSpeed,
      upgrades: this.upgrades,
      states: this.states,
    }));
  }
  load() {
    const save = JSON.parse(localStorage.getItem('save'));
    if(save) {
      Object.assign(this, save);
      const keys = Object.keys(this.upgrades);
      for(const key of keys) {
        this.upgrade(key, 0);
      }
      if(this.upgrades["cog1"]) this.E.enable.remove();
    }
  }
  listen(id, type, func) {
    const elt = this.E[id];
    if(elt) elt.addEventListener(type, func);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
  window.game.changeSpeed(window.game.tickSpeed);
});

function round(num) {
  if(num > 1000000) {
    const log = Math.floor(Math.log10(num));
    return Math.round(num/Math.pow(10, log)*100)/100+"e"+log;
  }
  return Math.round(num*100)/100;
}

function hide(elt) {
  elt.classList.add('hidden');
}

function show(elt) {
  elt.classList.remove('hidden');
}