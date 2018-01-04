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
 * Enum for color blend modes.
 * @readonly
 * @enum {Function}
 */
const BlendMode = (() => {
  return {
    /**
     * @member {Function}
     * @memberof BlendMode
     */
    LIGHTER: (b, t) => b + t,
    /**
     * @member {Function}
     * @memberof BlendMode
     */
    MULTIPLE: (b, t) => b * t,
    /**
     * @member {Function}
     * @memberof BlendMode
     */
    SCREEN: (b, t) => b + t - b * t,
    /**
     * @member {Function}
     * @memberof BlendMode
     */
    OVERLAY: (b, t) => b < 0.5 ? 2 * b * t : 2 * (b + t - b * t) - 1,
    /**
     * @member {Function}
     * @memberof BlendMode
     */
    HARDLIGHT: (b, t) => t < 0.5 ? 2 * b * t : 2 * (b + t - b * t) - 1,
    /**
     * @member {Function}
     * @memberof BlendMode
     */
    SOFTLIGHT: (b, t) => t < 0.5 ? 2 * b * t + b * b * (1 - 2 * t) : 2 * b * (1 - t) + Math.sqrt(b) * (2 * t - 1),
    /**
     * @member {Function}
     * @memberof BlendMode
     */
    DIFFERENCE: (b, t) => Math.abs(t - b)
  };
})();
Object.freeze(BlendMode);

export { BlendMode as default };