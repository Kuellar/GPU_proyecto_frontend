import { vsSource, fsSource } from "../js/shaders.js";
import {
    Clock,
    ShaderMaterial,
    Mesh,
    PlaneBufferGeometry,
    OrthographicCamera,
    Scene,
    WebGLRenderer,
    Vector2,
    MeshBasicMaterial,
} from "three";

var container, camera, scene, renderer, clock;

const frustumSize = 1000;

const init = () => {
    container = document.getElementById("threeJS");

    const aspect = window.innerWidth / window.innerHeight;

    camera = new OrthographicCamera(
        (frustumSize * aspect) / -2,
        (frustumSize * aspect) / 2,
        frustumSize / 2,
        frustumSize / -2,
        1,
        1000
    );
    camera.position.z = 1;
    console.log(
        "CAMERA: left ",
        camera.bottom,
        camera.top,
        camera.left,
        camera.right
    );

    scene = new Scene();
    clock = new Clock();

    // TEST Draw stars
    var geometry = new PlaneBufferGeometry(10, 10);
    var uniforms = {
        // BASE
        u_time: {
            type: "f",
            value: 1.0,
        },
        u_resolution: {
            type: "v2",
            value: new Vector2(),
        },
        u_mouse: {
            type: "v2",
            value: new Vector2(),
        },
    };
    var material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vsSource,
        fragmentShader: fsSource,
    });
    var mesh1 = new Mesh(geometry, material);
    mesh1.position.x = 250;
    scene.add(mesh1);
    // END TEST

    renderer = new WebGLRenderer();
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);
};

function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;

    camera.left = (-frustumSize * aspect) / 2;
    camera.right = (frustumSize * aspect) / 2;
    camera.top = frustumSize / 2;
    camera.bottom = -frustumSize / 2;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

const animate = () => {
    requestAnimationFrame(animate);
    render();
};

const render = () => {
    if (!window.data) {
        renderer.render(scene, camera);
        return;
    }

    // Set waiting gif
    let waiting = document.getElementById("waiting");
    waiting.classList.add("waiting-dots-hidden");
    waiting.classList.remove("waiting-dots-not-hidden");

    // Render
    renderer.render(scene, camera);
};

window.onload = init();
window.onload = animate();
