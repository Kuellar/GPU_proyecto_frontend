import { vsSource, fsSourcePoints, fsSourceStars } from "../js/shaders.js";
import { generateEdges } from "../js/utils.js";
import {
    Clock,
    ShaderMaterial,
    Mesh,
    PlaneBufferGeometry,
    BufferGeometry,
    Color,
    Scene,
    WebGLRenderer,
    Vector2,
    Camera,
    TextureLoader,
    MeshBasicMaterial,
    Points,
    Float32BufferAttribute,
    PointsMaterial,
    LineSegments,
    LineBasicMaterial,
    DoubleSide,
} from "three";
import Delaunator from "delaunator";

var container, camera, scene, renderer, clock, loader;
var base_uniforms, starfield_uniforms;

var materialStars, materialPoints, pointShader;

const init = () => {
    // Base data
    window.starfieldLoaded = false;
    window.pointsLoaded = false;
    window.triangulationLoaded = false;
    window.voidLoaded = false;
    window.edgesLoaded = false;
    window.points = [];
    window.drawing_points = [];
    window.edges = [];
    window.edgesInner = [];
    window.delaunay = new Delaunator(window.points);
    pointShader = false;

    // Set void disabled to avoid errors
    document.getElementById("vis-void").setAttribute("disabled", "");
    document.getElementById("vis-void").checked = false;

    // Setup three.js
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

            // console.log("////////DATOS////////");
            // console.log("point", window.points);
            // console.log("triangulation", window.delaunay.triangles);
            // console.log("edge", window.edges);

            //  Classification
            var sets = []; // Sets of possibles voids
            var sets_idx = []; // Sets of possibles voids for drawing
            var marked_triangules = []; // Array of booleans
            var marked_triangules_count = 0;

            // Optimization (?)
            var valid_edges = window.edgesInner.valueOf();

            // Search sets (ALL -> check for alternative)
            while (
                marked_triangules.length <
                window.delaunay.triangles.length / 3
            ) {
                var triangle_set = [];
                var triangle_set_idx = [];
                // Search longes edge (unmarked triangules)
                for (var le_idx = 0; le_idx < window.edges.length; le_idx++) {
                    var lefound = false;
                    var le = window.edges[window.edges.length - 1 - le_idx];
                    if (!marked_triangules.includes(le[3])) {
                        triangle_set.push(le[3]);
                        var point_idx_1 = window.delaunay.triangles[le[3]];
                        var point_idx_2 = window.delaunay.triangles[le[3] + 1];
                        var point_idx_3 = window.delaunay.triangles[le[3] + 2];
                        triangle_set_idx.push(
                            point_idx_1,
                            point_idx_2,
                            point_idx_3
                        );
                        marked_triangules.push(le[3]);
                        lefound = true;
                    }
                    if (le[4]) {
                        if (!marked_triangules.includes(le[4])) {
                            triangle_set.push(le[4]);
                            var point_idx_1 = window.delaunay.triangles[le[4]];
                            var point_idx_2 =
                                window.delaunay.triangles[le[4] + 1];
                            var point_idx_3 =
                                window.delaunay.triangles[le[4] + 2];
                            triangle_set_idx.push(
                                point_idx_1,
                                point_idx_2,
                                point_idx_3
                            );
                            marked_triangules.push(le[4]);
                            lefound = true;
                        }
                    }
                    if (lefound) break;
                }

                // ERROR
                if (triangle_set.length === 0) {
                    console.log("ERROR");
                    break;
                }

                // Search adjacent triangules
                var found = true;
                while (found) {
                    found = false;
                    for (var e = 0; e < valid_edges.length; e++) {
                        var t1 = valid_edges[e][3];
                        var t2 = valid_edges[e][4];
                        if (!t2) {
                            console.log("Impossible case");
                            continue;
                        }
                        var t1_inc = triangle_set.includes(t1);
                        var t2_inc = triangle_set.includes(t2);
                        if (!t1_inc && !t2_inc) continue;

                        if (t1_inc && t2_inc) {
                            console.log("TEST");
                            valid_edges.splice(e, 1);
                            e--;
                            continue;
                        }
                        // If t1 is not in the system, check longest edge
                        if (!t1_inc) {
                            if (marked_triangules.includes(t1)) continue;
                            var p1 = window.delaunay.triangles[t1] * 2;
                            var p2 = window.delaunay.triangles[t1 + 1] * 2;
                            var p3 = window.delaunay.triangles[t1 + 2] * 2;
                            var dmax = Math.max(
                                Math.pow(
                                    window.points[p1] - window.points[p2],
                                    2
                                ) +
                                    Math.pow(
                                        window.points[p1 + 1] -
                                            window.points[p2 + 1],
                                        2
                                    ),
                                Math.pow(
                                    window.points[p1] - window.points[p3],
                                    2
                                ) +
                                    Math.pow(
                                        window.points[p1 + 1] -
                                            window.points[p3 + 1],
                                        2
                                    ),
                                Math.pow(
                                    window.points[p2] - window.points[p3],
                                    2
                                ) +
                                    Math.pow(
                                        window.points[p2 + 1] -
                                            window.points[p3 + 1],
                                        2
                                    )
                            );
                            if (dmax == valid_edges[e][2]) {
                                found = true;
                                triangle_set.push(t1);
                                marked_triangules.push(t1);
                                triangle_set_idx.push(p1 / 2, p2 / 2, p3 / 2);
                                valid_edges.splice(e, 1);
                                e--;
                            }
                        } else {
                            if (marked_triangules.includes(t2)) continue;
                            var p1 = window.delaunay.triangles[t2] * 2;
                            var p2 = window.delaunay.triangles[t2 + 1] * 2;
                            var p3 = window.delaunay.triangles[t2 + 2] * 2;
                            var dmax = Math.max(
                                Math.pow(
                                    window.points[p1] - window.points[p2],
                                    2
                                ) +
                                    Math.pow(
                                        window.points[p1 + 1] -
                                            window.points[p2 + 1],
                                        2
                                    ),
                                Math.pow(
                                    window.points[p1] - window.points[p3],
                                    2
                                ) +
                                    Math.pow(
                                        window.points[p1 + 1] -
                                            window.points[p3 + 1],
                                        2
                                    ),
                                Math.pow(
                                    window.points[p2] - window.points[p3],
                                    2
                                ) +
                                    Math.pow(
                                        window.points[p2 + 1] -
                                            window.points[p3 + 1],
                                        2
                                    )
                            );
                            if (dmax == valid_edges[e][2]) {
                                found = true;
                                triangle_set.push(t2);
                                marked_triangules.push(t2);
                                triangle_set_idx.push(p1 / 2, p2 / 2, p3 / 2);
                                valid_edges.splice(e, 1);
                                e--;
                            }
                        }
                    }
                }
                sets.push(triangle_set);
                sets_idx.push(triangle_set_idx);
            }

            if (sets.length === 0) {
                console.log("ERROR FATAL");
                renderer.render(scene, camera);
                return;
            }
            console.log("SETS: ", sets);
            // DRAW VOID
            for (var i = 0; i < Math.min(10, sets_idx.length); i++) {
                const geometryVoid = new BufferGeometry();
                geometryVoid.setAttribute(
                    "position",
                    new Float32BufferAttribute(window.drawing_points, 3)
                );
                // geometryVoid.setIndex([point_idx_1, point_idx_2, point_idx_3]);

                geometryVoid.setIndex(sets_idx[i]);
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
