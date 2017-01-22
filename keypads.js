var classical =
{
  dims : 2,
  min : [-1, -1]
  max : [-1, -1],
  freq : function (d1, d2) {return base.freq * Math.exp(2, d1 / 12 + d2);},
  pos_x : function (d1, d2) {return base.pos_x + 32 * d1;},
  pos_y : function (d1, d2) {return base.pos_y + 128 * d2;},
  size_x: 32;
  size_y: 128;
}

var harmonic12 =
{
  dims : 2,
  min : [-1, -1]
  max : [-1, -1],
  freq : function (d1, d2) {return base.freq * Math.exp(2, d1 / 12 + d2);},
}
