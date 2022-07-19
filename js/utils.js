// Async functions

export const generateEdges = async () => {
    // Get array of edges
    var tmp;
    var edgeList = [];
    var edgeListInner = [];
    for (var i = 0; i < window.delaunay.triangles.length; i += 3) {
        const d1 = [
            Math.min(
                window.delaunay.triangles[i],
                window.delaunay.triangles[i + 1]
            ),
            Math.max(
                window.delaunay.triangles[i],
                window.delaunay.triangles[i + 1]
            ),
            Math.pow(
                window.points[window.delaunay.triangles[i] * 2] -
                    window.points[window.delaunay.triangles[i + 1] * 2],
                2
            ) +
                Math.pow(
                    window.points[window.delaunay.triangles[i] * 2 + 1] -
                        window.points[window.delaunay.triangles[i + 1] * 2 + 1],
                    2
                ),
            i,
            null,
        ];
        tmp = edgeList.find((elm) => elm[0] == d1[0] && elm[1] == d1[1]);
        if (tmp === undefined) {
            edgeList.push(d1);
        } else {
            tmp = edgeList.indexOf(tmp);
            edgeList[tmp][4] = i;
            edgeListInner.push(edgeList[tmp]);
        }
        const d2 = [
            Math.min(
                window.delaunay.triangles[i],
                window.delaunay.triangles[i + 2]
            ),
            Math.max(
                window.delaunay.triangles[i],
                window.delaunay.triangles[i + 2]
            ),
            Math.pow(
                window.points[window.delaunay.triangles[i] * 2] -
                    window.points[window.delaunay.triangles[i + 2] * 2],
                2
            ) +
                Math.pow(
                    window.points[window.delaunay.triangles[i] * 2 + 1] -
                        window.points[window.delaunay.triangles[i + 2] * 2 + 1],
                    2
                ),
            i,
            null,
        ];
        tmp = edgeList.find((elm) => elm[0] == d2[0] && elm[1] == d2[1]);
        if (tmp === undefined) {
            edgeList.push(d2);
        } else {
            tmp = edgeList.indexOf(tmp);
            edgeList[tmp][4] = i;
            edgeListInner.push(edgeList[tmp]);
        }
        const d3 = [
            Math.min(
                window.delaunay.triangles[i + 1],
                window.delaunay.triangles[i + 2]
            ),
            Math.max(
                window.delaunay.triangles[i + 1],
                window.delaunay.triangles[i + 2]
            ),
            Math.pow(
                window.points[window.delaunay.triangles[i + 1] * 2] -
                    window.points[window.delaunay.triangles[i + 2] * 2],
                2
            ) +
                Math.pow(
                    window.points[window.delaunay.triangles[i + 1] * 2 + 1] -
                        window.points[window.delaunay.triangles[i + 2] * 2 + 1],
                    2
                ),
            i,
            null,
        ];
        tmp = edgeList.find((elm) => elm[0] == d3[0] && elm[1] == d3[1]);
        if (tmp === undefined) {
            edgeList.push(d3);
        } else {
            tmp = edgeList.indexOf(tmp);
            edgeList[tmp][4] = i;
            edgeListInner.push(edgeList[tmp]);
        }
    }
    //  Sort by lenght
    window.edges = edgeList.sort((a, b) => a[2] - b[2]);
    window.edgesInner = edgeListInner;
    window.edgesLoaded = true;
    document.getElementById("est-edges").textContent = window.edges.length;
    document.getElementById("est-edges-inner").textContent =
        window.edgesInner.length;
    // Allow void
    document.getElementById("vis-void").removeAttribute("disabled", "");
    return true;
};

export const generateVoid = () => {
    //  Classification
    var sets = []; // Sets of possibles voids
    var sets_idx = []; // Sets of possibles voids for drawing
    var marked_triangules = []; // Array of booleans
    var marked_triangules_count = 0;

    // Optimization (?)
    var valid_edges = window.edgesInner.valueOf();

    // Search sets (ALL -> check for alternative)
    while (marked_triangules_count < window.delaunay.triangles.length / 3) {
        var triangle_set = [];
        var triangle_set_idx = [];
        // Search longes edge (unmarked triangules)
        for (var le_idx = 0; le_idx < window.edges.length; le_idx++) {
            var lefound = false;
            var le = window.edges[window.edges.length - 1 - le_idx];
            if (!marked_triangules[le[3]]) {
                triangle_set.push(le[3]);
                var point_idx_1 = window.delaunay.triangles[le[3]];
                var point_idx_2 = window.delaunay.triangles[le[3] + 1];
                var point_idx_3 = window.delaunay.triangles[le[3] + 2];
                triangle_set_idx.push(point_idx_1, point_idx_2, point_idx_3);
                marked_triangules[le[3]] = true;
                marked_triangules_count++;
                lefound = true;
            }
            if (le[4]) {
                if (!marked_triangules[le[4]]) {
                    triangle_set.push(le[4]);
                    var point_idx_1 = window.delaunay.triangles[le[4]];
                    var point_idx_2 = window.delaunay.triangles[le[4] + 1];
                    var point_idx_3 = window.delaunay.triangles[le[4] + 2];
                    triangle_set_idx.push(
                        point_idx_1,
                        point_idx_2,
                        point_idx_3
                    );
                    marked_triangules[le[4]] = true;
                    marked_triangules_count++;
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
                    valid_edges.splice(e, 1);
                    e--;
                    continue;
                }
                // If t1 is not in the system, check longest edge
                if (!t1_inc) {
                    if (marked_triangules[t1]) continue;
                    var p1 = window.delaunay.triangles[t1] * 2;
                    var p2 = window.delaunay.triangles[t1 + 1] * 2;
                    var p3 = window.delaunay.triangles[t1 + 2] * 2;
                    var dmax = Math.max(
                        Math.pow(window.points[p1] - window.points[p2], 2) +
                            Math.pow(
                                window.points[p1 + 1] - window.points[p2 + 1],
                                2
                            ),
                        Math.pow(window.points[p1] - window.points[p3], 2) +
                            Math.pow(
                                window.points[p1 + 1] - window.points[p3 + 1],
                                2
                            ),
                        Math.pow(window.points[p2] - window.points[p3], 2) +
                            Math.pow(
                                window.points[p2 + 1] - window.points[p3 + 1],
                                2
                            )
                    );
                    if (dmax == valid_edges[e][2]) {
                        found = true;
                        triangle_set.push(t1);
                        marked_triangules[t1] = true;
                        marked_triangules_count++;
                        triangle_set_idx.push(p1 / 2, p2 / 2, p3 / 2);
                        valid_edges.splice(e, 1);
                        e--;
                    }
                } else {
                    if (marked_triangules[t2]) continue;
                    var p1 = window.delaunay.triangles[t2] * 2;
                    var p2 = window.delaunay.triangles[t2 + 1] * 2;
                    var p3 = window.delaunay.triangles[t2 + 2] * 2;
                    var dmax = Math.max(
                        Math.pow(window.points[p1] - window.points[p2], 2) +
                            Math.pow(
                                window.points[p1 + 1] - window.points[p2 + 1],
                                2
                            ),
                        Math.pow(window.points[p1] - window.points[p3], 2) +
                            Math.pow(
                                window.points[p1 + 1] - window.points[p3 + 1],
                                2
                            ),
                        Math.pow(window.points[p2] - window.points[p3], 2) +
                            Math.pow(
                                window.points[p2 + 1] - window.points[p3 + 1],
                                2
                            )
                    );
                    if (dmax == valid_edges[e][2]) {
                        found = true;
                        triangle_set.push(t2);
                        marked_triangules[t2] = true;
                        marked_triangules_count++;
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

    window.voidSets = sets;
    window.voidSetsIdx = sets_idx;
};
