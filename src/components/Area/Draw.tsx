import * as React from "react";
import {Canvas, CanvasProps} from "../_shared/Canvas";
import {circle} from "../../utils/canvas";
import {AppState} from "../../store/index";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {BrushState} from "../../store/brush/reducer";
import {EToolType} from "../../store/tool/types";
import {EBrushType} from "../../store/brush/types";
import {LineState} from "../../store/line/reducer";
import get from "lodash/get";
import {ELineType} from "../../store/line/types";
import {ELineCompositeOperation} from "../../store/line/types";
import {startChanging, stopChanging} from "../../store/changeFunctions/actions";

export interface CanvasDrawStateProps {
    brush: BrushState
    line: LineState
    tool: EToolType
}

export interface CanvasDrawActionProps {
    startChanging()
    stopChanging()
}

export interface CanvasDrawOwnProps extends CanvasProps {
}

export interface CanvasDrawProps extends CanvasDrawStateProps, CanvasDrawActionProps, CanvasDrawOwnProps {
}

export interface CanvasDrawState {
}

const brush = ({e, pre, ctx, canvas}, {size, opacity, type, compositeOperation}) => {
    ctx.fillStyle = getRandomColor();//"black";
    ctx.globalAlpha = opacity;
    ctx.globalCompositeOperation = compositeOperation;

    if (type === EBrushType.Square) {
        ctx.fillRect(e.offsetX - size / 2, e.offsetY - size / 2, size, size);
    } else if (type === EBrushType.Circle) {
        ctx.beginPath();
        ctx.arc(e.offsetX, e.offsetY, size / 2, 0, 2 * Math.PI);
        ctx.fill();
    }
    // else if (this.state.brush.type === EBrushType.Pattern && this.state.patterns[this.state.currentPattern]) {
    //     const p = this.state.patterns[this.state.currentPattern].image;
    //     const i = this.state.patterns[this.state.currentPattern].imageMasked;
    //     ctx.drawImage(i, e.offsetX - p.width / 2, e.offsetY - p.height / 2, p.width, p.height);
    // }

    ctx.globalCompositeOperation = ELineCompositeOperation.SourceOver;
    ctx.globalAlpha = 1;
};

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

class CanvasDrawComponent extends React.PureComponent<CanvasDrawProps, CanvasDrawState> {

    handlers = {
        [EToolType.Brush]: {
            0: ({
                draw: (e) => {
                    brush(e, this.props.brush.params);
                },
                click: (e) => {
                    brush(e, this.props.brush.params);
                }
            })
        },
        [EToolType.Line]: {
            [ELineType.Default]: {
                click: (ev) => {
                    const {ctx, e} = ev;
                    const {size, opacity, compositeOperation} = this.props.line.params;


                    ctx.beginPath();
                    ctx.globalCompositeOperation = compositeOperation;
                    ctx.globalAlpha = opacity;
                    ctx.strokeStyle = getRandomColor();
                    ctx.lineWidth = size;

                    ctx.moveTo(e.offsetX, e.offsetY);

                },
                draw: (ev) => {
                    const {ctx, e} = ev;
                    const {size, opacity} = this.props.line.params;
                    ctx.lineTo(e.offsetX, e.offsetY);
                    // ctx.strokeStyle = getRandomColor();
                    ctx.stroke();
                },
                release: e => {

                    e.ctx.globalCompositeOperation = ELineCompositeOperation.SourceOver;
                    e.ctx.globalAlpha = 1;
                    e.ctx.closePath();
                }
            },
            [ELineType.Interrupted]: {
                click: (ev) => {
                    const {ctx, e} = ev;
                    const {size, opacity, compositeOperation} = this.props.line.params;


                    ctx.globalCompositeOperation = compositeOperation;
                    ctx.globalAlpha = opacity;
                    ctx.strokeStyle = getRandomColor();//"green";
                    ctx.lineWidth = size;

                    // ctx.moveTo(e.offsetX, e.offsetY);
                    ctx.beginPath();

                },
                draw: (ev) => {
                    const {ctx, e, pre} = ev;
                    const {size, opacity} = this.props.line.params;

                    if (!pre) return;

                    ctx.moveTo(pre.offsetX, pre.offsetY);

                    ctx.lineTo(e.offsetX, e.offsetY);

                    ctx.stroke();
                },
                release: e => {

                    e.ctx.globalCompositeOperation = ELineCompositeOperation.SourceOver;
                    e.ctx.globalAlpha = 1;
                    e.ctx.closePath();
                }
            },
            [ELineType.InterruptedOneStroke]: {
                click: (ev) => {
                    const {ctx, e} = ev;
                    const {size, opacity, compositeOperation} = this.props.line.params;

                    ctx.globalCompositeOperation = compositeOperation;

                    ctx.globalAlpha = opacity;
                    ctx.strokeStyle = getRandomColor();//"green";
                    ctx.lineWidth = size;

                    // ctx.moveTo(e.offsetX, e.offsetY);

                },
                draw: (ev) => {
                    const {ctx, e, pre} = ev;
                    const {size, opacity} = this.props.line.params;

                    if (!pre) return;//"green";

                    ctx.beginPath();
                    ctx.moveTo(pre.offsetX, pre.offsetY);

                    ctx.lineTo(e.offsetX, e.offsetY);

                    ctx.stroke();
                    ctx.closePath();
                },
                release: e => {

                    e.ctx.globalCompositeOperation = ELineCompositeOperation.SourceOver;
                    e.ctx.globalAlpha = 1;
                }
            }
        },
    };

    render() {
        const {tool, startChanging, stopChanging} = this.props;

        const getType = getTypeField[tool];
        const type = getType ? getType(this.props) : 0;
        const handlersByTool = this.handlers[tool];
        const handlers = handlersByTool && handlersByTool[type];
        console.log(handlers);
        return (
            <Canvas
                onDown={startChanging}
                onUp={stopChanging}
                drawProcess={handlers && handlers.draw}
                clickProcess={handlers && handlers.click}
                releaseProcess={handlers && handlers.release}
                {...this.props}/>
        );
    }
}

const getTypeField = {
    [EToolType.Line]: props => get(props, "line.params.type"),
    // [EToolType.Brush]: props => 0,
};

const mapStateToProps: MapStateToProps<CanvasDrawStateProps, CanvasDrawOwnProps, AppState> = state => ({
    brush: state.brush,
    line: state.line,
    tool: state.tool.current
});

const mapDispatchToProps: MapDispatchToProps<CanvasDrawActionProps, CanvasDrawOwnProps> = {
    startChanging, stopChanging
};

export const Draw = connect<CanvasDrawStateProps, CanvasDrawActionProps, CanvasDrawOwnProps, AppState>(
    mapStateToProps, mapDispatchToProps
)(CanvasDrawComponent);