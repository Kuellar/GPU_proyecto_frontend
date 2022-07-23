export const edgeLengCalc = (ax, ay, bx, by) => {
    const res = Math.pow(ax - bx, 2) + Math.pow(ay - by, 2);
    return Math.sqrt(res);
};

export const areaCalc = (e1, e2, e3) => {
    const s = (e1 + e2 + e3) / 2;
    const res = Math.sqrt(s * (s - e1) * (s - e2) * (s - e3));
    return res;
};
