
export const xyParaboloid = (centerX, centerY, kx, ky) => (x, y) =>
    Math.pow(x - centerX, 2) * kx
    + Math.pow(y - centerY, 2) * ky;