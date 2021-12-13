export default {
  "cog1": {
    "type": "basic",
    "currency": "number",
    "earn": (lvl) => lvl,
    "buy": (lvl) => 0,
    "cost": (lvl) => linToExp1(lvl, 10, 2, 100),
  },
  "cog2": {
    "type": "tickSpeed",
    "currency": "number",
    "earn": (lvl) => 0,
    "buy": (lvl) => 10/(10+lvl),
    "cost": (lvl) => lvl*50+100,
  },
  "cog3": {
    "type": "gearRatio",
    "currency": "number",
    "earn": (lvl) => 0,
    "buy": (lvl) => 5/(5+lvl),
    "cost": (lvl) => Math.pow((lvl+1), 2)*10000,
  },
}


function linToExp1(lvl, lin, exp, cutoff) {
  return lvl >= cutoff ? cutoff*lin+Math.pow((lvl-cutoff), exp)*lin : lvl*lin;
}

function linToExp2(lvl, lin, exp, cutoff) {
  return lvl >= cutoff ? cutoff*lin+Math.pow(lin*(lvl-cutoff), exp) : lvl*lin;
}

function linToExp3(lvl, lin, exp, cutoff) {
  return lvl >= cutoff ? cutoff*lin+Math.pow(lin, exp+(lvl-cutoff)) : lvl*lin;
}