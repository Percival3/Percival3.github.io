/**
 * Vanilla WebGL water ripples adapted from sirxemic/jquery.ripples (MIT).
 * Used for the home grove background — drops expand as concentric waves.
 */

type FloatExt = 'OES_texture_float' | 'OES_texture_half_float';
type LinearExt = 'OES_texture_float_linear' | 'OES_texture_half_float_linear';

interface GlConfig {
  type: number;
  arrayType: Float32ArrayConstructor | null;
  linearSupport: boolean;
  extensions: Array<FloatExt | LinearExt>;
}

interface Program {
  id: WebGLProgram;
  locations: Record<string, WebGLUniformLocation | null>;
}

export interface GroveRipplesOptions {
  imageUrl?: string;
  resolution?: number;
  dropRadius?: number;
  perturbance?: number;
  /** CSS-like background-position Y percent (e.g. 38) */
  backgroundPositionY?: number;
  /** Wave travel speed multiplier (default 1; lower = slower ripples) */
  waveSpeed?: number;
  /** Velocity damping per frame (closer to 1 = longer-lived, softer fade) */
  damping?: number;
}

export interface GroveRipplesHandle {
  drop: (x: number, y: number, radius?: number, strength?: number) => void;
  play: () => void;
  pause: () => void;
  destroy: () => void;
  updateSize: () => void;
  get running(): boolean;
  get destroyed(): boolean;
}

const DEFAULTS: Required<GroveRipplesOptions> = {
  imageUrl: '/ink-grove.png',
  resolution: 512,
  dropRadius: 28,
  perturbance: 0.04,
  backgroundPositionY: 38,
  waveSpeed: 1,
  damping: 0.995,
};

function loadConfig(): GlConfig | null {
  const canvas = document.createElement('canvas');
  const gl =
    canvas.getContext('webgl') ||
    (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
  if (!gl) return null;

  const extensions: Partial<Record<FloatExt | LinearExt, unknown>> = {};
  (
    [
      'OES_texture_float',
      'OES_texture_half_float',
      'OES_texture_float_linear',
      'OES_texture_half_float_linear',
    ] as const
  ).forEach((name) => {
    const extension = gl.getExtension(name);
    if (extension) extensions[name] = extension;
  });

  if (!extensions.OES_texture_float) return null;

  const configs: GlConfig[] = [];
  const push = (
    type: 'float' | 'half_float',
    glType: number,
    arrayType: Float32ArrayConstructor | null,
  ) => {
    const name = `OES_texture_${type}` as FloatExt;
    const nameLinear = `${name}_linear` as LinearExt;
    const linearSupport = nameLinear in extensions;
    const list: Array<FloatExt | LinearExt> = [name];
    if (linearSupport) list.push(nameLinear);
    configs.push({ type: glType, arrayType, linearSupport, extensions: list });
  };

  push('float', gl.FLOAT, Float32Array);
  if (extensions.OES_texture_half_float) {
    const half = extensions.OES_texture_half_float as { HALF_FLOAT_OES: number };
    push('half_float', half.HALF_FLOAT_OES, null);
  }

  const texture = gl.createTexture();
  const framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  for (const candidate of configs) {
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      32,
      32,
      0,
      gl.RGBA,
      candidate.type,
      null,
    );
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
      return candidate;
    }
  }
  return null;
}

function createImageData(width: number, height: number): ImageData {
  try {
    return new ImageData(width, height);
  } catch {
    const c = document.createElement('canvas');
    return c.getContext('2d')!.createImageData(width, height);
  }
}

export function mountGroveRipples(
  el: HTMLElement,
  options: GroveRipplesOptions = {},
): GroveRipplesHandle | null {
  const config = loadConfig();
  if (!config) return null;

  const opts = { ...DEFAULTS, ...options };
  let gl: WebGLRenderingContext | null =
    null as unknown as WebGLRenderingContext;

  const canvas = document.createElement('canvas');
  canvas.className = 'grove-water-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  el.appendChild(canvas);

  const context =
    canvas.getContext('webgl') ||
    (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
  if (!context) {
    canvas.remove();
    return null;
  }
  gl = context;

  config.extensions.forEach((name) => {
    gl!.getExtension(name);
  });

  const resolution = opts.resolution;
  const textureDelta = new Float32Array([1 / resolution, 1 / resolution]);
  let perturbance = opts.perturbance;
  const dropRadius = opts.dropRadius;
  const backgroundPositionY = opts.backgroundPositionY;

  const textures: WebGLTexture[] = [];
  const framebuffers: WebGLFramebuffer[] = [];
  let bufferWriteIndex = 0;
  let bufferReadIndex = 1;

  const arrayType = config.arrayType;
  const textureData = arrayType
    ? new arrayType(resolution * resolution * 4)
    : null;

  for (let i = 0; i < 2; i++) {
    const texture = gl.createTexture()!;
    const framebuffer = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      config.linearSupport ? gl.LINEAR : gl.NEAREST,
    );
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MAG_FILTER,
      config.linearSupport ? gl.LINEAR : gl.NEAREST,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      resolution,
      resolution,
      0,
      gl.RGBA,
      config.type,
      textureData,
    );
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
    textures.push(texture);
    framebuffers.push(framebuffer);
  }

  const quad = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, +1, -1, +1, +1, -1, +1]),
    gl.STATIC_DRAW,
  );

  function createProgram(vertexSource: string, fragmentSource: string): Program {
    const compile = (type: number, source: string) => {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        throw new Error(`compile error: ${gl!.getShaderInfoLog(shader)}`);
      }
      return shader;
    };

    const id = gl!.createProgram()!;
    gl!.attachShader(id, compile(gl!.VERTEX_SHADER, vertexSource));
    gl!.attachShader(id, compile(gl!.FRAGMENT_SHADER, fragmentSource));
    gl!.linkProgram(id);
    if (!gl!.getProgramParameter(id, gl!.LINK_STATUS)) {
      throw new Error(`link error: ${gl!.getProgramInfoLog(id)}`);
    }

    const locations: Record<string, WebGLUniformLocation | null> = {};
    gl!.useProgram(id);
    gl!.enableVertexAttribArray(0);
    const regex = /uniform \w+ (\w+)/g;
    const shaderCode = vertexSource + fragmentSource;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(shaderCode)) != null) {
      locations[match[1]] = gl!.getUniformLocation(id, match[1]);
    }
    return { id, locations };
  }

  function bindTexture(texture: WebGLTexture, unit = 0) {
    gl!.activeTexture(gl!.TEXTURE0 + unit);
    gl!.bindTexture(gl!.TEXTURE_2D, texture);
  }

  function drawQuad() {
    gl!.bindBuffer(gl!.ARRAY_BUFFER, quad);
    gl!.vertexAttribPointer(0, 2, gl!.FLOAT, false, 0, 0);
    gl!.drawArrays(gl!.TRIANGLE_FAN, 0, 4);
  }

  function swapBufferIndices() {
    bufferWriteIndex = 1 - bufferWriteIndex;
    bufferReadIndex = 1 - bufferReadIndex;
  }

  const vertexShader = [
    'attribute vec2 vertex;',
    'varying vec2 coord;',
    'void main() {',
    'coord = vertex * 0.5 + 0.5;',
    'gl_Position = vec4(vertex, 0.0, 1.0);',
    '}',
  ].join('\n');

  const dropProgram = createProgram(
    vertexShader,
    [
      'precision highp float;',
      'const float PI = 3.141592653589793;',
      'uniform sampler2D texture;',
      'uniform vec2 center;',
      'uniform float radius;',
      'uniform float strength;',
      'varying vec2 coord;',
      'void main() {',
      'vec4 info = texture2D(texture, coord);',
      'float drop = max(0.0, 1.0 - length(center * 0.5 + 0.5 - coord) / radius);',
      'drop = 0.5 - cos(drop * PI) * 0.5;',
      'info.r += drop * strength;',
      'gl_FragColor = info;',
      '}',
    ].join('\n'),
  );

  const updateProgram = createProgram(
    vertexShader,
    [
      'precision highp float;',
      'uniform sampler2D texture;',
      'uniform vec2 delta;',
      'uniform float waveSpeed;',
      'uniform float damping;',
      'varying vec2 coord;',
      'void main() {',
      'vec4 info = texture2D(texture, coord);',
      'vec2 dx = vec2(delta.x, 0.0);',
      'vec2 dy = vec2(0.0, delta.y);',
      'float average = (',
      'texture2D(texture, coord - dx).r +',
      'texture2D(texture, coord - dy).r +',
      'texture2D(texture, coord + dx).r +',
      'texture2D(texture, coord + dy).r',
      ') * 0.25;',
      'info.g += (average - info.r) * 2.0 * waveSpeed;',
      'info.g *= damping;',
      'info.r += info.g;',
      'gl_FragColor = info;',
      '}',
    ].join('\n'),
  );
  gl.uniform2fv(updateProgram.locations.delta, textureDelta);
  gl.uniform1f(updateProgram.locations.waveSpeed, opts.waveSpeed);
  gl.uniform1f(updateProgram.locations.damping, opts.damping);

  const renderProgram = createProgram(
    [
      'precision highp float;',
      'attribute vec2 vertex;',
      'uniform vec2 topLeft;',
      'uniform vec2 bottomRight;',
      'uniform vec2 containerRatio;',
      'varying vec2 ripplesCoord;',
      'varying vec2 backgroundCoord;',
      'void main() {',
      'backgroundCoord = mix(topLeft, bottomRight, vertex * 0.5 + 0.5);',
      'backgroundCoord.y = 1.0 - backgroundCoord.y;',
      'ripplesCoord = vec2(vertex.x, -vertex.y) * containerRatio * 0.5 + 0.5;',
      'gl_Position = vec4(vertex.x, -vertex.y, 0.0, 1.0);',
      '}',
    ].join('\n'),
    [
      'precision highp float;',
      'uniform sampler2D samplerBackground;',
      'uniform sampler2D samplerRipples;',
      'uniform vec2 delta;',
      'uniform float perturbance;',
      'varying vec2 ripplesCoord;',
      'varying vec2 backgroundCoord;',
      'void main() {',
      'float height = texture2D(samplerRipples, ripplesCoord).r;',
      'float heightX = texture2D(samplerRipples, vec2(ripplesCoord.x + delta.x, ripplesCoord.y)).r;',
      'float heightY = texture2D(samplerRipples, vec2(ripplesCoord.x, ripplesCoord.y + delta.y)).r;',
      'vec3 dx = vec3(delta.x, heightX - height, 0.0);',
      'vec3 dy = vec3(0.0, heightY - height, delta.y);',
      'vec2 offset = -normalize(cross(dy, dx)).xz;',
      'float specular = pow(max(0.0, dot(offset, normalize(vec2(-0.6, 1.0)))), 4.0);',
      'gl_FragColor = texture2D(samplerBackground, backgroundCoord + offset * perturbance) + specular;',
      '}',
    ].join('\n'),
  );
  gl.uniform2fv(renderProgram.locations.delta, textureDelta);

  const backgroundTexture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, backgroundTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  const transparentPixels = createImageData(32, 32);
  const setTransparentTexture = () => {
    gl!.bindTexture(gl!.TEXTURE_2D, backgroundTexture);
    gl!.texImage2D(
      gl!.TEXTURE_2D,
      0,
      gl!.RGBA,
      gl!.RGBA,
      gl!.UNSIGNED_BYTE,
      transparentPixels,
    );
  };
  setTransparentTexture();

  let backgroundWidth = 1;
  let backgroundHeight = 1;
  const topLeft = new Float32Array(2);
  const bottomRight = new Float32Array(2);
  const containerRatio = new Float32Array(2);

  const image = new Image();
  image.onload = () => {
    if (destroyed) return;
    gl = context;
    const isPowerOfTwo = (x: number) => (x & (x - 1)) === 0;
    const wrapping =
      isPowerOfTwo(image.width) && isPowerOfTwo(image.height)
        ? gl.REPEAT
        : gl.CLAMP_TO_EDGE;
    gl.bindTexture(gl.TEXTURE_2D, backgroundTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapping);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapping);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    backgroundWidth = image.width;
    backgroundHeight = image.height;
  };
  image.onerror = () => {
    if (!destroyed) setTransparentTexture();
  };
  image.src = opts.imageUrl;

  let visible = true;
  let running = true;
  let destroyed = false;

  const updateSize = () => {
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (w !== canvas.width || h !== canvas.height) {
      canvas.width = w;
      canvas.height = h;
    }
  };

  const computeTextureBoundaries = () => {
    const containerW = el.clientWidth;
    const containerH = el.clientHeight;
    const scale = Math.max(
      containerW / backgroundWidth,
      containerH / backgroundHeight,
    );
    const bgW = backgroundWidth * scale;
    const bgH = backgroundHeight * scale;
    // background-position: center <Y%>
    const bgX = (containerW - bgW) * 0.5;
    const bgY = (containerH - bgH) * (backgroundPositionY / 100);

    topLeft[0] = -bgX / bgW;
    topLeft[1] = -bgY / bgH;
    bottomRight[0] = topLeft[0] + containerW / bgW;
    bottomRight[1] = topLeft[1] + containerH / bgH;

    const maxSide = Math.max(canvas.width, canvas.height);
    containerRatio[0] = canvas.width / maxSide;
    containerRatio[1] = canvas.height / maxSide;
  };

  const drop = (
    x: number,
    y: number,
    radius = dropRadius,
    strength = 0.12,
  ) => {
    if (destroyed) return;
    gl = context;
    const elWidth = el.clientWidth;
    const elHeight = el.clientHeight;
    const longestSide = Math.max(elWidth, elHeight);
    const r = radius / longestSide;
    const dropPosition = new Float32Array([
      (2 * x - elWidth) / longestSide,
      (elHeight - 2 * y) / longestSide,
    ]);

    gl.viewport(0, 0, resolution, resolution);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[bufferWriteIndex]);
    bindTexture(textures[bufferReadIndex]);
    gl.useProgram(dropProgram.id);
    gl.uniform2fv(dropProgram.locations.center, dropPosition);
    gl.uniform1f(dropProgram.locations.radius, r);
    gl.uniform1f(dropProgram.locations.strength, strength);
    drawQuad();
    swapBufferIndices();
  };

  const update = () => {
    gl!.viewport(0, 0, resolution, resolution);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, framebuffers[bufferWriteIndex]);
    bindTexture(textures[bufferReadIndex]);
    gl!.useProgram(updateProgram.id);
    drawQuad();
    swapBufferIndices();
  };

  const render = () => {
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.enable(gl!.BLEND);
    gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT);
    gl!.useProgram(renderProgram.id);
    bindTexture(backgroundTexture, 0);
    bindTexture(textures[0], 1);
    gl!.uniform1f(renderProgram.locations.perturbance, perturbance);
    gl!.uniform2fv(renderProgram.locations.topLeft, topLeft);
    gl!.uniform2fv(renderProgram.locations.bottomRight, bottomRight);
    gl!.uniform2fv(renderProgram.locations.containerRatio, containerRatio);
    gl!.uniform1i(renderProgram.locations.samplerBackground, 0);
    gl!.uniform1i(renderProgram.locations.samplerRipples, 1);
    drawQuad();
    gl!.disable(gl!.BLEND);
  };

  const step = () => {
    if (destroyed || !visible) return;
    gl = context;
    computeTextureBoundaries();
    if (running) update();
    render();
  };

  const onResize = () => updateSize();
  window.addEventListener('resize', onResize);
  updateSize();

  gl.clearColor(0, 0, 0, 0);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const loop = () => {
    if (destroyed) return;
    step();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  return {
    drop,
    play: () => {
      running = true;
    },
    pause: () => {
      running = false;
    },
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      window.removeEventListener('resize', onResize);
      canvas.remove();
      gl = null;
    },
    updateSize,
    get running() {
      return running;
    },
    get destroyed() {
      return destroyed;
    },
  };
}
