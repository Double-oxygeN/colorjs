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

/**
 * Enum for alpha blend modes.
 * @readonly
 * @enum {Function}
 */
const AlphaBlendMode = {
  /** @member {Function} */
  MAX: Math.max,
  /** @member {Function} */
  XOR: (b, t) => Math.abs(t - b)
};

Object.freeze(AlphaBlendMode);

export { AlphaBlendMode as default };
