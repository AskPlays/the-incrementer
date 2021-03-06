// Made by AskPlays

import Upgrades from './js/upgrades.js';

const BuyModes = ["1x", "10x", "100x", "max"];

class Game {
  constructor() {
    this.number = 0;
    this.pNumber = 0;
    this.cNumber = [];
    this.tick = 0;
    this.tickSpeed = 1;
    this.gearRatio = 1;
    this.lubricant = 1;
    this.upgrades = {};
    this.states = {};
    this.buyMode = 0;
    this.pTime = performance.timeOrigin+performance.now();
    this.delta = 0;
    this.deltas = [];
    
    this.E = {}
    const elts = ['cog', 'enable', 'buyMode', 'basic', 'number', 'numberGain', 'tickSpeed', 'gearRatio', 'lubricant', 'offline', 'offlineWrapper', 'oNumber', 'oNumberGain'];
    for(const id of elts) {
      this.E[id] = document.getElementById(id); 
    }
    this.listen('enable', "click", (e)=>{this.upgrade("cog1", 1); hide(e.currentTarget)});
    this.listen('buyMode', "click", (e)=>this.changeBuyMode());
    this.listen('offlineWrapper', "click", (e)=>{if(e.currentTarget == e.target) hide(e.currentTarget);});

    const keys = Object.keys(Upgrades);
    for(const key of keys) {
      this.E[key] = document.getElementById(key); 
      this.listen(key, "click", (e)=>this.upgrade(key));
    }

    console.log(this.number);
    this.load();
    console.log(this.number);
    setInterval(()=>{this.save()}, 10000);
    this.update();
    console.log(this.number);
  }
  update() {
    const time = performance.timeOrigin+performance.now();
    this.delta = time-this.pTime;
    if(this.delta < 0) this.delta = 0;
    this.pTime = time;
    this.deltas.unshift(this.delta);
    this.deltas = this.deltas.slice(0, 60);
    this.tick++;
    this.pNumber = this.number;

    if(this.delta >= 1000*60) {
      show(this.E.offlineWrapper);
      let preNumber = this.number;
      let repeat = 0;
      let timer = 0;
      while(timer < this.delta && repeat < 10000) {
        const keys = Object.keys(this.upgrades);
        for(const key of keys) {
          if(Upgrades[key].type == "basic") {
            this.number += Upgrades[key].earn(this.upgrades[key])*this.gearRatio*this.tickSpeed;
          }
        }
        timer += 1000;
        if(repeat % 60 == 0) {
          this.E.oNumber.innerText = round(this.number);
          this.E.oNumberGain.innerText = round(this.number-preNumber);
        }
        repeat++;
      }
      this.E.oNumber.innerText = round(this.number);
      this.E.oNumberGain.innerText = round(this.number-preNumber);
    }

    if(this.tickSpeed >= 30) {
      this.mult = this.delta/1000*this.tickSpeed;
      const keys = Object.keys(this.upgrades);
      for(const key of keys) {
        if(Upgrades[key].type == "basic") {
          this.number += Upgrades[key].earn(this.upgrades[key])*this.gearRatio*this.mult;
        }
      }
    } else {
      const keys = Object.keys(this.upgrades);
      for(const key of keys) {
        if(Upgrades[key].type == "basic") {
          this.number += Upgrades[key].earn(this.upgrades[key])*this.gearRatio;
        }
      }
    }

    this.cNumber.unshift(this.number-this.pNumber);
    this.cNumber = this.cNumber.slice(0, 10);
    
    this.display();
  }
  display() {
    // display
    const keys = Object.keys(Upgrades);
    for(const key of keys) {
      this.updateUpgrade(key);
    }

    this.E.number.innerText = round(this.number);
    if(this.tickSpeed >= 30) {
      const delta = this.deltas.reduce((a, b)=>a+b, 0)/this.deltas.length;
      const cNumber = this.cNumber.reduce((a, b)=>a+b, 0)/this.cNumber.length;
      this.E.numberGain.innerText = `${round(cNumber*delta/1000*this.tickSpeed)} n/s`;
    } else this.E.numberGain.innerText = `${round((this.number-this.pNumber)*this.tickSpeed)} n/s`;
    this.E.tickSpeed.innerText = round(this.tickSpeed) +" Hz";
    this.E.gearRatio.innerText = round(this.gearRatio);
    this.E.lubricant.innerText = round(this.lubricant);
    if(this.upgrades["cog1"]) {
      hide(this.E.enable);
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
    if(typeof this.upgrades[id] === "undefined") this.upgrades[id] = 0;
    while(this[upgrade.currency] >= upgrade.cost(this.upgrades[id]) && repeat < repeats) {
      this[upgrade.currency] -= upgrade.cost(this.upgrades[id]);
      if(upgrade.type == "tickSpeed") this.changeSpeed(this.tickSpeed + upgrade.buy(this.upgrades[id], this.lubricant));
      if(upgrade.type == "gearReset") {
        if(confirm("Are you sure you want to Gear Reset?\nThis will reset your number and basic upgrades,\nbut will apply a permanent multiplier to number gain.")) {
          this.gearRatio += this.tickSpeed-1;
          this.changeSpeed(1);
          this.number = 0;
          delete this.upgrades["cog1"];
          delete this.upgrades["cog2"];
          this.updateUpgrade("cog1");
          this.updateUpgrade("cog2");
          show(this.E.enable);
        } else break;
      }
      if(upgrade.type == "lubricant") this.lubricant++;
      this.upgrades[id]++;
      repeat++;
    }
    
    //this.updateUpgrade(id);
    this.display();
  }
  changeSpeed(spd) {
    this.tickSpeed = spd;
    clearInterval(this.interval);
    this.interval = setInterval(()=>{window.game.update()}, Math.max(1000/spd, 1000/30));
  }
  changeBuyMode() {
    this.buyMode = (this.buyMode+1)%BuyModes.length;
    this.E.buyMode.innerText = BuyModes[this.buyMode]; 
  }
  updateUpgrade(id) {
    this.E[id].children[1].innerText = this.upgrades[id] || 0;
    this.E[id].children[2].innerText = "Cost: "+round(Upgrades[id].cost(this.upgrades[id] || 0));
  }
  save() {
    localStorage.setItem('save', JSON.stringify({
      number: this.number,
      tick: this.tick,
      tickSpeed: this.tickSpeed,
      gearRatio: this.gearRatio,
      lubricant: this.lubricant,
      upgrades: this.upgrades,
      states: this.states,
      buyMode: this.buyMode,
      pTime: this.pTime,
    }));
  }
  load() {
    const save = JSON.parse(localStorage.getItem('save'));
    if(save) {
      Object.assign(this, save);
      this.E.buyMode.innerText = BuyModes[this.buyMode]; 
      const keys = Object.keys(Upgrades);
      for(const key of keys) {
        //this.upgrade(key, 0);
        this.updateUpgrade(key);
      }
      if(this.upgrades["cog1"]) hide(this.E.enable);
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
  if(Math.abs(num) >= 1000000) {
    const log = Math.floor(Math.log10(Math.abs(num)));
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