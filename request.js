export const skyRequest = (query) => {
    const data = {
        ...query,
        radius: "3",
        whichway: "equatorial",
        limit: "10",
        format: "json",
        fp: "none",
        whichquery: "imaging",
    };
    const params = new URLSearchParams(data).toString();

    fetch(
        "http://skyserver.sdss.org/dr17/SkyServerWS/SearchTools/RadialSearch?" +
            params,
        {
            method: "GET",
        }
    )
        .then((response) => response.json())
        .then((data) => console.log(data));
};
