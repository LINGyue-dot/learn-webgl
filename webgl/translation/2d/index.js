import { webglUtils } from "../../../common/lib/webglUtils.js";

const canvas = document.querySelector("#canvas");

const gl = canvas.getContext("webgl");

const program = webglUtils.createProgramFromScripts(gl, [
  "#vertex-shader-2d",
  "#fragment-shader-2d",
]);

const positionLocation = gl.getAttribLocation(program, "a_position");

const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
const colorLocation = gl.getUniformLocation(program, "u_color");

const positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const translation = [0, 0];
const width = 100;
const height = 30;
const color = [Math.random(), Math.random(), Math.random(), 1];

initSider();

drawScene();

function drawScene() {
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  setRectangle(gl, translation[0], translation[1], width, height);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // set the resolution
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

  // set the color
  gl.uniform4fv(colorLocation, color);

  // Draw the rectangle.
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 6;
  gl.drawArrays(primitiveType, offset, count);
}

function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  // 设置矩形的四点位置
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
}

function initSider() {
  const xInput = document.querySelector("#xInput");
  xInput.addEventListener("input", (event) => {
    changeX(event.target.value);
  });
  const yInput = document.querySelector("#yInput");
  yInput.addEventListener("input", (event) => {
    changeY(event.target.value);
  });
}
function changeX(value) {
  // value 是百分比
  const v = (value * gl.canvas.width) / 100;
  document.getElementById("x").textContent = v;
  translation[0] = v;
  drawScene();
}
function changeY(value) {
  const v = (value * gl.canvas.height) / 100;
  document.getElementById("y").textContent = v;
  translation[1] = v;
  drawScene();
}
