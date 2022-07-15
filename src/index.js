import { vsSource, fsSourcePoints, fsSourceStars } from "../js/shaders.js";
import {
    Clock,
    ShaderMaterial,
    Mesh,
    PlaneBufferGeometry,
    Scene,
    WebGLRenderer,
    Vector2,
    Camera,
} from "three";

var container, camera, scene, renderer, clock;
var base_uniforms;
var uniforms;
var mesh;

var materialStars, materialPoints, pointShader;

const init = () => {
    window.data = [];
    container = document.getElementById("threeJS");

    camera = new Camera();
    camera.position.z = 1;

    scene = new Scene();
    clock = new Clock();

    base_uniforms = {
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

    // Draw stars
    var geometry = new PlaneBufferGeometry(2, 2);

    uniforms = {
        ...base_uniforms,
        u_stars_total: {
            type: "int",
            value: 1,
        },
        u_stars_ra: {
            // type: "v2",
            value: [0.0],
        },
        u_stars_dec: {
            // type: "v2",
            value: [0.0],
        },
    };
    materialStars = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vsSource,
        fragmentShader: fsSourceStars,
    });

    materialPoints = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vsSource,
        fragmentShader: fsSourcePoints,
    });

    mesh = new Mesh(geometry, materialStars);
    pointShader = false;
    scene.add(mesh);

    renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);
};

const onWindowResize = (event) => {
    const size = Math.min(window.innerWidth, window.innerHeight);
    renderer.setSize(size, size);
    uniforms.u_resolution.value.x = size;
    uniforms.u_resolution.value.y = size;
};

const animate = () => {
    requestAnimationFrame(animate);
    render();
};

const render = () => {
    // Change shader?
    if (document.getElementById("points-style").checked != pointShader) {
        pointShader = !pointShader;
        if (pointShader) mesh.material = materialPoints;
        else mesh.material = materialStars;
    }

    // Update time
    base_uniforms.u_time.value += clock.getDelta();

    // NOT DATA
    if (!window.data.length) {
        uniforms.u_stars_total.value = 1;
        uniforms.u_stars_ra.value = [0];
        uniforms.u_stars_dec.value = [0];
        renderer.render(scene, camera);
        return;
    }

    // Set waiting gif
    let waiting = document.getElementById("waiting");
    waiting.classList.add("waiting-dots-hidden");
    waiting.classList.remove("waiting-dots-not-hidden");

    // Set new data
    uniforms.u_stars_total.value = window.total;
    uniforms.u_stars_ra.value = window.ras;
    uniforms.u_stars_dec.value = window.decs;

    // Render
    renderer.render(scene, camera);
};

window.onload = init();
window.onload = animate();
