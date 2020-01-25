import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {Canvas, CanvasProps} from "../_shared/Canvas";
import "../../styles/mask.scss";
import {BrushState} from "../../store/brush/reducer";
import {LineState} from "../../store/line/reducer";
import {EToolType} from "../../store/tool/types";
import {startDrawChanging, stopDrawChanging} from "../../store/changing/actions";
import get from "lodash/get";
import {ELineCompositeOperation, ELineType} from "../../store/line/types";
import {EBrushType} from "../../store/brush/types";
import {MaskParams} from "../../store/patterns/types";
import {ButtonNumberCF} from "../_shared/ButtonNumberCF";
import {ButtonSelect} from "../_shared/ButtonSelect";
import {RotationValue} from "../../store/patterns/types";
import {Draw} from "./Draw";

export interface MaskDrawStateProps {
    brush: BrushState
    line: LineState
    tool: EToolType
}

export interface MaskDrawActionProps {
    startChanging()

    stopChanging()
}

export interface MaskDrawOwnProps extends CanvasProps {
    params?: MaskParams
    name: any

    onParamsChange(params: MaskParams)
}

export interface MaskDrawProps extends MaskDrawStateProps, MaskDrawActionProps, MaskDrawOwnProps {

}

export interface MaskDrawState {
    style?: any
    rotation?: RotationValue

}

const opacityRange = [0, 1] as [number, number];

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

const BLACK = "black";

enum ECompositeOperation {
    sourceOver = "source-over",
    destinationOver = "destination-over",
    destinationOut = "destination-out",
}

const getStyle = (rotation) => rotation ? {
    transform: `rotate(${rotation.angle}deg) translateY(${-rotation.offset.y}px) translateX(${rotation.offset.x}px)`,
} : null;

class MaskDrawComponent extends React.PureComponent<MaskDrawProps, MaskDrawState> {

    constructor(props) {
        super(props);
        this.state = {
            style: getStyle(props.rotation),
            rotation: props.rotation
        };
    }


    static getDerivedStateFromProps(props, state) {
        // if (state.rotation !== props.rotation) {
        return {
            rotation: props.rotation,
            style: getStyle(props.rotation)
        }
        // }
    }

    handlers = {
        [EToolType.Brush]: {
            [EBrushType.Square]: {
                draw: (ev) => {
                    const {ctx, e} = ev;
                    const {black, opacity} = this.props.params;
                    const {size} = this.props.brush.params;

                    ctx.fillStyle = BLACK;
                    ctx.globalAlpha = opacity;
                    ctx.globalCompositeOperation = black
                        ? ECompositeOperation.destinationOver
                        : ECompositeOperation.destinationOut;

                    ctx.fillRect(e.offsetX - size / 2, e.offsetY - size / 2, size, size);


                    ctx.globalCompositeOperation = ECompositeOperation.sourceOver;
                    ctx.globalAlpha = 1;
                },
                click: (ev) => {
                    const {ctx, e} = ev;
                    const {black, opacity} = this.props.params;
                    const {size} = this.props.brush.params;

                    ctx.fillStyle = BLACK;
                    ctx.globalAlpha = opacity;
                    ctx.globalCompositeOperation = black
                        ? ECompositeOperation.destinationOver
                        : ECompositeOperation.destinationOut;

                    ctx.fillRect(e.offsetX - size / 2, e.offsetY - size / 2, size, size);


                    ctx.globalCompositeOperation = ECompositeOperation.sourceOver;
                    ctx.globalAlpha = 1;
                }
            },
            [EBrushType.Circle]: {
                draw: (ev) => {
                    const {ctx, e} = ev;
                    const {black, opacity} = this.props.params;
                    const {size} = this.props.brush.params;

                    ctx.fillStyle = BLACK;
                    ctx.globalAlpha = opacity;
                    ctx.globalCompositeOperation = black
                        ? ECompositeOperation.destinationOver
                        : ECompositeOperation.destinationOut;

                    ctx.beginPath();
                    ctx.arc(e.offsetX, e.offsetY, size / 2, 0, 2 * Math.PI);
                    ctx.fill();

                    ctx.globalCompositeOperation = ECompositeOperation.sourceOver;
                    ctx.globalAlpha = 1;
                },
                click: (ev) => {
                    const {ctx, e} = ev;
                    const {size} = this.props.brush.params;

                    const {black, opacity} = this.props.params;
                    ctx.fillStyle = BLACK;
                    ctx.globalAlpha = opacity;
                    ctx.globalCompositeOperation = black
                        ? ECompositeOperation.destinationOver
                        : ECompositeOperation.destinationOut;

                    ctx.beginPath();
                    ctx.arc(e.offsetX, e.offsetY, size / 2, 0, 2 * Math.PI);
                    ctx.fill();

                    ctx.globalCompositeOperation = ECompositeOperation.sourceOver;
                    ctx.globalAlpha = 1;
                }
            },
        },
        [EToolType.Line]: {
            [ELineType.Default]: {
                click: (ev) => {
                    const {ctx, e} = ev;
                    const {size} = this.props.line.params;

                    const {black, opacity} = this.props.params;
                    ctx.globalAlpha = opacity;
                    ctx.globalCompositeOperation = black
                        ? ECompositeOperation.destinationOver
                        : ECompositeOperation.destinationOut;
                    ctx.strokeStyle = BLACK;

                    ctx.beginPath();
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
                    const {size} = this.props.line.params;

                    const {black, opacity} = this.props.params;
                    ctx.strokeStyle = BLACK;
                    ctx.globalAlpha = opacity;
                    ctx.globalCompositeOperation = black
                        ? ECompositeOperation.destinationOver
                        : ECompositeOperation.destinationOut;

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
                    const {size} = this.props.line.params;

                    const {black, opacity} = this.props.params;
                    ctx.strokeStyle = BLACK;
                    ctx.globalAlpha = opacity;
                    ctx.globalCompositeOperation = black
                        ? ECompositeOperation.destinationOver
                        : ECompositeOperation.destinationOut;

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

    handleOpacityChange = ({value}) =>
        this.props.onParamsChange({["opacity"]: value});

    handleBlackChange = (data) =>
        this.props.onParamsChange({["black"]: !data.selected});

    render() {

        const {tool, startChanging, stopChanging, params, name} = this.props;

        const getType = getTypeField[tool];
        const type = getType ? getType(this.props) : 0;
        const handlersByTool = this.handlers[tool];
        const handlers = handlersByTool && handlersByTool[type];

        return (
            <>
                <div>
                    <ButtonNumberCF
                        path={`patterns.${name}.mask.params.opacity`}
                        name={"opacity"}
                        range={opacityRange}
                        value={params.opacity}
                        onChange={this.handleOpacityChange}/>
                    <div>
                        <ButtonSelect
                            name={"black"}
                            selected={params.black}
                            onClick={this.handleBlackChange}/>
                    </div>
                </div>
                <Canvas
                    style={this.state.style}
                    className={"maskCanvas"}
                    onDown={startChanging}
                    onUp={stopChanging}
                    onDraw={handlers && handlers.draw}
                    onClick={handlers && handlers.click}
                    releaseProcess={handlers && handlers.release}
                    {...this.props}/>
            </>
        );
    }
}

const getTypeField = {
    [EToolType.Line]: props => get(props, "line.params.type"),
    [EToolType.Brush]: props => get(props, "brush.params.type"),
};

const mapStateToProps: MapStateToProps<MaskDrawStateProps, MaskDrawOwnProps, AppState> = state => ({
    brush: state.brush,
    line: state.line,
    tool: state.tool.current
});

const mapDispatchToProps: MapDispatchToProps<MaskDrawActionProps, MaskDrawOwnProps> = {
    startChanging: startDrawChanging, stopChanging: stopDrawChanging
};

export const MaskDraw = connect<MaskDrawStateProps, MaskDrawActionProps, MaskDrawOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(MaskDrawComponent);