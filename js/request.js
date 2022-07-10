export const skyRequest = (query) => {
    const data = {
        ...query,
        radius: "3",
        whichway: "equatorial",
        limit: "50",
        format: "json",
        fp: "none",
        whichquery: "imaging",
    };
    const params = new URLSearchParams(data).toString();

    fetch(
        "https://skyserver.sdss.org/dr17/SkyServerWS/SearchTools/RadialSearch?" +
            params,
        {
            method: "GET",
        }
    )
        .then((response) => response.json())
        .then((data) => {
            console.log("QUERY:\n", data[1].Rows[0].query);
            console.log("DATA:\n", data[0].Rows);
            window.data = data[0].Rows; // SET GLOBAL
        });
};
