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
        var edgeList = [];
        var edgeListInner = [];
        for (var i = 0; i < this.triangles.length; i += 3) {
            const d1 = [
                Math.min(this.triangles[i], this.triangles[i + 1]),
                Math.max(this.triangles[i], this.triangles[i + 1]),
                edgeLengCalc(
                    this.points[this.triangles[i] * 2],
                    this.points[this.triangles[i] * 2 + 1],
                    this.points[this.triangles[i + 1] * 2],
                    this.points[this.triangles[i + 1] * 2 + 1]
                ),
                i,
                null,
            ];
            tmp = edgeList.find((elm) => elm[0] == d1[0] && elm[1] == d1[1]); // FIX THIS
            if (tmp === undefined) {
                edgeList.push(d1);
            } else {
                tmp = edgeList.indexOf(tmp); // FIX THIS
                edgeList[tmp][4] = i;
                edgeListInner.push(edgeList[tmp]);
            }
            const d2 = [
                Math.min(this.triangles[i], this.triangles[i + 2]),
                Math.max(this.triangles[i], this.triangles[i + 2]),
                edgeLengCalc(
                    this.points[this.triangles[i] * 2],
                    this.points[this.triangles[i] * 2 + 1],
                    this.points[this.triangles[i + 2] * 2],
                    this.points[this.triangles[i + 2] * 2 + 1]
                ),
                i,
                null,
            ];
            tmp = edgeList.find((elm) => elm[0] == d2[0] && elm[1] == d2[1]); // FIX THIS
            if (tmp === undefined) {
                edgeList.push(d2);
            } else {
                tmp = edgeList.indexOf(tmp); // FIX THIS
                edgeList[tmp][4] = i;
                edgeListInner.push(edgeList[tmp]);
            }
            const d3 = [
                Math.min(this.triangles[i + 1], this.triangles[i + 2]),
                Math.max(this.triangles[i + 1], this.triangles[i + 2]),
                edgeLengCalc(
                    this.points[this.triangles[i + 1] * 2],
                    this.points[this.triangles[i + 1] * 2 + 1],
                    this.points[this.triangles[i + 2] * 2],
                    this.points[this.triangles[i + 2] * 2 + 1]
                ),
                i,
                null,
            ];
            tmp = edgeList.find((elm) => elm[0] == d3[0] && elm[1] == d3[1]); // FIX THIS
            if (tmp === undefined) {
                edgeList.push(d3);
            } else {
                tmp = edgeList.indexOf(tmp); // FIX THIS
                edgeList[tmp][4] = i;
                edgeListInner.push(edgeList[tmp]);
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

        // Generate triang - edge
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

        // Search sets (ALL -> check for alternative)
        while (marked_triangules_count < this.triangles.length / 3) {
            var triangle_set = [];
            var triangle_set_idx = [];
            var area = 0;
            // Search longes edge (unmarked triangules)
            for (var le_idx = 0; le_idx < this.edges.length; le_idx++) {
                var le = this.edges[this.edges.length - 1 - le_idx];
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
                for (var e = 0; e < valid_edges.length; e++) {
                    var t1 = valid_edges[e][3];
                    var t2 = valid_edges[e][4];
                    if (!t2) {
                        console.log("Impossible case");
                        continue;
                    }
                    var t1_inc = triangle_set.includes(t1); // Check
                    var t2_inc = triangle_set.includes(t2); // Check
                    if (!t1_inc && !t2_inc) continue;

                    if (t1_inc && t2_inc) {
                        valid_edges.splice(e, 1);
                        e--;
                        continue;
                    }
                    // If t1 is not in the system, check longest edge
                    if (!t1_inc) {
                        if (marked_triangules[t1]) continue;
                        var p1 = this.triangles[t1] * 2;
                        var p2 = this.triangles[t1 + 1] * 2;
                        var p3 = this.triangles[t1 + 2] * 2;
                        var dmax = Math.max(
                            edgeLengCalc(
                                this.points[p1],
                                this.points[p1 + 1],
                                this.points[p2],
                                this.points[p2 + 1]
                            ),
                            edgeLengCalc(
                                this.points[p1],
                                this.points[p1 + 1],
                                this.points[p3],
                                this.points[p3 + 1]
                            ),
                            edgeLengCalc(
                                this.points[p2],
                                this.points[p2 + 1],
                                this.points[p3],
                                this.points[p3 + 1]
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
                            area += areaCalc(
                                this.edges[this.triangEdge[t1 / 3][0]][2],
                                this.edges[this.triangEdge[t1 / 3][1]][2],
                                this.edges[this.triangEdge[t1 / 3][2]][2]
                            );
                        }
                    } else {
                        if (marked_triangules[t2]) continue;
                        var p1 = this.triangles[t2] * 2;
                        var p2 = this.triangles[t2 + 1] * 2;
                        var p3 = this.triangles[t2 + 2] * 2;
                        var dmax = Math.max(
                            edgeLengCalc(
                                this.points[p1],
                                this.points[p1 + 1],
                                this.points[p2],
                                this.points[p2 + 1]
                            ),
                            edgeLengCalc(
                                this.points[p1],
                                this.points[p1 + 1],
                                this.points[p3],
                                this.points[p3 + 1]
                            ),
                            edgeLengCalc(
                                this.points[p2],
                                this.points[p2 + 1],
                                this.points[p3],
                                this.points[p3 + 1]
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
                            area += areaCalc(
                                this.edges[this.triangEdge[t2 / 3][0]][2],
                                this.edges[this.triangEdge[t2 / 3][1]][2],
                                this.edges[this.triangEdge[t2 / 3][2]][2]
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
