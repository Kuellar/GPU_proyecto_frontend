// Vertex shader program
export const vsSource = `
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment shader program
export const fsSource = `
// BASE
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
void main() {
    gl_FragColor = vec4(1,0.0,1.0,1.0);
}
`;
