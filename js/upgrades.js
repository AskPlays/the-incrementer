export default {
  "cog1": {
    "type": "basic",
    "currency": "number",
    "earn": (lvl) => lvl,
    "buy": (lvl) => 0,
    "cost": (lvl) => triple(lvl, 10, 2, 1.005, 100, 1000),//linToExp1(lvl, 10, 2, 100),
  },
  "cog2": {
    "type": "tickSpeed",
    "currency": "number",
    "earn": (lvl) => 0,
    "buy": (lvl, lube) => (10*lube)/(10*lube+lvl),
    "cost": (lvl) => triple(lvl, 50, 1.5, 1.01, 100, 1000),//lvl*50+100,
  },
  "cog3": {
    "type": "gearReset",
    "currency": "number",
    "earn": (lvl) => 0,
    "buy": (lvl) => 0,
    "cost": (lvl) => Math.pow((lvl+1), 2)*10000,
  },
  "cog4": {
    "type": "lubricant",
    "currency": "number",
    "earn": (lvl) => 0,
    "buy": (lvl) => 0,
    "cost": (lvl) => Math.pow(10, (lvl+1))*10000,
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

function triple(lvl, lin, exp, exp2, cutoff, cutoff2) {
  return (lvl >= cutoff2 ? Math.pow(exp2, (lvl-cutoff2))*linToExp1(cutoff2, lin, exp, cutoff) : linToExp1(lvl, lin, exp, cutoff));
}