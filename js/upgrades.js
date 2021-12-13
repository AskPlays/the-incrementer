export default {
  "cog1": {
    "type": "basic",
    "currency": "number",
    "earn": (lvl) => lvl,
    "buy": (lvl) => 0,
    "cost": (lvl) => lvl*10,
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
    "cost": (lvl) => lvl*50+10000,
  },
}