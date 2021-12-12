export default {
  "cog1": {
    "type": "basic",
    "currency": "number",
    "ticks": 10,
    "earn": (lvl) => lvl/10,
    "cost": (lvl) => lvl*10,
  },
  "cog2": {
    "type": "tickSpeed",
    "currency": "number",
    "ticks": Infinity,
    "earn": (lvl) => 1,
    "cost": (lvl) => lvl*10+100,
  },
}