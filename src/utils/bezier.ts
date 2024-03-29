export function bindDrawFunctions(cvs) {


    var ctx = cvs.getContext("2d");

    var randomColors = [];
    for (var i = 0, j; i < 360; i++) {
        j = (i * 47) % 360;
        randomColors.push("hsl(" + j + ",50%,50%)");
    }
    var randomIndex = 0;


    const drawCircle = function (p, r, offset) {
        offset = offset || {x: 0, y: 0};
        var ox = offset.x;
        var oy = offset.y;
        ctx.beginPath();
        ctx.arc(p.x + ox, p.y + oy, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    };

    return {
        getCanvas: function () {
            return cvs;
        },

        reset: function (curve?, evt?) {
            cvs.width = cvs.width;
            ctx.strokeStyle = "black";
            ctx.fillStyle = "none";
            if (evt && curve) {
                curve.mouse = {x: evt.offsetX, y: evt.offsetY};
            }
            randomIndex = 0;
        },

        setColor: function (c) {
            ctx.strokeStyle = c;
        },

        noColor: function (c) {
            ctx.strokeStyle = "transparent";
        },

        setRandomColor: function () {
            randomIndex = (randomIndex + 1) % randomColors.length;
            var c = randomColors[randomIndex];
            ctx.strokeStyle = c;
        },

        setRandomFill: function (a) {
            randomIndex = (randomIndex + 1) % randomColors.length;
            a = (typeof a === "undefined") ? 1 : a;
            var c = randomColors[randomIndex];
            c = c.replace('hsl(', 'hsla(').replace(')', ',' + a + ')');
            ctx.fillStyle = c;
        },

        setFill: function (c) {
            ctx.fillStyle = c;
        },

        noFill: function () {
            ctx.fillStyle = "transparent";
        },

        drawSkeleton: function (curve, colors?, offset?, nocoords?) {
            colors = colors || {line: "rgba(255, 255, 255, .5)", points: "black"};
            offset = offset || {x: 0, y: 0};
            var pts = curve.points;
            ctx.strokeStyle = colors.line;
            this.drawLine(pts[0], pts[1], offset);
            if (pts.length === 3) {
                ctx.strokeStyle = colors.line;
                this.drawLine(pts[1], pts[2], offset);
            } else {
                ctx.strokeStyle = colors.line;
                this.drawLine(pts[2], pts[3], offset);
            }
            ctx.strokeStyle = colors.points;
            if (!nocoords) this.drawPoints(pts, offset);
        },

        drawCurve: function (curve, colors?, offset?) {
            colors = colors || {line: "lightgrey"};
            ctx.strokeStyle = colors.line;
            offset = offset || {x: 0, y: 0};
            var ox = offset.x;
            var oy = offset.y;
            ctx.beginPath();
            var p = curve.points, i;
            ctx.moveTo(p[0].x + ox, p[0].y + oy);
            if (p.length === 3) {
                ctx.quadraticCurveTo(
                    p[1].x + ox, p[1].y + oy,
                    p[2].x + ox, p[2].y + oy
                );
            }
            if (p.length === 4) {
                ctx.bezierCurveTo(
                    p[1].x + ox, p[1].y + oy,
                    p[2].x + ox, p[2].y + oy,
                    p[3].x + ox, p[3].y + oy
                );
            }
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.closePath();
            ctx.lineWidth = 1;
        },

        drawLine: function (p1, p2, offset) {
            offset = offset || {x: 0, y: 0};
            var ox = offset.x;
            var oy = offset.y;
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(p1.x + ox, p1.y + oy);
            ctx.lineTo(p2.x + ox, p2.y + oy);
            ctx.stroke();
            ctx.closePath();
        },

        drawPoint: function (p, offset) {
            offset = offset || {x: 0, y: 0};
            var ox = offset.x;
            var oy = offset.y;
            ctx.beginPath();
            ctx.arc(p.x + ox, p.y + oy, 5, 0, 2 * Math.PI);
            ctx.stroke();
        },

        drawPoints: function (points, offset) {
            offset = offset || {x: 0, y: 0};
            points.forEach(function (p, i) {
                if (i === 2 || i === 1)
                    drawCircle(p, 3, offset);
                else {
                    const r = 5;
                    ctx.rect(offset.x + p.x - r / 2, offset.y + p.y - r / 2, r, r);
                    ctx.stroke();
                }
            }.bind(this));
        },

        drawArc: function (p, offset) {
            offset = offset || {x: 0, y: 0};
            var ox = offset.x;
            var oy = offset.y;
            ctx.beginPath();
            ctx.moveTo(p.x + ox, p.y + oy);
            ctx.arc(p.x + ox, p.y + oy, p.r, p.s, p.e);
            ctx.lineTo(p.x + ox, p.y + oy);
            ctx.fill();
            ctx.stroke();
        },

        drawCircle,

        drawbbox: function (bbox, offset) {
            offset = offset || {x: 0, y: 0};
            var ox = offset.x;
            var oy = offset.y;
            ctx.beginPath();
            ctx.moveTo(bbox.x.min + ox, bbox.y.min + oy);
            ctx.lineTo(bbox.x.min + ox, bbox.y.max + oy);
            ctx.lineTo(bbox.x.max + ox, bbox.y.max + oy);
            ctx.lineTo(bbox.x.max + ox, bbox.y.min + oy);
            ctx.closePath();
            ctx.stroke();
        },

        drawRect: function (p, w, h, offset) {
            offset = offset || {x: 0, y: 0};
            var ox = offset.x;
            var oy = offset.y;
            ctx.beginPath();
            ctx.moveTo(p.x - w/2 + ox, p.y - h/2 + oy);
            ctx.lineTo(p.x - w/2 + w + ox, p.y - h/2 + oy);
            ctx.lineTo(p.x - w/2 + w + ox, p.y - h/2 + h + oy);
            ctx.lineTo(p.x - w/2 + ox, p.y - h/2 + h + oy);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

        },

        drawHull: function (hull, offset) {
            ctx.beginPath();
            if (hull.length === 6) {
                ctx.moveTo(hull[0].x, hull[0].y);
                ctx.lineTo(hull[1].x, hull[1].y);
                ctx.lineTo(hull[2].x, hull[2].y);
                ctx.moveTo(hull[3].x, hull[3].y);
                ctx.lineTo(hull[4].x, hull[4].y);
            } else {
                ctx.moveTo(hull[0].x, hull[0].y);
                ctx.lineTo(hull[1].x, hull[1].y);
                ctx.lineTo(hull[2].x, hull[2].y);
                ctx.lineTo(hull[3].x, hull[3].y);
                ctx.moveTo(hull[4].x, hull[4].y);
                ctx.lineTo(hull[5].x, hull[5].y);
                ctx.lineTo(hull[6].x, hull[6].y);
                ctx.moveTo(hull[7].x, hull[7].y);
                ctx.lineTo(hull[8].x, hull[8].y);
            }
            ctx.stroke();
        },

        drawShape: function (shape, offset) {
            offset = offset || {x: 0, y: 0};
            var order = shape.forward.points.length - 1;
            ctx.beginPath();
            ctx.moveTo(offset.x + shape.startcap.points[0].x, offset.y + shape.startcap.points[0].y);
            ctx.lineTo(offset.x + shape.startcap.points[3].x, offset.y + shape.startcap.points[3].y);
            if (order === 3) {
                ctx.bezierCurveTo(
                    offset.x + shape.forward.points[1].x, offset.y + shape.forward.points[1].y,
                    offset.x + shape.forward.points[2].x, offset.y + shape.forward.points[2].y,
                    offset.x + shape.forward.points[3].x, offset.y + shape.forward.points[3].y
                );
            } else {
                ctx.quadraticCurveTo(
                    offset.x + shape.forward.points[1].x, offset.y + shape.forward.points[1].y,
                    offset.x + shape.forward.points[2].x, offset.y + shape.forward.points[2].y
                );
            }
            ctx.lineTo(offset.x + shape.endcap.points[3].x, offset.y + shape.endcap.points[3].y);
            if (order === 3) {
                ctx.bezierCurveTo(
                    offset.x + shape.back.points[1].x, offset.y + shape.back.points[1].y,
                    offset.x + shape.back.points[2].x, offset.y + shape.back.points[2].y,
                    offset.x + shape.back.points[3].x, offset.y + shape.back.points[3].y
                );
            } else {
                ctx.quadraticCurveTo(
                    offset.x + shape.back.points[1].x, offset.y + shape.back.points[1].y,
                    offset.x + shape.back.points[2].x, offset.y + shape.back.points[2].y
                );
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        },

        drawText: function (text, offset) {
            offset = offset || {x: 0, y: 0};
            ctx.fillText(text, offset.x, offset.y);
        }
    };
}


export function handleInteraction(cvs, curve, offset?) {
    offset = offset || {x: 0, y: 0};
    var Ox = offset.x;
    var Oy = offset.y;

    curve.mouse = false;

    var fix = function (e) {
        // e = e || window.event;
        // var target = e.target || e.srcElement,
        //     rect = target.getBoundingClientRect();
        // e.offsetX = e.clientX - rect.left;
        // e.offsetY = e.clientY - rect.top;
    };

    var lpts = curve.points;
    var moving = false, mx = 0, my = 0, ox = 0, oy = 0, cx, cy, mp = null;

    var handler = {
        onupdate: function (evt?) {
        }
    };

    cvs.addEventListener("mousedown", function (evt) {
        document.addEventListener("mouseup", upHandler);
        fix(evt);
        mx = evt.offsetX - Ox;
        my = evt.offsetY - Oy;
        lpts.forEach(function (p) {
            if (Math.abs(mx - p.x) < 10 && Math.abs(my - p.y) < 10) {
                moving = true;
                mp = p;
                cx = p.x;
                cy = p.y;
            }
        });
    });

    cvs.addEventListener("mousemove", function (evt) {

        fix(evt);

        var found = false;

        if (!lpts) return;
        lpts.forEach(function (p) {
            var mx = evt.offsetX - Ox;
            var my = evt.offsetY - Oy;
            if (Math.abs(mx - p.x) < 10 && Math.abs(my - p.y) < 10) {
                found = found || true;
            }
        });
        cvs.style.cursor = found ? "pointer" : "default";

        if (!moving) {
            return //handler.onupdate(evt);
        }

        ox = evt.offsetX - mx - Ox;
        oy = evt.offsetY - my - Oy;
        mp.x = cx + ox;
        mp.y = cy + oy;
        curve.update();
        handler.onupdate();
    });

    const upHandler = function (evt) {
        document.removeEventListener("mouseup", upHandler);
        if (!moving) return;
        // console.log(curve.points.map(function(p) { return p.x+", "+p.y; }).join(", "));
        moving = false;
        mp = false;
    };

    cvs.addEventListener("click", function (evt) {
        fix(evt);
        var mx = evt.offsetX;
        var my = evt.offsetY;
    });

    return handler;
}