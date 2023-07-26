function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function main() {
  const canvas = document.querySelector("#canvas");
  const vertexShaderSource = document.querySelector("#vertex-shader").text;
  const fragmentShaderSource = document.querySelector("#fragment-shader").text;

  const gl = canvas.getContext("webgl");

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  const program = createProgram(gl, vertexShader, fragmentShader);

  // 需要传递 position 参数
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );

  const positionBuffer = gl.createBuffer();

  // 将 buffer 指向 gl.ARRAY_BUFFER
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.useProgram(program);

  gl.uniform2f(resolutionUniformLocation, 500, 500);

  // TODO: remove ? 将 buffer 指向 gl.ARRAY_BUFFER
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 启动参数 a_position
  gl.enableVertexAttribArray(positionAttributeLocation);

  const size = 2; // 每次迭代两个单位数据
  const type = gl.FLOAT; // 每个单位数据类型是 32 位浮点
  const normalize = false; // 不需要归一化数据
  const stride = 0; // 每次迭代完需要移动多少内存到下一个数据
  const offset = 0; // 从缓冲起始位置开始读取

  // 将 buffer -> gl.ARRAY_BUFFER 变为 buffer -> a_position
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  gl.clear(gl.COLOR_BUFFER_BIT);

  const primitiveType = gl.TRIANGLES;
  const count = positions.length / 2; // 顶点着色器执行几次
  gl.drawArrays(primitiveType, 0, count);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      110, 120, 180, 120, 110, 130, 110, 130, 180, 120, 180, 130,
    ]),
    gl.STATIC_DRAW
  );
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

main();
