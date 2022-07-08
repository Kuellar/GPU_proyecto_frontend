import { vsSource, fsSource } from "./js/shaders.js";

var container;
var camera, scene, renderer, clock;
var uniforms;

const init = () => {
    container = document.getElementById("threeJS");

    camera = new THREE.Camera();
    camera.position.z = 1;

    scene = new THREE.Scene();
    clock = new THREE.Clock();

    var geometry = new THREE.PlaneBufferGeometry(2, 2);

    uniforms = {
        // BASE
        u_time: {
            type: "f",
            value: 1.0,
        },
        u_resolution: {
            type: "v2",
            value: new THREE.Vector2(),
        },
        u_mouse: {
            type: "v2",
            value: new THREE.Vector2(),
        },
    };

    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vsSource,
        fragmentShader: fsSource,
    });

    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    container.onmousemove = (e) => {
        uniforms.u_mouse.value.x =
            e.pageX * (window.innerWidth / window.innerHeight);
        uniforms.u_mouse.value.y = -e.pageY + window.innerHeight;
    };
};

const onWindowResize = (event) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
};

const animate = () => {
    requestAnimationFrame(animate);
    render();
};

const render = () => {
    uniforms.u_time.value += clock.getDelta();
    renderer.render(scene, camera);
};

window.onload = init();
window.onload = animate();
