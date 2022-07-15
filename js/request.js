export const skyRequest = (query, ra, dec, amp) => {
    const data = {
        ...query,
        whichway: "equatorial",
        limit: "500000",
        format: "json",
        fp: "none",
        whichquery: "imaging",
    };
    const params = new URLSearchParams(data).toString();

    fetch(
        "https://skyserver.sdss.org/dr17/SkyServerWS/SearchTools/RectangularSearch?" +
            params,
        {
            method: "GET",
        }
    )
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
            window.data = star_data;
            window.total = data[0].Rows.length;
            window.ras = star_data.map(
                (x) => ((x.ra - (ra - amp / 2)) * 2) / amp - 1
            );
            window.decs = star_data.map(
                (x) => ((x.dec - (dec - amp / 2)) * 2) / amp - 1
            );
            // console.log(window.ras, window.decs);
        });
};
