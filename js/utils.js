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
    // Allow void
    document.getElementById("vis-void").removeAttribute("disabled", "");
    return true;
};
