/**
 * Copyright 2018 Double_oxygeN
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

import BlendMode from './BlendMode.js';
import AlphaBlendMode from './AlphaBlendMode.js';

const _privates = new WeakMap();
const getPrivates = self => {
  let p = _privates.get(self);
  if (!p) _privates.set(self, p = {});
  return p;
};

const D65 = {
  x: 95.047,
  y: 100.000,
  z: 108.883
};
const EPSILON = 0.008856;
const KAPPA = 903.3;
const dr = D65.x + 15 * D65.y + 3 * D65.z;
const ur = 4 * D65.x / dr;
const uv = 9 * D65.y / dr;

/**
 * Class representing a color.
 * @param {number} r red
 * @param {number} g green
 * @param {number} b blue
 * @param {number} [a=1.0] alpha
 */
export default class Color {
  constructor(r, g, b, a = 1.0) {
    const privates = getPrivates(this);

    privates.r = r;
    privates.g = g;
    privates.b = b;
    privates.a = a;
  }

  /**
   * @member {Object}
   */
  get rgb() {
    const privates = getPrivates(this);
    return {
      r: privates.r,
      g: privates.g,
      b: privates.b,
      alpha: privates.a
    };
  }

  /**
   * @member {Object}
   */
  get hsv() {
    const privates = getPrivates(this);
    const MAX = Math.max(privates.r, privates.g, privates.b);
    const MIN = Math.min(privates.r, privates.g, privates.b);
    const DELTA = MAX - MIN;
    const H = DELTA <= 0 ? 0 :
      privates.r >= MAX ? ((privates.g - privates.b) / DELTA) * 60 :
      privates.g >= MAX ? ((privates.b - privates.r) / DELTA + 2) * 60 : ((privates.r - privates.g) / DELTA - 2) * 60;
    return {
      h: H - 360 * Math.floor(H / 360),
      s: MAX ? DELTA / MAX : 0,
      v: MAX / 0xff,
      alpha: privates.a
    };
  }

  /**
   * @member {Object}
   */
  get hsl() {
    const privates = getPrivates(this);
    const MAX = Math.max(privates.r, privates.g, privates.b);
    const MIN = Math.min(privates.r, privates.g, privates.b);
    const DELTA = MAX - MIN;
    const CNT = (MAX + MIN) / 2;
    const H = DELTA <= 0 ? 0 :
      privates.r >= MAX ? ((privates.g - privates.b) / DELTA) * 60 :
      privates.g >= MAX ? ((privates.b - privates.r) / DELTA + 2) * 60 : ((privates.r - privates.g) / DELTA - 2) * 60;
    return {
      h: H - 360 * Math.floor(H / 360),
      s: DELTA ? DELTA / (0xff - Math.abs(CNT - 0xff)) : 0,
      l: CNT / 0xff,
      alpha: privates.a
    };
  }

  /**
   * @member {Object}
   */
  get xyz() {
    const privates = getPrivates(this);
    return {
      x: 0.4124564 * privates.r + 0.3575761 * privates.g + 0.1804375 * privates.b,
      y: 0.2126729 * privates.r + 0.7151522 * privates.g + 0.0721750 * privates.b,
      z: 0.0193339 * privates.r + 0.1191920 * privates.g + 0.9503041 * privates.b,
      alpha: privates.a
    };
  }

  /**
   * @member {Object}
   */
  get Yxy() {
    const XYZ = this.xyz;
    const totalStimuli = XYZ.x + XYZ.y + XYZ.z;
    return {
      Y: XYZ.y,
      x: XYZ.x / totalStimuli,
      y: XYZ.y / totalStimuli,
      alpha: getPrivates(this).a
    };
  }

  /**
   * @member {Object}
   */
  get Lab() {
    const XYZ = this.xyz;
    const r = {
      x: XYZ.x / D65.x,
      y: XYZ.y / D65.y,
      z: XYZ.z / D65.z
    };
    const f = l => l > EPSILON ? Math.cbrt(l) : (KAPPA * l + 16) / 116;
    return {
      L: 116 * f(r.y) - 16,
      a: 500 * (f(r.x) - f(r.y)),
      b: 200 * (f(r.y) - f(r.z)),
      alpha: getPrivates(this).a
    };
  }

  /**
   * @member {Object}
   */
  get Luv() {
    const XYZ = this.xyz;
    const yr = XYZ.y / D65.y;
    const d_ = XYZ.x + 15 * XYZ.y + 3 * XYZ.z;
    const u_ = 4 * XYZ.x / d_;
    const v_ = 9 * XYZ.y / d_;
    const L = yr > EPSILON ? 116 * Math.cbrt(yr) - 16 : KAPPA * yr;
    return {
      L,
      u: 13 * L * (u_ - ur),
      v: 13 * L * (v_ - vr),
      alpha: getPrivates(this).a
    };
  }

  /**
   * RGB Color.
   * @param {number} r red (0 ≤ r ≤ 1)
   * @param {number} g green (0 ≤ g ≤ 1)
   * @param {number} b blue (0 ≤ b ≤ 1)
   * @param {number} [a=1.0] alpha (0 ≤ a ≤ 1)
   * @returns {Color}
   */
  static RGB(r, g, b, a = 1.0) {
    return new Color(r, g, b, a);
  }

  /**
   * HSV Color.
   * @param {number} h hue (0 ≤ h < 360)
   * @param {number} s saturation (0 ≤ s ≤ 1)
   * @param {number} v value (0 ≤ v ≤ 1)
   * @param {number} [a=1.0] alpha (0 ≤ a ≤ 1)
   * @returns {Color}
   */
  static HSV(h, s, v, a = 1.0) {
    const _s = Math.min(1.0, Math.max(0.0, s));
    const _v = Math.min(1.0, Math.max(0.0, v));
    const MAX = _v;
    const MIN = MAX * (1 - _s);
    const _h = x => x - 360 * Math.floor(x / 360);
    const _clip = n => 0 >= n ? 0 : n > 1 ? 1 : n;
    const _f = center => _clip(Math.abs(_h(h - center) - 180) / 60 - 1) * (MAX - MIN) + MIN;
    return Color.RGB(_f(0), _f(120), _f(240), a);
  }

  /**
   * HSL Color.
   * @param {number} h hue (0 ≤ h < 360)
   * @param {number} s saturation (0 ≤ s ≤ 1)
   * @param {number} l lightness (0 ≤ l ≤ 1)
   * @param {number} [a=1.0] alpha (0 ≤ a ≤ 1)
   * @returns {Color}
   */
  static HSL(h, s, l, a = 1.0) {
    const _s = Math.min(1.0, Math.max(0.0, s));
    const _l = Math.min(1.0, Math.max(0.0, l));
    const D = (0.5 - Math.abs(l - 0.5)) * _s;
    const MAX = _l + D;
    const MIN = _l - D;
    const _h = x => x - 360 * Math.floor(x / 360);
    const _clip = n => 0 >= n ? 0 : n > 1 ? 1 : n;
    const _f = center => _clip(Math.abs(_h(h - center) - 180) / 60 - 1) * (MAX - MIN) + MIN;
    return Color.RGB(_f(0), _f(120), _f(240), a);
  }

  /**
   * XYZ Color.
   * @param {number} x x
   * @param {number} y y
   * @param {number} z z
   * @param {number} [a=1.0] alpha (0 ≤ a ≤ 1)
   * @returns {Color}
   */
  static XYZ(x, y, z, a = 1.0) {
    return Color.RGB(
      3.2404542 * x - 1.5371385 * y - 0.4985314 * z, -0.9692660 * x + 1.8760108 * y + 0.0415560 * z,
      0.0556434 * x - 0.2040259 * y + 1.0572252 * z,
      a
    );
  }

  /**
   * Yxy Color.
   * @param {number} Y Y
   * @param {number} x x (0 ≤ x ≤ 1)
   * @param {number} y y (0 ≤ y ≤ 1)
   * @param {number} [a=1.0] alpha (0 ≤ a ≤ 1)
   * @returns {Color}
   */
  static Yxy(Y, x, y, a = 1.0) {
    const totalStimuli = Y / y;
    return Color.XYZ(
      x * totalStimuli,
      Y,
      (1 - x) * totalStimuli - Y,
      a
    );
  }

  /**
   * L*a*b* Color.
   * @param {number} L L*
   * @param {number} a a*
   * @param {number} b b*
   * @param {number} [alpha=1.0] alpha (0 ≤ a ≤ 1)
   * @returns {Color}
   */
  static Lab(L, a, b, alpha = 1.0) {
    const fy = (L + 16) / 116;
    const fz = fy - b / 200;
    const fx = a / 500 + fy;
    const finv = f => {
      const cb = f * f * f;
      return cb > EPSILON ? cb : (116 * f - 16) / KAPPA;
    };
    const r = {
      x: finv(fx),
      y: L > KAPPA * EPSILON ? fy * fy * fy : L / KAPPA,
      z: finv(fz)
    };
    return Color.XYZ(
      r.x * D65.x,
      r.y * D65.y,
      r.z * D65.z,
      alpha
    );
  }

  /**
   * L*u*v* Color.
   * @param {number} L L*
   * @param {number} u u*
   * @param {number} v v*
   * @param {number} [alpha=1.0] alpha (0 ≤ a ≤ 1)
   * @returns {Color}
   */
  static Luv(L, u, v, alpha = 1.0) {
    const cube = x => x * x * x;
    const Y = L > KAPPA * EPSILON ? cube((L + 16) / 116) : L / KAPPA;
    const a = (52 * L / (u + 13 * L * ur) - 1) / 3;
    const b = -5 * Y;
    const c = 1 / -3;
    const d = Y * (39 * L / (v + 13 * L * vr) - 5);
    const X = (d - b) / (a - c);
    return Color.XYZ(
      X,
      Y,
      X * a + b,
      alpha
    );
  }

  /**
   * Return complementary color.
   * @returns {Color}
   */
  getComplementary() {
    const privates = getPrivates(this);
    const minPlusMax = Math.min(privates.r, privates.g, privates.b) + Math.max(privates.r, privates.g, privates.b);
    return Color.RGB(minPlusMax - privates.r, minPlusMax - privates.g, minPlusMax - privates.b, privates.a);
  }

  /**
   * Blend two colors.
   * This color is base color and the other is top color.
   * @param {Color} another top color
   * @param {BlendMode} [blendMode] blend mode
   * @param {AlphaBlendMode} [alphaBlendMode] alpha blend mode
   * @returns {Color}
   */
  blend(another, blendMode = BlendMode.LIGHTER, alphaBlendMode = AlphaBlendMode.MAX) {
    const thisRGB = this.rgb;
    const anotherRGB = another.rgb;
    return Color.RGB(blendMode(thisRGB.r, anotherRGB.r), blendMode(thisRGB.g, anotherRGB.g), blendMode(thisRGB.b, anotherRGB.b), alphaBlendMode(thisRGB.alpha, anotherRGB.alpha));
  }

  /**
   * Clip the color from 0.0 to 1.0.
   * @returns {Color} clipped color
   */
  clip() {
    const c = r => Math.min(1.0, Math.max(0.0, r));
    const privates = getPrivates(this);
    return new Color(c(privates.r), c(privates.g), c(privates.b), c(privates.a));
  }

  /**
   * Convert to HEX string.
   * @returns {string} HEX string
   */
  toHex() {
    const clippedRGB = this.clip().rgb;
    const r = Math.round(clippedRGB.r * 0xff);
    const g = Math.round(clippedRGB.g * 0xff);
    const b = Math.round(clippedRGB.b * 0xff);
    const a = Math.round(clippedRGB.alpha * 0xff);
    const h = x => ('0' + x.toString(16)).slice(-2);
    return (a === 0xff) ? `#${h(r)}${h(g)}${h(b)}` : `#${h(r)}${h(g)}${h(b)}${h(a)}`;
  }

  /**
   * Convert to RGB string.
   * @returns {string} RGB string
   */
  toString() {
    const privates = getPrivates(this);
    return (privates.a === 1.0) ? `rgb(${privates.r}, ${privates.g}, ${privates.b})` : `rgba(${privates.r}, ${privates.g}, ${privates.b}, ${privates.a})`;
  }
}
