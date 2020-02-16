import * as React from "react";
import {Canvas, CanvasEvent, CanvasProps} from "../_shared/Canvas";
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
import {getRepeatingCoords} from "../../utils/draw";
import {setPosition} from "./canvasPosition.servise";
import {SVG} from "../_shared/SVG";
import classNames from "classnames";
import '../../styles/draw.scss';
import {
    drawMaskedWithRotation,
    drawWithRotation
} from "../../utils/canvas/helpers/draw";
import {PatternsState} from "../../store/patterns/types";
import {circle} from "../../utils/canvas/helpers/geometry";

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
    mask?: boolean
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
                    const {ctx, e, canvas, rotation} = ev;
                    console.log(ev);
                    const {patterns, patternId} = this.props;
                    const pattern = patterns[patternId];
                    const {size, opacity, compositeOperation} = this.props.brush.params;

                    ctx.fillStyle = getRandomColor();
                    ctx.globalAlpha = opacity;
                    ctx.globalCompositeOperation = compositeOperation;
                    const angle = rotation ? rotation.angle : 0;

                    const selectionMask = pattern.selection && pattern.selection.value.mask;
                    if (selectionMask) {

                        getRepeatingCoords(e.offsetX, e.offsetY, pattern).forEach(({x, y}) => {

                            const {canvas: image} = drawMaskedWithRotation(
                                selectionMask,
                                -angle,
                                x, y,
                                ({context}) => {

                                    context.fillStyle = ctx.fillStyle;
                                    context.fillRect(-size / 2, -size / 2, size, size)
                                }
                            );

                            ctx.globalCompositeOperation = compositeOperation;
                            ctx.drawImage(image, 0, 0);
                        });


                    } else {
                        getRepeatingCoords(e.offsetX, e.offsetY, pattern).forEach(({x, y}) => {
                            drawWithRotation(
                                -angle,
                                x, y,
                                ({context}) => {
                                    context.fillRect(-size / 2, -size / 2, size, size)
                                },
                            )({context: ctx, canvas});
                        });
                    }


                    ctx.globalCompositeOperation = EBrushCompositeOperation.SourceOver;
                    ctx.globalAlpha = 1;
                };
                return {
                    draw: squareBrush,
                    click: squareBrush,
                    cursors: ({x, y, outer}) => {

                        let width = this.props.brush.params.size;
                        let height = this.props.brush.params.size;

                        const {rotation} = this.props;
                        return x - width / 2 ? (
                            <rect
                                transform={`rotate(${-(rotation ? rotation.angle : 0)} ${x} ${y})`}
                                x={x - width / 2}
                                y={y - height / 2}
                                width={width}
                                height={height}
                                stroke={"black"} fill="purple"
                                fillOpacity="0" strokeOpacity={outer ? "0.3" : "0.7"}/>
                        ) : null;
                    }
                }
            })(),
            [EBrushType.Circle]: (() => {
                const circleBrush = (ev) => {
                    const {ctx, e, canvas, rotation} = ev;
                    const {patterns, patternId} = this.props;
                    const pattern = patterns[patternId];
                    const {size, opacity, compositeOperation} = this.props.brush.params;

                    ctx.fillStyle = getRandomColor();
                    ctx.globalAlpha = opacity;
                    ctx.globalCompositeOperation = compositeOperation;

                    const angle = rotation ? rotation.angle : 0;

                    const selectionMask = pattern.selection && pattern.selection.value.mask;
                    if (selectionMask) {

                        getRepeatingCoords(e.offsetX, e.offsetY, pattern).forEach(({x, y}) => {

                            const {canvas: image} = drawMaskedWithRotation(
                                selectionMask,
                                -angle,
                                x, y,
                                ({context}) => {
                                    context.fillStyle = ctx.fillStyle;
                                    circle(context, 0, 0, size / 2);
                                },
                            );

                            ctx.globalCompositeOperation = compositeOperation;
                            ctx.drawImage(image, 0, 0);
                        });

                    } else {

                        getRepeatingCoords(e.offsetX, e.offsetY, pattern).forEach(({x, y}) => {
                            drawWithRotation(
                                -angle,
                                x, y,
                                ({context}) => {
                                    circle(context, 0, 0, size / 2);
                                }
                            )({context: ctx, canvas});
                        });
                    }

                    ctx.globalCompositeOperation = EBrushCompositeOperation.SourceOver;
                    ctx.globalAlpha = 1;
                };
                return {
                    draw: circleBrush,
                    click: circleBrush,
                    cursors: ({x, y, outer}) => {

                        return (
                            <circle
                                cx={x}
                                cy={y}
                                r={this.props.brush.params.size / 2}
                                stroke={"black"} fill="purple"
                                fillOpacity="0" strokeOpacity={outer ? "0.3" : "0.7"}/>
                        )
                    }
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

                    const brushRotation = brushPattern && brushPattern.rotation && brushPattern.rotation.value;
                    const destinationRotation = destinationPattern && destinationPattern.rotation && destinationPattern.rotation.value;

                    const brushPatternImage = brushPattern && brushPattern.resultImage;

                    if (brushPatternImage) {


                        const dr = ({x, y}) => {

                            const width = patternSize * brushPatternImage.width;
                            const height = patternSize * brushPatternImage.height;


                            const selectionMask = destinationPattern.selection && destinationPattern.selection.value.mask;

                            if (selectionMask) {
                                const {canvas: image} = drawMaskedWithRotation(
                                    selectionMask,
                                    -destinationRotation.angle + brushRotation.angle,
                                    x + brushRotation.offset.x, y + brushRotation.offset.y,
                                    ({context}) => {
                                        context.drawImage(brushPatternImage, -width / 2, -height / 2, width, height)
                                    }
                                );

                                ctx.globalCompositeOperation = compositeOperation;
                                ctx.drawImage(image, 0, 0);
                            } else {

                                drawWithRotation(
                                    -destinationRotation.angle + brushRotation.angle,
                                    x + brushRotation.offset.x, y + brushRotation.offset.y,
                                    ({context}) => {
                                        context.drawImage(brushPatternImage, -width / 2, -height / 2, width, height)
                                    }
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
                    click: patternBrush,
                    cursors: ({x, y, outer}) => {


                        const {patterns} = this.props;
                        const {pattern, patternSize} = this.props.brush.params;


                        const brushPattern = patterns[pattern];

                        const brushRotation = brushPattern && brushPattern.rotation && brushPattern.rotation.value;
                        const brushPatternImage = brushPattern && brushPattern.resultImage;

                        const width = patternSize * (brushPatternImage && brushPatternImage.width);
                        const height = patternSize * (brushPatternImage && brushPatternImage.height);

                        const {rotation} = this.props;
                        return x - width / 2 ? (
                            <rect
                                transform={rotation && brushRotation ? `rotate(${-rotation.angle + brushRotation.angle} ${x} ${y})` : ""}
                                x={x - width / 2}
                                y={y - height / 2}
                                width={width}
                                height={height}
                                stroke={"black"} fill="purple"
                                fillOpacity="0" strokeOpacity={outer ? "0.3" : "0.7"}/>
                        ) : null;
                    }
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
            //todo чо я тут хотел
        }

    }

    downHandler = (e: CanvasEvent) => {
        const {startChanging} = this.props;

        startChanging();

        this.setState({
            coords: []
        });
    };

    clickHandler = () => {

    };

    moveHandler = ({e, drawing}: CanvasEvent) => {

        if (!drawing) {
            this.setState({
                coords: getRepeatingCoords(e.offsetX, e.offsetY, this.props.patterns[this.props.patternId])
            });
        } else {

        }

        setPosition(e.offsetX, e.offsetY, this.props.patternId);
    };

    leaveHandler = () => {
        this.props.onLeave && this.props.onLeave();

        this.setState({coords: []})
    };

    upHandler = ({e}) => {
        const {stopChanging} = this.props;

        stopChanging();

        this.setState({coords: getRepeatingCoords(e.offsetX, e.offsetY, this.props.patterns[this.props.patternId])})
    };

    getHandlers = () => {
        const {tool} = this.props;

        const getType = ToolTypeGetter[tool];
        const type = getType && getType(this.props);
        return this.handlers && this.handlers[tool] && this.handlers[tool][type];
        //todo рефакторинг
        // хендлеры событий вынести в методы класса
        //
    };

    handleChange = (imageData: ImageData) => {
        if (this.props.mask)
            for (let i = 0; i < imageData.data.length; i += 4) {

                imageData.data[i] = 0;
                imageData.data[i + 1] = 0;
                imageData.data[i + 2] = 0;
            }

        this.props.onChange(imageData);
    };

    render() {
        const {children, width, height, className, mask} = this.props;

        const handlers = this.getHandlers();

        return (
            <Canvas
                className={classNames("draw", {'mask' : mask}, className)}
                onDown={this.downHandler}
                onClick={handlers && handlers.click}
                onMove={this.moveHandler}
                onDraw={handlers && handlers.draw}
                onLeave={this.leaveHandler}
                onUp={this.upHandler}
                releaseProcess={handlers && handlers.release}
                width={width}
                height={height}
                {...this.props}
                onChange={this.handleChange}>
                {handlers && handlers.cursors &&
                <SVG
                    className={"draw-cursors"}
                    width={width}
                    height={height}>
                    {this.state.coords.map(handlers.cursors)}
                </SVG>}
                {children}
            </Canvas>
        );
    }
}

const ToolTypeGetter = {
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