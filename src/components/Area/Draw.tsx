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
import {drawWithMask, imageDataToCanvas} from "../../utils/canvas/imageData";

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


                    getRepeatingCoords(e.offsetX, e.offsetY, pattern).forEach(({x, y}) =>
                        ctx.fillRect(x - size / 2, y - size / 2, size, size));


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


                    getRepeatingCoords(e.offsetX, e.offsetY, pattern).forEach(({x, y}) => {
                        ctx.beginPath();
                        ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
                        ctx.fill();
                    });


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
                    const {ctx, e} = ev;
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


                        const dr0 = ({x, y}) => {
                            if (rotation) {
                                ctx.translate(x + rotation.offset.x, y + rotation.offset.y);
                                ctx.rotate(Math.PI * rotation.angle / 180);
                            } else {
                                ctx.translate(x, y);
                            }


                            const width = patternSize * brushPatternImage.width;
                            const height = patternSize * brushPatternImage.height;


                            // if (destinationPattern.mask && destinationPattern.mask.value.imageData) {
                            //     // ctx.globalCompositeOperation = 'destination-in';
                            //     ctx.putImageData(destinationPattern.mask.value.imageData, 0, 0);
                            //     ctx.globalCompositeOperation = "source-in";
                            // }
                            //const i = patterns[pattern].imageMasked;
                            ctx.drawImage(
                                drawWithMask(
                                    destinationPattern.mask && destinationPattern.mask.value.imageData,
                                    rotation
                                )(x, y, brushPatternImage, -width / 2, -height / 2, width, height),
                                0, 0);


                            if (rotation) {
                                ctx.rotate(-Math.PI * rotation.angle / 180);
                                ctx.translate(-x - rotation.offset.x, -y - rotation.offset.y);
                                // ctx.translate(-e.offsetX - rotation.offset.x, -e.offsetY - rotation.offset.y);
                            } else {
                                ctx.translate(-x, -y);
                            }

                        };
                        const dr = ({x, y}) => {
                            if (rotation) {
                                // ctx.translate(x + rotation.offset.x, y + rotation.offset.y);
                                // ctx.rotate(Math.PI * rotation.angle / 180);
                            } else {
                                // ctx.translate(x, y);
                            }


                            const width = patternSize * brushPatternImage.width;
                            const height = patternSize * brushPatternImage.height;


                            // if (destinationPattern.mask && destinationPattern.mask.value.imageData) {
                            //     // ctx.globalCompositeOperation = 'destination-in';
                            //     ctx.putImageData(destinationPattern.mask.value.imageData, 0, 0);
                            //     ctx.globalCompositeOperation = "source-in";
                            // }
                            //const i = patterns[pattern].imageMasked;


                            if (destinationPattern.selection && destinationPattern.selection.params.mask) {
                                const img = drawWithMask(
                                    destinationPattern.selection && destinationPattern.selection.params.mask,
                                    rotation
                                    )(x, y,brushPatternImage, - width / 2, - height / 2, width, height);

                                ctx.globalCompositeOperation = compositeOperation;

                                ctx.drawImage(img, 0, 0);
                            } else {

                                if (rotation) {
                                    ctx.translate(x + rotation.offset.x, y + rotation.offset.y);
                                    ctx.rotate(Math.PI * rotation.angle / 180);
                                } else {
                                    ctx.translate(x, y);
                                }

                                ctx.globalCompositeOperation = compositeOperation;

                                ctx.drawImage(brushPatternImage, - width / 2, - height / 2, width, height);

                                if (rotation) {
                                    ctx.rotate(-Math.PI * rotation.angle / 180);
                                    ctx.translate(-x - rotation.offset.x, -y - rotation.offset.y);
                                } else {
                                    ctx.translate(-x, -y);
                                }
                            }



                            if (rotation) {
                                // ctx.rotate(-Math.PI * rotation.angle / 180);
                                // ctx.translate(-x - rotation.offset.x, -y - rotation.offset.y);
                                // ctx.translate(-e.offsetX - rotation.offset.x, -e.offsetY - rotation.offset.y);
                            } else {
                                // ctx.translate(-x, -y);
                            }

                        };

                        getRepeatingCoords(e.offsetX, e.offsetY, destinationPattern).forEach(dr);
                        // dr({x:e.offsetX, y: e.offsetY});


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
                    ctx.lineWidth = size;
                    ctx.globalAlpha = opacity;

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
    [EToolType.Brush]: props => get(props, "brush.params.type"),
};

const mapStateToProps: MapStateToProps<CanvasDrawStateProps, CanvasDrawOwnProps, AppState> = state => ({
    brush: state.brush,
    line: state.line,
    tool: state.tool.current,
    patterns: state.patterns
});

const mapDispatchToProps: MapDispatchToProps<CanvasDrawActionProps, CanvasDrawOwnProps> = {
    startChanging: startDrawChanging, stopChanging: stopDrawChanging
};

export const Draw = connect<CanvasDrawStateProps, CanvasDrawActionProps, CanvasDrawOwnProps, AppState>(
    mapStateToProps, mapDispatchToProps
)(CanvasDrawComponent);