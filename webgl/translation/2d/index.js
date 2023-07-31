import { WebglUtils } from "../../../common/lib/webglUtils.js";

const canvas = document.querySelector("#canvas");

const gl = canvas.getContext("webgl");

const program = WebglUtils.createProgramFromScripts(gl, [
  "#vertex-shader-2d",
  "#fragment-shader-2d",
]);

const positionLocation = gl.getAttribLocation(program, "a_position");

const translationLocation = gl.getUniformLocation(program, "u_translation");
const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
const colorLocation = gl.getUniformLocation(program, "u_color");
const rotationLocation = gl.getUniformLocation(program, "u_rotation");

const positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const translation = [0, 0];
const rotation = [0, 1];

const color = [Math.random(), Math.random(), Math.random(), 1];

initSider();

drawScene();

function drawScene() {
  WebglUtils.resizeCanvasToDisplaySize(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  setGeometry(gl);

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
  gl.uniform2f(translationLocation, ...translation);
  // set the color
  gl.uniform4fv(colorLocation, color);

  gl.uniform2f(rotationLocation, ...rotation);  

  // Draw the rectangle.
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 18;
  gl.drawArrays(primitiveType, offset, count);
}

function setGeometry(gl) {
  // 设置矩形的四点位置
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // 左竖
      0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150,

      // 上横
      30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30,

      // 中横
      30, 60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90,
    ]),
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
  $("#rotation").gmanUnitCircle({
    width: 200,
    height: 200,
    value: 0,
    slide: function (e, u) {
      rotation[0] = u.x;
      rotation[1] = u.y;
      drawScene();
    },
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
