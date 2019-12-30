import * as React from "react";
import {Canvas, CanvasProps} from "../_shared/Canvas";
import {circle} from "../../utils/canvas/canvas";
import {AppState} from "../../store";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {BrushState} from "../../store/brush/reducer";
import {EToolType} from "../../store/tool/types";
import {EBrushCompositeOperation, EBrushType} from "../../store/brush/types";
import {LineState} from "../../store/line/reducer";
import get from "lodash/get";
import {ELineType} from "../../store/line/types";
import {ELineCompositeOperation} from "../../store/line/types";
import {startDrawChanging, stopDrawChanging} from "../../store/changing/actions";
import {PatternsState} from "../../store/patterns/reducer";
import {getRepeatingCoords} from "../../utils/draw";
import {
    drawMasked, drawMaskedWithPosition,
    drawMaskedWithPositionAndRotation,
    drawWithMask,
    drawWithPositionAndRotation,
    imageDataToCanvas
} from "../../utils/canvas/imageData";
import {position, setPosition} from "./canvasPosition.servise";
import {SVG} from "../_shared/SVG";
import classNames from "classnames";
import '../../styles/draw.scss';

export interface CanvasDrawStateProps {
    brush: BrushState
    line: LineState
    tool: EToolType
    patterns: PatternsState
}

export interface CanvasDrawActionProps {
    startChanging()

    stopChanging()
}

export interface CanvasDrawOwnProps extends CanvasProps {
    patternId: string
}

export interface CanvasDrawProps extends CanvasDrawStateProps, CanvasDrawActionProps, CanvasDrawOwnProps {
}

export interface CanvasDrawState {
    coords
}

function getRandomColor() {
    // return "black";
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

class CanvasDrawComponent extends React.PureComponent<CanvasDrawProps, CanvasDrawState> {

    state = {
        coords: []
    };
    handlers = {
        [EToolType.Brush]: {
            [EBrushType.Square]: (() => {
                const squareBrush = (ev) => {
                    const {ctx, e} = ev;
                    const {patterns, patternId} = this.props;
                    const pattern = patterns[patternId];
                    const {size, opacity, compositeOperation} = this.props.brush.params;

                    ctx.fillStyle = getRandomColor();
                    ctx.globalAlpha = opacity;
                    ctx.globalCompositeOperation = compositeOperation;

                    const selectionMask = pattern.selection && pattern.selection.value.mask;
                    if (selectionMask) {

                        getRepeatingCoords(e.offsetX, e.offsetY, pattern).forEach(({x, y}) => {
                            const {canvas: image} = drawMasked(selectionMask, ({context}) => {
                                context.fillStyle = ctx.fillStyle;
                                context.fillRect(x - size / 2, y - size / 2, size, size);
                            });
                            ctx.globalCompositeOperation = compositeOperation;
                            ctx.drawImage(image, 0, 0);
                        });


                    } else {
                        getRepeatingCoords(e.offsetX, e.offsetY, pattern).forEach(({x, y, scale}) => {
                            const sizeX = size / scale.x;// > 0.05 ? size * 1 / scale.x : 0;
                            const sizeY = size / scale.y;// > 0.05 ? size * 1 / scale.y : 0;
                            ctx.fillRect(x - sizeX / 2, y - sizeY / 2, sizeX, sizeY);
                        });
                    }


                    ctx.globalCompositeOperation = EBrushCompositeOperation.SourceOver;
                    ctx.globalAlpha = 1;
                };
                return {
                    draw: squareBrush,
                    click: squareBrush
                }
            })(),
            [EBrushType.Circle]: (() => {
                const circleBrush = (ev) => {
                    const {ctx, e} = ev;
                    const {patterns, patternId} = this.props;
                    const pattern = patterns[patternId];
                    const {size, opacity, compositeOperation} = this.props.brush.params;

                    ctx.fillStyle = getRandomColor();
                    ctx.globalAlpha = opacity;
                    ctx.globalCompositeOperation = compositeOperation;

                    const selectionMask = pattern.selection && pattern.selection.value.mask;
                    if (selectionMask) {

                        getRepeatingCoords(e.offsetX, e.offsetY, pattern).forEach(({x, y}) => {
                            const {canvas: image} = drawMasked(selectionMask, ({context}) => {
                                context.fillStyle = ctx.fillStyle;
                                circle(context, x, y, size / 2);
                            });
                            ctx.globalCompositeOperation = compositeOperation;
                            ctx.drawImage(image, 0, 0);
                        });


                    } else {

                        getRepeatingCoords(e.offsetX, e.offsetY, pattern).forEach(({x, y}) => {
                            circle(ctx, x, y, size / 2);
                        });


                    }
                    ctx.globalCompositeOperation = EBrushCompositeOperation.SourceOver;
                    ctx.globalAlpha = 1;
                };
                return {
                    draw: circleBrush,
                    click: circleBrush
                }
            })(),
            [EBrushType.Pattern]: (() => {
                const patternBrush = (ev) => {
                    const {ctx, e, canvas} = ev;
                    const {patterns, patternId} = this.props;
                    const {patternSize, opacity, compositeOperation, pattern} = this.props.brush.params;

                    ctx.fillStyle = getRandomColor();
                    ctx.globalAlpha = opacity;
                    ctx.globalCompositeOperation = compositeOperation;
                    ctx.imageSmoothingEnabled = true;

                    const destinationPattern = patterns[patternId];
                    const brushPattern = patterns[pattern];

                    const rotation = brushPattern && brushPattern.rotation && brushPattern.rotation.value;

                    const brushPatternImage = brushPattern && brushPattern.resultImage;

                    if (brushPatternImage) {


                        const dr = ({x, y}) => {

                            const width = patternSize * brushPatternImage.width;
                            const height = patternSize * brushPatternImage.height;


                            const selectionMask = destinationPattern.selection && destinationPattern.selection.value.mask;

                            if (selectionMask) {
                                const {canvas: image} = drawMaskedWithPositionAndRotation(
                                    selectionMask,
                                    rotation,
                                    x, y,
                                    ({context}) =>
                                        context.drawImage(brushPatternImage, -width / 2, -height / 2, width, height)
                                );

                                ctx.globalCompositeOperation = compositeOperation;
                                ctx.drawImage(image, 0, 0);
                            } else {

                                drawWithPositionAndRotation(
                                    rotation,
                                    x, y,
                                    ({context}) =>
                                        context.drawImage(brushPatternImage, -width / 2, -height / 2, width, height)
                                )({context: ctx, canvas})
                            }


                        };

                        getRepeatingCoords(e.offsetX, e.offsetY, destinationPattern).forEach(dr);
                    }
                    ctx.globalCompositeOperation = EBrushCompositeOperation.SourceOver;
                    ctx.globalAlpha = 1;
                };
                return {
                    draw: patternBrush,
                    click: patternBrush
                }
            })(),
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

                    ctx.lineWidth = size;
                    ctx.globalAlpha = opacity;
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


                    ctx.beginPath();
                    ctx.globalCompositeOperation = compositeOperation;
                    ctx.globalAlpha = opacity;
                    ctx.strokeStyle = getRandomColor();//"green";
                    ctx.lineWidth = size;

                    // ctx.moveTo(e.offsetX, e.offsetY);

                },
                draw: (ev) => {
                    const {ctx, e, pre} = ev;
                    const {size, opacity} = this.props.line.params;

                    if (!pre) return;
                    ctx.lineWidth = size;
                    ctx.globalAlpha = opacity;

                    console.log(pre === e, ev);
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

                    ctx.lineWidth = size;
                    ctx.globalAlpha = opacity;
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

    componentDidUpdate(prevProps: CanvasDrawProps) {
        const {patternId} = this.props;
        if (prevProps.patterns[patternId].selection.params.mask) {

        }

    }

    moveHandler = ({e}) => {
        this.setState({coords: getRepeatingCoords(e.offsetX, e.offsetY, this.props.patterns[this.props.patternId])});
        setPosition(e.offsetX, e.offsetY, this.props.patternId);
        console.log(position);
    };

    leaveHandler = () => {
        this.props.onLeave && this.props.onLeave();

        this.setState({coords: []})
    };

    //todo рефакторинг
    // хендлеры событий вынести в методы класса
    // 

    render() {
        const {tool, startChanging, stopChanging, children, width, height, className} = this.props;

        const getType = getTypeField[tool];
        const type = getType ? getType(this.props) : 0;
        const handlersByTool = this.handlers[tool];
        const handlers = handlersByTool && handlersByTool[type];
        console.log(handlers);
        return (
            <Canvas
                className={classNames("draw", className)}
                onDown={startChanging}
                onUp={stopChanging}
                moveProcess={this.moveHandler}
                drawProcess={handlers && handlers.draw}
                clickProcess={handlers && handlers.click}
                releaseProcess={handlers && handlers.release}
                width={width}
                height={height}
                onLeave={this.leaveHandler}
                {...this.props}>
                <SVG
                    className={"draw-cursors"}
                    width={width}
                    height={height}>
                    {this.state.coords.map(({x, y}) =>
                        <rect x={x} y={y} width={2} height={2} fill="black" fillOpacity={1}/>)}
                </SVG>
                {children}
            </Canvas>
        );
    }
}

const getTypeField = {
    [EToolType.Line]: props => get(props, "line.params.type"),
    [EToolType.Brush]: props => get(props, "brush.params.type"),
};

const mapStateToProps: MapStateToProps<CanvasDrawStateProps, CanvasDrawOwnProps, AppState> = state => ({
    brush: state.brush,
    line: state.line,
    tool: state.tool.current,
    patterns: state.patterns //todo придуматть как оптимизировать тут
});

const mapDispatchToProps: MapDispatchToProps<CanvasDrawActionProps, CanvasDrawOwnProps> = {
    startChanging: startDrawChanging, stopChanging: stopDrawChanging
};

export const Draw = connect<CanvasDrawStateProps, CanvasDrawActionProps, CanvasDrawOwnProps, AppState>(
    mapStateToProps, mapDispatchToProps
)(CanvasDrawComponent);