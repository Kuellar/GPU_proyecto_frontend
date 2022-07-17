import { vsSource, fsSourcePoints, fsSourceStars } from "../js/shaders.js";
import {
    Clock,
    ShaderMaterial,
    Mesh,
    PlaneBufferGeometry,
    BufferGeometry,
    BufferAttribute,
    Scene,
    WebGLRenderer,
    Vector2,
    Camera,
    TextureLoader,
    MeshBasicMaterial,
    Points,
    Float32BufferAttribute,
    PointsMaterial,
    MeshLambertMaterial,
    LineBasicMaterial,
    DoubleSide,
} from "three";
import Delaunator from "delaunator";

var container, camera, scene, renderer, clock, loader;
var base_uniforms, starfield_uniforms;

var materialStars, materialPoints, pointShader;

const init = () => {
    window.starfieldLoaded = false;
    window.pointsLoaded = false;
    window.triangulationLoaded = false;
    window.points = [];
    window.delaunay = new Delaunator(window.points);
    pointShader = false;

    container = document.getElementById("threeJS");

    camera = new Camera();
    camera.position.z = 1;
    /*
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 51200);
    camera.position.set(-2048, 2048, -2048);
    lastCameraPosition.set(camera.position.x, camera.position.y, camera.position.z);
    */

    scene = new Scene();
    clock = new Clock();
    loader = new TextureLoader();
    loader.crossOrigin = "";

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
    // materialPoints = new ShaderMaterial({
    //     uniforms: uniforms,
    //     vertexShader: vsSource,
    //     fragmentShader: fsSourcePoints,
    // });

    renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setClearColor(0x000000);

    container.appendChild(renderer.domElement);

    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);
};

const onWindowResize = (event) => {
    const size = Math.min(window.innerWidth, window.innerHeight);
    renderer.setSize(size, size);
    base_uniforms.u_resolution.value.x = size;
    base_uniforms.u_resolution.value.y = size;
};

const animate = () => {
    requestAnimationFrame(animate);
    render();
};

const render = () => {
    // Update time
    base_uniforms.u_time.value += clock.getDelta();

    // NOT DATA
    if (window.points.length == 0) {
        scene.clear();
        return;
    }

    // Set waiting gif
    let waiting = document.getElementById("waiting");
    waiting.classList.add("waiting-dots-hidden");
    waiting.classList.remove("waiting-dots-not-hidden");

    // Starfield
    const visStars = document.getElementById("vis-stars").checked;
    if (visStars) {
        // First load
        if (!window.starfieldLoaded) {
            window.starfieldLoaded = true;
            starfield_uniforms = {
                ...base_uniforms,
                u_stars_amp: {
                    type: "float",
                    value: window.amp,
                },
                u_stars_total: {
                    type: "int",
                    value: window.points.length / 2,
                },
                u_stars_pos: {
                    type: "float",
                    value: window.points,
                },
            };
            var geometry = new PlaneBufferGeometry(2, 2);
            materialStars = new ShaderMaterial({
                uniforms: starfield_uniforms,
                vertexShader: vsSource,
                fragmentShader: fsSourceStars,
            });
            const mesh = new Mesh(geometry, materialStars);
            mesh.name = "starfield";
            mesh.renderOrder = 0;
            scene.add(mesh);
        }
    } else {
        if (window.starfieldLoaded) {
            window.starfieldLoaded = false;
            const mesh = scene.getObjectByName("starfield");
            scene.remove(mesh);
        }
    }

    // Points
    const visPoints = document.getElementById("vis-points").checked;
    if (visPoints) {
        if (!window.pointsLoaded) {
            window.pointsLoaded = true;
            const vertices = new Float32Array(window.points);

            // DRAW POINTS
            const geometryPoint = new BufferGeometry();
            geometryPoint.setAttribute(
                "position",
                new Float32BufferAttribute(vertices, 2)
            );
            const materialPoints = new PointsMaterial({
                color: 0xffffff,
                size: 4,
            });
            const meshPoints = new Points(geometryPoint, materialPoints);
            meshPoints.name = "points";
            meshPoints.renderOrder = 1;
            scene.add(meshPoints);
        }
    } else {
        if (window.pointsLoaded) {
            window.pointsLoaded = false;
            const mesh = scene.getObjectByName("points");
            scene.remove(mesh);
        }
    }

    // Triangulation
    const visTriang = document.getElementById("vis-triangulation").checked;
    if (visTriang) {
        if (!window.triangulationLoaded) {
            window.triangulationLoaded = true;
            const vertices = new Float32Array(window.points);
            // Calculate triangulation
            window.delaunay = new Delaunator(vertices);
            var meshIndex = []; // delaunay index => three.js index
            for (let i = 0; i < window.delaunay.triangles.length; i++) {
                meshIndex.push(window.delaunay.triangles[i]);
            }

            // DRAW TRIANGULATION
            const geometryDelaunay = new BufferGeometry();
            geometryDelaunay.setAttribute(
                "position",
                new Float32BufferAttribute(vertices, 2)
            );
            geometryDelaunay.setIndex(meshIndex);
            const materialDelaunay = new MeshBasicMaterial({
                color: 0xffffff,
                side: DoubleSide,
                wireframe: true,
            });
            // geometryDelaunay.boundingSphere.radius = 1;
            const meshDelaunay = new Mesh(geometryDelaunay, materialDelaunay);
            meshDelaunay.renderOrder = 2;
            meshDelaunay.name = "triangulation";
            scene.add(meshDelaunay);
        }
    } else {
        if (window.triangulationLoaded) {
            window.triangulationLoaded = false;
            const mesh = scene.getObjectByName("triangulation");
            scene.remove(mesh);
        }
    }

    // Render
    renderer.render(scene, camera);
};

window.onload = init();
window.onload = animate();
