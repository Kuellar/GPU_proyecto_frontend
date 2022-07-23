import { Voidseeker } from "./voidseeker";

/*
 *   SKYSERVER API and Database
 *   Documentation: http://skyserver.sdss.org/dr16/en/help/docs/api.aspx
 *   TEST SQL: http://skyserver.sdss.org/dr17/SearchTools/sql
 *   TABLES: http://skyserver.sdss.org/dr17/MoreTools/browser
 *   Recomendation: Try first the api, the response return the sql search
 */
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
            const starData = data[0].Rows;

            if (!starData.length) {
                alert("No data");
                return;
            }
            console.log("DATA:\n", starData);

            console.log("MUESTRA:\n");
            console.table(
                starData.slice(0, 10).map((x) => ({
                    obj: x.obj,
                    objid: x.objid,
                    ra: x.ra,
                    dec: x.dec,
                }))
            );

            // SET GLOBAL
            window.ra = ra;
            window.dec = dec;
            window.amp = amp;
            window.voidseeker = new Voidseeker(starData, ra, dec, amp);
        });
};
