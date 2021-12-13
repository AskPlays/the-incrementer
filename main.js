// Made by AskPlays

import Upgrades from './js/upgrades.js';

const BuyModes = ["1x", "10x", "100x", "max"];

class Game {
  constructor() {
    this.number = 0;
    this.tick = 0;
    this.tickSpeed = 1;
    this.gearRatio = 1;
    this.upgrades = {};
    this.states = {};
    this.buyMode = 0;
    
    this.E = {}
    const elts = ['cog', 'enable', 'buyMode', 'basic', 'number', 'tickSpeed'];
    for(const id of elts) {
      this.E[id] = document.getElementById(id); 
    }
    this.listen('enable', "click", (e)=>{this.upgrade("cog1", 1); e.currentTarget.remove()});
    this.listen('buyMode', "click", (e)=>this.changeBuyMode());

    const keys = Object.keys(Upgrades);
    for(const key of keys) {
      this.E[key] = document.getElementById(key); 
      this.listen(key, "click", (e)=>this.upgrade(key));
    }

    this.load();
    setInterval(()=>{this.save()}, 10000);
  }
  update() {
    this.tick++;
    const prevNum = this.number;
    
    const keys = Object.keys(this.upgrades);
    for(const key of keys) {
      if(Upgrades[key].type == "basic") {
        this.number += Upgrades[key].earn(this.upgrades[key])*this.gearRatio;
      }
    }

    // display
    this.E.number.innerText = round(this.number) + ` (${round((this.number-prevNum)*this.tickSpeed)} n/s)`;
    this.E.tickSpeed.innerText = round(this.tickSpeed);
    if(this.upgrades["cog1"]) {
      this.E.cog.style.animationName = this.tickSpeed >= 3 ? "rotate": "rotateTick";
      this.E.cog.style.animationTimingFunction = this.tickSpeed >= 3 ? "linear" : "ease-in-out";
      this.E.cog.style.animationDuration = 1/this.tickSpeed+"s";
    } else this.E.cog.style.animationDuration = "0s";
    // this.E.cog.style.transform = `rotate(${this.tick*20}deg)`;
  }
  upgrade(id, amnt=null) {
    const upgrade = Upgrades[id];
    const repeats = amnt!= null ? amnt : ([1, 10, 100, Infinity])[this.buyMode];
    let repeat = 0;
    // if(typeof this.upgrades[id] === "undefined") this.upgrades[id] = 0;
    while(this[upgrade.currency] >= upgrade.cost(this.upgrades[id] || 0) && repeat < repeats) {
      this[upgrade.currency] -= upgrade.cost(this.upgrades[id]);
      if(upgrade.type == "tickSpeed") this.changeSpeed(this.tickSpeed + upgrade.buy(this.upgrades[id]));
      if(upgrade.type == "gearRatio") {
        this.gearRatio = this.tickSpeed;
        this.changeSpeed(1);
        delete this.upgrades["cog1"];
        delete this.upgrades["cog2"];
        this.updateUpgrade("cog1");
        this.updateUpgrade("cog2");
      }
      this.upgrades[id]++;
      repeat++;
    }
    
    this.updateUpgrade(id);
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
  updateUpgrade(id) {
    this.E[id].children[1].innerText = this.upgrades[id] || 0;
    this.E[id].children[2].innerText = "Cost: "+Upgrades[id].cost(this.upgrades[id] || 0);
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
      const keys = Object.keys(Upgrades);
      for(const key of keys) {
        this.upgrade(key, 0);
        this.updateUpgrade(key);
      }
      if(this.upgrades["cog1"]) this.E.enable.remove();
    }
  }
  listen(id, type, func) {
    const elt = this.E[id] ? this.E[id] : document.getElementById(id);
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