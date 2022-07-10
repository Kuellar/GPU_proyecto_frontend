import {
    Clock,
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    Camera,
    Scene,
    WebGLRenderer,
} from "three";

var container, camera, scene, renderer, clock;
var data;

const init = () => {
    container = document.getElementById("threeJS");

    camera = new Camera();
    camera.position.z = 1;

    scene = new Scene();
    clock = new Clock();

    // var geometry = new BoxGeometry();
    // var material = new MeshBasicMaterial({ color: 0x00ff00 });
    // var cube = new Mesh(geometry, material);
    // scene.add(cube);

    renderer = new WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);
    renderer.render(scene, camera);
};

const onWindowResize = (event) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
};

const animate = () => {
    requestAnimationFrame(animate);
    render();
};

const render = () => {
    if (!window.data) return;

    // Set waiting gif
    let waiting = document.getElementById("waiting");
    waiting.classList.add("waiting-dots-hidden");
    waiting.classList.remove("waiting-dots-not-hidden");

    // Render
    renderer.render(scene, camera);
};

window.onload = init();
window.onload = animate();
