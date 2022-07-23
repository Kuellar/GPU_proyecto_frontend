import Delaunator from "delaunator";
import {
    BufferGeometry,
    Camera,
    Clock,
    Color,
    DoubleSide,
    Float32BufferAttribute,
    Mesh,
    MeshBasicMaterial,
    Points,
    PointsMaterial,
    Scene,
    ShaderMaterial,
    TextureLoader,
    Vector2,
    WebGLRenderer,
} from "three";
import { fsSourceStar, vsSourceStar } from "../js/shaders.js";
import { generateEdges, generateVoid } from "../js/utils.js";
import { fetchData } from "../js/actions.js";

var container, camera, scene, renderer, clock, loader;
var base_uniforms, starfield_uniforms;

const init = () => {
    // Base data
    window.starfieldLoaded = false;
    window.pointsLoaded = false;
    window.triangulationLoaded = false;
    window.voidLoaded = false;
    window.edgesLoaded = false;
    window.points = [];
    window.drawing_points = [];
    window.gPoints = [];
    window.iPoints = [];
    window.edges = [];
    window.edgesInner = [];
    window.delaunay = new Delaunator(window.points);
    window.voidSets = [];
    window.voidSetsIdx = [];
    window.triangEdge = [];
    window.setArea = [];
    window.amp = 0;
    window.ra = 180;
    window.dec = 0;
    window.forwardTime = true;

    // Set void disabled to avoid errors
    document.getElementById("vis-void").setAttribute("disabled", "");
    document.getElementById("vis-void").checked = false;

    // Setup three.js
    container = document.getElementById("threeJS");

    camera = new Camera();
    camera.position.z = 1;

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
    base_uniforms.u_resolution.value.x = size;
    base_uniforms.u_resolution.value.y = size;
};

const animate = () => {
    requestAnimationFrame(animate);
    render();
};

const render = () => {
    // Update time - avoid infinity time
    if (window.forwardTime && base_uniforms.u_time.value < 15)
        base_uniforms.u_time.value += clock.getDelta();
    if (window.forwardTime && base_uniforms.u_time.value >= 15) {
        window.forwardTime = !window.forwardTime;
        base_uniforms.u_time.value -= clock.getDelta();
    }
    if (!window.forwardTime && base_uniforms.u_time.value > 1)
        base_uniforms.u_time.value -= clock.getDelta();
    if (!window.forwardTime && base_uniforms.u_time.value <= 1) {
        window.forwardTime = !window.forwardTime;
        base_uniforms.u_time.value += clock.getDelta();
    }

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
            // DRAW STARS
            const geometry = new BufferGeometry();
            geometry.setAttribute(
                "position",
                new Float32BufferAttribute(window.drawing_points, 3)
            );
            geometry.setAttribute(
                "aG",
                new Float32BufferAttribute(window.gPoints, 1)
            );
            geometry.setAttribute(
                "aI",
                new Float32BufferAttribute(window.iPoints, 1)
            );

            starfield_uniforms = {
                ...base_uniforms,
                u_stars_amp: {
                    type: "float",
                    value: window.amp * 60,
                },
            };
            const materialPoints = new ShaderMaterial({
                uniforms: starfield_uniforms,
                vertexShader: vsSourceStar,
                fragmentShader: fsSourceStar,
                transparent: true,
                depthWrite: false,
            });
            const meshPoints = new Points(geometry, materialPoints);
            meshPoints.name = "starfield";
            meshPoints.renderOrder = 0;
            scene.add(meshPoints);
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

            // DRAW POINTS
            const geometryPoint = new BufferGeometry();
            geometryPoint.setAttribute(
                "position",
                new Float32BufferAttribute(window.drawing_points, 3)
            );
            const materialPoints = new PointsMaterial({
                color: 0xffffff,
                // size: 4,
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

            // Calculate triangulation
            window.delaunay = new Delaunator(window.points);
            document.getElementById("est-triang").textContent =
                window.delaunay.triangles.length / 3;
            var meshIndex = []; // delaunay index => three.js index
            for (let i = 0; i < window.delaunay.triangles.length; i++) {
                meshIndex.push(window.delaunay.triangles[i]);
            }

            // DRAW TRIANGULATION
            const geometryDelaunay = new BufferGeometry();
            geometryDelaunay.setAttribute(
                "position",
                new Float32BufferAttribute(window.drawing_points, 3)
            );
            geometryDelaunay.setIndex(meshIndex);
            const materialDelaunay = new MeshBasicMaterial({
                color: 0xffffff,
                side: DoubleSide,
                wireframe: true,
            });

            const meshDelaunay = new Mesh(geometryDelaunay, materialDelaunay);
            meshDelaunay.renderOrder = 5;
            meshDelaunay.name = "triangulation";
            meshDelaunay.geometry.computeBoundingSphere();
            scene.add(meshDelaunay);

            if (!window.edgesLoaded) {
                generateEdges();
            }
        }
    } else {
        if (window.triangulationLoaded) {
            window.triangulationLoaded = false;
            const mesh = scene.getObjectByName("triangulation");
            scene.remove(mesh);
        }
    }

    // Void
    const visVoid = document.getElementById("vis-void").checked;
    if (visVoid) {
        if (!window.voidLoaded && window.edgesLoaded) {
            window.voidLoaded = true;

            if (window.voidSets.length === 0) {
                generateVoid();
            }

            // DRAW VOID
            var setAreaCopy = [...window.setArea];
            for (var i = 0; i < Math.min(10, window.voidSetsIdx.length); i++) {
                var idxBigger = window.setArea.indexOf(
                    Math.max(...setAreaCopy)
                );
                setAreaCopy[idxBigger] = 0;
                const geometryVoid = new BufferGeometry();
                geometryVoid.setAttribute(
                    "position",
                    new Float32BufferAttribute(window.drawing_points, 3)
                );
                // geometryVoid.setIndex([point_idx_1, point_idx_2, point_idx_3]);

                geometryVoid.setIndex(window.voidSetsIdx[idxBigger]);
                const materialVoid = new MeshBasicMaterial({
                    color: new Color(1 / (i + 1), 1 / (i + 1), 1 / (i + 1)),
                    side: DoubleSide,
                    wireframe: false,
                });
                const meshVoid = new Mesh(geometryVoid, materialVoid);
                meshVoid.renderOrder = 4;
                meshVoid.name = "void" + i;
                scene.add(meshVoid);
            }
        }
    } else {
        if (window.voidLoaded) {
            window.voidLoaded = false;
            var voids_names = [];
            for (var i = 0; i < scene.children.length; i++) {
                if (scene.children[i].name.includes("void"))
                    voids_names.push(scene.children[i].name);
            }
            for (var i = 0; i < voids_names.length; i++) {
                scene.remove(scene.getObjectByName(voids_names[i]));
            }
        }
    }

    // Render
    renderer.render(scene, camera);
};

window.onload = init();
window.onload = animate();
window.onload = fetchData();
