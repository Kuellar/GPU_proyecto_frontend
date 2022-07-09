import {
    Clock,
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    Camera,
    Scene,
    WebGLRenderer,
} from "../node_modules/three/src/Three.js";

var container, camera, scene, renderer, clock;

const init = () => {
    container = document.getElementById("threeJS");

    camera = new Camera();
    camera.position.z = 1;

    scene = new Scene();
    clock = new Clock();

    var geometry = new BoxGeometry();
    var material = new MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new Mesh(geometry, material);
    scene.add(cube);

    renderer = new WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);
};

const onWindowResize = (event) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
};

const animate = () => {
    requestAnimationFrame(animate);
    render();
};

const render = () => {
    renderer.render(scene, camera);
};

window.onload = init();
window.onload = animate();
