
export const xyParaboloid = (centerX, centerY, kx, ky) => (x, y) =>
    Math.pow(x - centerX, 2) * kx
    + Math.pow(y - centerY, 2) * ky;

export const paraboloidBySizes = (a, b, c, x, y) => {
    const f = xyParaboloid(1/2, 1/2, x, y);
}