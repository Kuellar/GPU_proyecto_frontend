import Delaunator from "delaunator";
import { edgeLengCalc, areaCalc } from "./utils";

/*
 *  Class that storage the data - Data structure
 */
export class Voidseeker {
    constructor(starData, ra, dec, amp) {
        console.time("setPoints");
        this.rawData = starData;
        this.points = []; // [x0, y0, x1, y1, ..., xn, yn]
        this.drawingPoints = []; // [x0, y0, 0, x1, y1, 0,..., xn, yn, 0]
        // Constant for drawing fancy stars
        this.gPoints = [];
        this.iPoints = [];

        starData.forEach((star) => {
            // X
            this.points.push(((star.ra - (ra - amp / 2)) * 2) / amp - 1);
            this.drawingPoints.push(((star.ra - (ra - amp / 2)) * 2) / amp - 1);
            // Y
            this.points.push(((star.dec - (dec - amp / 2)) * 2) / amp - 1);
            this.drawingPoints.push(
                ((star.dec - (dec - amp / 2)) * 2) / amp - 1
            );
            // Z
            this.drawingPoints.push(0);
            // Constants
            this.gPoints.push(star.g);
            this.iPoints.push(star.i);
        });

        // Update html Statistics
        document.getElementById("est-points").textContent =
            this.points.length / 2;

        // console.log(this);
        console.timeEnd("setPoints");
    }

    setTriangulation() {
        console.time("setTriangulation");
        const delaunay = new Delaunator(this.points);

        this.triangles = [];
        for (let i = 0; i < delaunay.triangles.length; i++) {
            this.triangles.push(delaunay.triangles[i]);
        }

        // Update html Statistics
        document.getElementById("est-triang").textContent =
            this.triangles.length / 3;

        // console.log(this);
        console.timeEnd("setTriangulation");
    }

    setEdges() {
        console.time("setEdges");
        // Get array of edges
        var tmp;
        var edgeList = []; // Edges know their points, distance and triangles
        var edgeListInner = [];
        var edgeListTmp = [...new Array(this.points.length / 2)].map(() => []); // For optimization
        for (var i = 0; i < this.triangles.length; i += 3) {
            const point1 = this.triangles[i];
            const point2 = this.triangles[i + 1];
            const point3 = this.triangles[i + 2];

            // Edge 1
            tmp = edgeListTmp[Math.min(point1, point2)]?.find(
                (elm) => elm[1] == Math.max(point1, point2)
            );
            if (tmp) {
                tmp[4] = i;
                edgeListInner.push(tmp);
            } else {
                const edge1 = [
                    Math.min(point1, point2), // point 1
                    Math.max(point1, point2), // point 2
                    edgeLengCalc(
                        this.points[point1 * 2],
                        this.points[point1 * 2 + 1],
                        this.points[point2 * 2],
                        this.points[point2 * 2 + 1]
                    ),
                    i, // triangle
                    null, // triangle
                ];
                edgeListTmp[Math.min(point1, point2)].push(edge1);
            }

            // Edge 2
            tmp = edgeListTmp[Math.min(point1, point3)]?.find(
                (elm) => elm[1] == Math.max(point1, point3)
            );
            if (tmp) {
                tmp[4] = i;
                edgeListInner.push(tmp);
            } else {
                const edge2 = [
                    Math.min(point1, point3), // point 1
                    Math.max(point1, point3), // point 2
                    edgeLengCalc(
                        this.points[point1 * 2],
                        this.points[point1 * 2 + 1],
                        this.points[point3 * 2],
                        this.points[point3 * 2 + 1]
                    ),
                    i, // triangle
                    null, // triangle
                ];
                edgeListTmp[Math.min(point1, point3)].push(edge2);
            }

            // Edge 3
            tmp = edgeListTmp[Math.min(point2, point3)]?.find(
                (elm) => elm[1] == Math.max(point2, point3)
            );
            if (tmp) {
                tmp[4] = i;
                edgeListInner.push(tmp);
            } else {
                const edge3 = [
                    Math.min(point2, point3), // point 1
                    Math.max(point2, point3), // point 2
                    edgeLengCalc(
                        this.points[point2 * 2],
                        this.points[point2 * 2 + 1],
                        this.points[point3 * 2],
                        this.points[point3 * 2 + 1]
                    ),
                    i, // triangle
                    null, // triangle
                ];
                edgeListTmp[Math.min(point2, point3)].push(edge3);
            }
        }
        for (var i = 0; i < edgeListTmp.length; i++) {
            for (var j = 0; j < edgeListTmp[i].length; j++) {
                edgeList.push(edgeListTmp[i][j]);
            }
        }

        //  Sort by lenght
        this.edges = edgeList.sort((a, b) => a[2] - b[2]);
        this.edgesInner = edgeListInner;

        // Update html - Allow void
        document.getElementById("est-edges").textContent = this.edges.length;
        document.getElementById("est-edges-inner").textContent =
            this.edgesInner.length;
        document.getElementById("vis-void").removeAttribute("disabled", "");

        // Generate triang - edge  // Obtein edge from triang position
        var triangEdge = Array(this.triangles.length / 3);
        for (var i = 0; i < this.edges.length; i++) {
            var idx1 = this.edges[i][3] / 3;
            var idx2 = this.edges[i][4] / 3;
            if (triangEdge[idx1]) triangEdge[idx1].push(i);
            else triangEdge[idx1] = [i];
            if (idx2) {
                if (triangEdge[idx2]) triangEdge[idx2].push(i);
                else triangEdge[idx2] = [i];
            }
        }
        this.triangEdge = triangEdge;

        // console.log(this);
        console.timeEnd("setEdges");
    }

    setVoids() {
        console.time("setVoids");
        //  Classification
        var sets = []; // Sets of possibles voids
        var sets_area = []; // Sets of possibles voids (area)
        var sets_idx = []; // Sets of possibles voids for drawing
        var marked_triangules = Array(this.triangles.length / 3); // Array of booleans
        var marked_triangules_count = 0;

        // Optimization (?)
        var valid_edges = this.edgesInner.valueOf();

        // Search sets
        while (marked_triangules_count < this.triangles.length / 3) {
            var triangle_set = [];
            var triangle_set_idx = [];
            var area = 0;
            var le_idx = 0; // longest edge
            // Search longest edge (unmarked triangules -> O(n))
            for (var idx = 0; idx < this.edges.length; idx++) {
                var le = this.edges[this.edges.length - 1 - idx];
                if (le[4]) {
                    if (
                        !marked_triangules[le[3]] &&
                        !marked_triangules[le[4]]
                    ) {
                        // le[3]
                        triangle_set.push(le[3]);
                        var point_idx_1 = this.triangles[le[3]];
                        var point_idx_2 = this.triangles[le[3] + 1];
                        var point_idx_3 = this.triangles[le[3] + 2];
                        triangle_set_idx.push(
                            point_idx_1,
                            point_idx_2,
                            point_idx_3
                        );
                        marked_triangules[le[3]] = true;
                        marked_triangules_count++;
                        area += areaCalc(
                            this.edges[this.triangEdge[le[3] / 3][0]][2],
                            this.edges[this.triangEdge[le[3] / 3][1]][2],
                            this.edges[this.triangEdge[le[3] / 3][2]][2]
                        );
                        // le[4]
                        triangle_set.push(le[4]);
                        var point_idx_1 = this.triangles[le[4]];
                        var point_idx_2 = this.triangles[le[4] + 1];
                        var point_idx_3 = this.triangles[le[4] + 2];
                        triangle_set_idx.push(
                            point_idx_1,
                            point_idx_2,
                            point_idx_3
                        );
                        marked_triangules[le[4]] = true;
                        marked_triangules_count++;
                        area += areaCalc(
                            this.edges[this.triangEdge[le[4] / 3][0]][2],
                            this.edges[this.triangEdge[le[4] / 3][1]][2],
                            this.edges[this.triangEdge[le[4] / 3][2]][2]
                        );
                        le_idx = idx;
                        break;
                    }
                }
            }

            // ERROR
            if (triangle_set.length === 0) {
                // console.log("");
                break;
            }

            // Search adjacent triangules
            var found = true;
            while (found) {
                found = false;
                for (var t = 0; t < triangle_set.length; t++) {
                    var triangIdx = triangle_set[t] / 3;
                    var triang = this.triangEdge[triangIdx];
                    // Edge 1
                    var ed1 = this.edges[triang[0]];
                    var neighbor1Idx = ed1[3] === triangIdx ? ed1[4] : ed1[3];
                    if (neighbor1Idx && !marked_triangules[neighbor1Idx]) {
                        var neighbor1TriangEdges =
                            this.triangEdge[neighbor1Idx / 3];
                        if (
                            Math.max(
                                this.edges[neighbor1TriangEdges[0]][2],
                                this.edges[neighbor1TriangEdges[1]][2],
                                this.edges[neighbor1TriangEdges[2]][2]
                            ) === ed1[2]
                        ) {
                            found = true;
                            triangle_set.push(neighbor1Idx);
                            marked_triangules[neighbor1Idx] = true;
                            triangle_set_idx.push(
                                this.triangles[neighbor1Idx],
                                this.triangles[neighbor1Idx + 1],
                                this.triangles[neighbor1Idx + 2]
                            );
                            area += areaCalc(
                                this.edges[neighbor1TriangEdges[0]][2],
                                this.edges[neighbor1TriangEdges[1]][2],
                                this.edges[neighbor1TriangEdges[2]][2]
                            );
                        }
                    }
                    // Edge 2
                    var ed2 = this.edges[triang[1]];
                    var neighbor2Idx = ed2[3] === triangIdx ? ed2[4] : ed2[3];
                    if (neighbor2Idx && !marked_triangules[neighbor2Idx]) {
                        var neighbor2TriangEdges =
                            this.triangEdge[neighbor2Idx / 3];
                        if (
                            Math.max(
                                this.edges[neighbor2TriangEdges[0]][2],
                                this.edges[neighbor2TriangEdges[1]][2],
                                this.edges[neighbor2TriangEdges[2]][2]
                            ) === ed2[2]
                        ) {
                            found = true;
                            triangle_set.push(neighbor2Idx);
                            marked_triangules[neighbor2Idx] = true;
                            triangle_set_idx.push(
                                this.triangles[neighbor2Idx],
                                this.triangles[neighbor2Idx + 1],
                                this.triangles[neighbor2Idx + 2]
                            );
                            area += areaCalc(
                                this.edges[neighbor2TriangEdges[0]][2],
                                this.edges[neighbor2TriangEdges[1]][2],
                                this.edges[neighbor2TriangEdges[2]][2]
                            );
                        }
                    }
                    // Edge 3
                    var ed3 = this.edges[triang[2]];
                    var neighbor3Idx = ed3[3] === triangIdx ? ed3[4] : ed3[3];
                    if (neighbor3Idx && !marked_triangules[neighbor3Idx]) {
                        var neighbor3TriangEdges =
                            this.triangEdge[neighbor3Idx / 3];
                        if (
                            Math.max(
                                this.edges[neighbor3TriangEdges[0]][2],
                                this.edges[neighbor3TriangEdges[1]][2],
                                this.edges[neighbor3TriangEdges[2]][2]
                            ) === ed3[2]
                        ) {
                            found = true;
                            triangle_set.push(neighbor3Idx);
                            marked_triangules[neighbor3Idx] = true;
                            triangle_set_idx.push(
                                this.triangles[neighbor3Idx],
                                this.triangles[neighbor3Idx + 1],
                                this.triangles[neighbor3Idx + 2]
                            );
                            area += areaCalc(
                                this.edges[neighbor3TriangEdges[0]][2],
                                this.edges[neighbor3TriangEdges[1]][2],
                                this.edges[neighbor3TriangEdges[2]][2]
                            );
                        }
                    }
                }
            }
            sets.push(triangle_set);
            sets_idx.push(triangle_set_idx);
            sets_area.push(area);
        }

        this.setArea = sets_area;
        this.voidSets = sets;
        this.voidSetsIdx = sets_idx;

        // console.log(this);
        console.timeEnd("setVoids");
    }
}
