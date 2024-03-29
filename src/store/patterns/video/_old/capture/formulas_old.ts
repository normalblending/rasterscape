// это из предыдщего проекта нужно перенести формулы в этот
export const Formulas = (W, H) => ({
    xx: {
        text: 'x',
        f: ({array}) => x => array[x],
        scope: {
            array: {
                value: (Array.from(Array(W))).map((o, i) => i * H / W),
                w: W,
                h: H
            }
        }
    },
    yy: {
        text: 'y',
        f: () => (x, y) => y,
        scope: {}
    },
    sq: {
        text: 'sin(x / a) * cos(y / b) * c + f',
        f: ({a, b, c, h}) => (x, y) => (Math.sin(x / a) * Math.cos(y / b) * c + h),
        presets: {
            p1: {a: 3, b: 64, c: -77, h: 126},
            p2: {a: 11, b: 11, c: 140, h: 150},
            p3: {a: 14, b: 214, c: -135, h: 135},
            p4: {a: 54, b: 66, c: 159, h: 159},
        },
        scope: {
            a: {
                value: 25,
                min: 1,
                max: W
            },
            b: {
                value: 25,
                min: 1,
                max: H
            },
            c: {
                value: 50,
                min: -W,
                max: W
            },
            h: {
                value: 50,
                min: -H,
                max: H
            }
        }
    },
    sis2: {
        text: 'XA * sqrt((x - W / 2)^2 + (y - H / 2)^2)+ H + cosA * cos(sqrt((x * xN / xD - W / 2)^2 + (y * yN / yD - H / 2)^2)',
        f: ({cosA, h, xN, yN, xD, yD, XA, xdd, ydd}) => (x, y) =>
            XA * Math.sqrt(Math.pow(x - W / 2 + xdd, 2) + Math.pow(y - H / 2 + ydd, 2))
            + h
            + cosA * Math.cos(Math.sqrt(Math.pow(x * xN / xD - W / 2 + xdd, 2) + Math.pow(y * yN / yD - H / 2 + ydd, 2))),
        presets: {
            x8: {XA: -1.5, h: 111, cosA: 46, xN: 46, xD: 578, yN: 10, yD: 163, xdd: 0, ydd: 0},
            o: {XA: 8, h: -180, cosA: 0, xN: 0, xD: 1, yN: 0, yD: 1, xdd: 0, ydd: 0},
            p3: {XA: 0.9, h: 168, cosA: 131, xN: 266, xD: 1, yN: 329, yD: 100, xdd: -45, ydd: -1},
            c: {XA: 2.7, h: 149, cosA: 89, xN: 159, xD: 1, yN: 6, yD: 1, xdd: 0, ydd: 0},
            f: {XA: 2.1, h: 122, cosA: 79, xN: 1, xD: 1, yN: 21, yD: 1, xdd: 0, ydd: 22},
        },
        scope: {
            XA: {
                value: 1.6,
                min: -10,
                max: 10,
                step: 0.1
            },
            h: {
                value: 0,
                min: -W * 2,
                max: W * 2
            },
            cosA: {
                value: 0,
                min: 0,
                max: 200
            },
            xN: {
                value: 1,
                min: 0,
                max: W * 2
            },
            xD: {
                value: 1,
                min: 1,
                max: W * 2
            },
            yN: {
                value: 1,
                min: 0,
                max: W * 2
            },
            yD: {
                value: 1,
                min: 1,
                max: W * 2
            },
            xdd: {
                value: 0,
                min: -W * 2,
                max: W * 2
            },
            ydd: {
                value: 0,
                min: -H * 2,
                max: H * 2
            },
        }
    },
    sss: {
        text: "x^2 / a + y^2 / b + c",
        f: ({a, b, c}) => (x, y) => Math.pow(x - W / 2, 2) /a + Math.pow(y - H / 2, 2) / b + c,
        scope: {
            a: {
                value: 23,
                min: -500,
                max: 500,
                step: 1
            },
            b: {
                value: 23,
                min: -500,
                max: 500,
                step: 1
            },
            c: {
                value: 70,
                min: -1000,
                max: 1000,
                step: 5
            }
        }
    }
});
