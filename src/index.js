import { vsSource, fsSource } from "../js/shaders.js";
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
var mesh1;

const frustumSize = 1000;

const toPixelPerfect = (vec2, aspect) => {
    return new Vector2(
        ((vec2.x + (frustumSize * aspect) / 2) * window.innerWidth) /
            (frustumSize * aspect),
        ((vec2.y + frustumSize / 2) * window.innerHeight) / frustumSize
    );
};

const init = () => {
    window.data = [];
    container = document.getElementById("threeJS");

    // const aspect = window.innerWidth / window.innerHeight;

    // camera = new OrthographicCamera(
    //     (frustumSize * aspect) / -2,
    //     (frustumSize * aspect) / 2,
    //     frustumSize / 2,
    //     frustumSize / -2,
    //     0.1,
    //     1000
    // );
    camera = new Camera();
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

    // TEST Draw stars
    var geometry = new PlaneBufferGeometry(2, 2);
    var pos = new Vector2(250, 250);

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
    var material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vsSource,
        fragmentShader: fsSource,
    });
    mesh1 = new Mesh(geometry, material);
    scene.add(mesh1);

    // TEST CUBE
    // const geometry_cube = new BoxGeometry(100, 100, 1);
    // const material_cube = new MeshBasicMaterial({ color: 0xffff00 });
    // const mesh_cube = new Mesh(geometry_cube, material_cube);
    // scene.add(mesh_cube);
    // END TEST

    renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);
};

// function onWindowResize() {
//     const aspect = window.innerWidth / window.innerHeight;

//     camera.left = (frustumSize * aspect) / -2;
//     camera.right = (frustumSize * aspect) / 2;
//     camera.top = frustumSize / 2;
//     camera.bottom = -frustumSize / 2;

//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     console.log(aspect);
//     console.log(frustumSize);
//     base_uniforms.u_resolution.value.x = frustumSize;
//     base_uniforms.u_resolution.value.y = frustumSize;
// }
const onWindowResize = (event) => {
    const size = Math.min(window.innerWidth, window.innerHeight);
    renderer.setSize(size, size);
    uniforms.u_resolution.value.x = size;
    uniforms.u_resolution.value.y = size;
};
// const onWindowResize = (event) => {
//     const width = canvas.clientWidth;
//     const height = canvas.clientHeight;
//     if (canvas.width !== width || canvas.height !== height) {
//         // you must pass false here or three.js sadly fights the browser
//         renderer.setSize(width, height, false);
//         camera.aspect = width / height;
//         camera.updateProjectionMatrix();

//         // set render target sizes here
//     }
// };

const animate = () => {
    requestAnimationFrame(animate);
    render();
};

const render = () => {
    // const aspect = window.innerWidth / window.innerHeight;
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

    // Ser new data
    uniforms.u_stars_total.value = window.total;
    uniforms.u_stars_ra.value = window.ras;
    uniforms.u_stars_dec.value = window.decs;

    // Render
    renderer.render(scene, camera);
};

window.onload = init();
window.onload = animate();
