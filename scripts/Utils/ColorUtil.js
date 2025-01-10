var ColorUtil = {};

ColorUtil.golbalColorPallete = [];
ColorUtil.setGlobalColorPallete = function( colors )
{
  if (ColorUtil.golbalColorPallete == undefined || ColorUtil.golbalColorPallete.length <= 0 )
  {
    this.golbalColorPallete = colors;
  }
}

//given saturation and lightness, will generate a color pallete composed of (2 * nPoints) colors.
ColorUtil.generateColorPallete = function(nPoints, s, l, h, sVariation)
{
  var thePallete = [];

  if (nPoints == undefined)
  {
    nPoints = 3;
  }
  if (sVariation == undefined)
  {
    sVariation = 10;
  }
  if (h == undefined)
  {
    h = Math.random() * 360;
  }

  var altSaturation = s > (100-sVariation) ? s - sVariation : s + sVariation;

  var hueStep = 360 / nPoints;
  var startHue = h;
  for (var i = 0; i < nPoints; i++)
  {
    var theHue = startHue + (hueStep * i);
    theHue = Math.wrap( theHue, 0, 360 );

    thePallete.push( [ theHue, s, l ] );
    thePallete.push( [ theHue, altSaturation, l ] );
  }

  return thePallete;
}

// Converts a #ffffff hex string into a [r,g,b] array
ColorUtil.hexToRgb = function(hex)
{
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [ parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};

// Converts a [r,g,b] array into a #ffffff hex string
ColorUtil.rgbToHex = function(rgb)
{
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
};

// Interpolates two [r,g,b] colors and returns a [r,g,b] of the result
ColorUtil.lerp = function(t, color1, color2)
{
  if (t == undefined)
  {
    t = 0.5;
  }

  var result = color1.slice();
  for (var i=0;i<3;i++)
  {
    result[i] = Math.round(result[i] + t*(color2[i]-color1[i]));
  }
  return result;
};

// Converts a [r,g,b] array into a [h,s,l] array
ColorUtil.rgbToHsl = function(color)
{
  var r = color[0]/255;
  var g = color[1]/255;
  var b = color[2]/255;

  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min)
  {
    h = s = 0; // achromatic
  }
  else
  {
    var d = max - min;
    s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
    switch(max)
    {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
};

// Converts a [h,s,l] array into a [r,g,b] array
ColorUtil.hslToRgb = function(color)
{
  var l = color[2];

  if (color[1] == 0)
  {
    l = Math.round(l*255);
    return [l, l, l];
  }
  else
  {
    var s = color[1];
    var q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
    var p = 2 * l - q;
    var r = this.hueToRgb(p, q, color[0] + 1/3);
    var g = this.hueToRgb(p, q, color[0]);
    var b = this.hueToRgb(p, q, color[0] - 1/3);
    return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
  }
};


ColorUtil.hueToRgb = function(p, q, t)
{
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}

ColorUtil.lerpHSL = function(t, color1, color2)
{
  if (t == undefined)
  {
    t = 0.5;
  }

  var hsl1 = this.rgbToHsl(color1);
  var hsl2 = this.rgbToHsl(color2);

  for (var i=0;i<3;i++)
  {
    hsl1[i] += t*(hsl2[i]-hsl1[i]);
  }

  return this.hslToRgb(hsl1);
};
