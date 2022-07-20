export const skyRequest = (query, ra, dec, amp, rect) => {
    const data = {
        ...query,
        whichway: "equatorial",
        limit: "500000",
        format: "json",
        fp: "none",
        whichquery: "imaging",
    };
    const params = new URLSearchParams(data).toString();
    var url = "";
    if (rect) {
        url =
            "https://skyserver.sdss.org/dr17/SkyServerWS/SearchTools/RectangularSearch?" +
            params;
    } else {
        url =
            "https://skyserver.sdss.org/dr17/SkyServerWS/SearchTools/RadialSearch?" +
            params;
    }
    fetch(url, {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("QUERY:\n", data[1].Rows[0].query);
            const star_data = data[0].Rows;
            console.log("DATA:\n", star_data);

            console.log("MUESTRA:\n");
            console.table(
                star_data.slice(0, 10).map((x) => ({
                    obj: x.obj,
                    objid: x.objid,
                    ra: x.ra,
                    dec: x.dec,
                }))
            );
            // SET GLOBAL
            if (!star_data.length) {
                alert("No data");
                return;
            }
            star_data.forEach((star) => {
                window.points.push(((star.ra - (ra - amp / 2)) * 2) / amp - 1);
                window.drawing_points.push(
                    ((star.ra - (ra - amp / 2)) * 2) / amp - 1
                );
                window.points.push(
                    ((star.dec - (dec - amp / 2)) * 2) / amp - 1
                );
                window.drawing_points.push(
                    ((star.dec - (dec - amp / 2)) * 2) / amp - 1
                );
                window.drawing_points.push(0);
                window.gPoints.push(star.g);
                window.iPoints.push(star.i);
            });
            window.points = new Float32Array(window.points); // CHECK
            window.drawing_points = new Float32Array(window.drawing_points); // CHECK
            window.amp = amp;
            document.getElementById("est-points").textContent =
                window.points.length / 2;
            // console.log(window.points);
        });
};
