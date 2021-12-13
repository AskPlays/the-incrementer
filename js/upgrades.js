export default {
  "cog1": {
    "type": "basic",
    "currency": "number",
    "earn": (lvl) => lvl,
    "buy": (lvl) => 0,
    "cost": (lvl) => linToExp(lvl, 10, 2, 100),
  },
  "cog2": {
    "type": "tickSpeed",
    "currency": "number",
    "earn": (lvl) => 0,
    "buy": (lvl) => 10/(10+lvl),
    "cost": (lvl) => linToExp(lvl, 50, 2, 100)+100,
  },
  "cog3": {
    "type": "gearRatio",
    "currency": "number",
    "earn": (lvl) => 0,
    "buy": (lvl) => 5/(5+lvl),
    "cost": (lvl) => Math.pow((lvl+1), 2)*10000,
  },
}


function linToExp(lvl, lin, exp, cutoff) {
  return lvl >= cutoff ? cutoff*lin+Math.pow((lvl-cutoff), exp)*lin : lvl*lin;
}