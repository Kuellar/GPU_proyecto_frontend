import { getProgramInfo } from "./setupGL.js";
import { initBuffers, drawScene } from "./drawer.js";

// prettier-ignore
const positions = [
    1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    -1.0, -1.0,
];

// prettier-ignore
const colors = [
    1.0,  1.0,  1.0,  1.0,    // white
    1.0,  0.0,  0.0,  1.0,    // red
    0.0,  1.0,  0.0,  1.0,    // green
    0.0,  0.0,  1.0,  1.0,    // blue
];

// prettier-ignore
const indices = [
    0,  1,  2,
    0,  2,  3,
];

const main = () => {
    const canvas = document.querySelector("#glCanvas");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize the GL context
    const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it."
        );
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    const programInfo = getProgramInfo(gl);
    const buffer = initBuffers(gl, positions, colors, indices);

    var then = 0;

    const render = (now) => {
        //canvas.width = window.innerWidth;
        //canvas.height = window.innerHeight;
        now *= 0.001; // convert to second
        const deltaTime = now - then;
        drawScene(gl, programInfo, buffer);
        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
};

window.onload = main;
