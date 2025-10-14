import SHADERS from "./shaders.ts";

let GL_GLOBAL: WebGL2RenderingContext | null;
let vao: WebGLVertexArrayObject | null;
let currentProgram: WebGLProgram | null;

let resolutionLocation: WebGLUniformLocation | null;
let mouseLocation: WebGLUniformLocation | null;
let timeLocation: WebGLUniformLocation | null;

let mouseX: number = 0;
let mouseY: number = 0;

let currentFragmentShaderSource: string = SHADERS[0];

const vertexShaderSource = `#version 300 es

in vec4 a_position;

void main() {
    gl_Position = a_position;
}
`;

function setMousePostion(e: MouseEvent) {
  if (!GL_GLOBAL) {
    return;
  }
  const rect = (GL_GLOBAL.canvas as HTMLCanvasElement).getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = rect.height - (e.clientY - rect.top) - 1;
}

// Ref - https://webgl2fundamentals.org/webgl/lessons/webgl-shadertoy.html
function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
  const dpr = window.devicePixelRatio || 1;

  // Lookup the size the browser is displaying the canvas in pixels
  const displayWidth = Math.floor(canvas.clientWidth * dpr);
  const displayHeight = Math.floor(canvas.clientHeight * dpr);

  // Check if the canvas is not the same size
  const needResize =
    canvas.width !== displayWidth || canvas.height !== displayHeight;

  if (needResize) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
) {
  let shader = gl.createShader(type);
  if (!shader) return;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function render(time: GLfloat) {
  time *= 0.001; // convert to seconds
  if (!GL_GLOBAL) {
    return;
  }

  resizeCanvasToDisplaySize(GL_GLOBAL.canvas as HTMLCanvasElement);

  GL_GLOBAL.viewport(0, 0, GL_GLOBAL.canvas.width, GL_GLOBAL.canvas.height); // Map Clip Space -1 to 1 => 0 - canvas width, 0 - canvas height
  GL_GLOBAL.clearColor(0, 0, 0, 0); // Make canvas transparent
  GL_GLOBAL.clear(GL_GLOBAL.COLOR_BUFFER_BIT);

  GL_GLOBAL.useProgram(currentProgram); // use our Web GL Program

  GL_GLOBAL.bindVertexArray(vao); // bind attributes and buffers

  GL_GLOBAL.uniform3f(
    resolutionLocation,
    GL_GLOBAL.canvas.width,
    GL_GLOBAL.canvas.height,
    window.devicePixelRatio || 1
  );
  GL_GLOBAL.uniform2f(mouseLocation, mouseX, mouseY);
  GL_GLOBAL.uniform1f(timeLocation, time);

  let primitiveType = GL_GLOBAL.TRIANGLES;
  let offset = 0;
  let count = 6;
  GL_GLOBAL.drawArrays(primitiveType, offset, count);
  requestAnimationFrame(render);
}

function initShader(gl: WebGL2RenderingContext) {
  const fragmentShaderSource = `#version 300 es
precision highp float;

uniform vec3 iResolution;
uniform vec2 iMouse;
uniform float iTime;

out vec4 outColor;

${(window as any).currentFragmentShaderSource}

void main() {
    mainImage(outColor, gl_FragCoord.xy);
}
`;

  let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  let fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  if (!vertexShader || !fragmentShader) return;

  const program = createProgram(gl, vertexShader, fragmentShader);

  if (!program) return;

  currentProgram = program;

  // Fetching Data for the current attribute at location positionAttributeLocation
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // lookup unifrom locations
  resolutionLocation = gl.getUniformLocation(program, "iResolution");
  mouseLocation = gl.getUniformLocation(program, "iMouse");
  timeLocation = gl.getUniformLocation(program, "iTime");
}

export function initShaderCanvas() {
  (window as any).currentFragmentShaderSource = currentFragmentShaderSource;
  const canvas = document.getElementById("shader-canvas") as HTMLCanvasElement;
  if (canvas) {
    let gl = canvas.getContext("webgl2", { antialias: true });
    GL_GLOBAL = gl;

    if (!gl) {
      return;
    }
    // Vertex Attribute Array - State
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao); // bind vao to current context

    // Buffer - put three 2d clip space points in
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // bind it to ARRAY_BUFFER

    // Filling buffer with co-ordinates of two triangle that will fill up the clip space
    const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    initShader(gl);

    canvas.addEventListener("mousemove", setMousePostion);

    requestAnimationFrame(render);
  }
}
