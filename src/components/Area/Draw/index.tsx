import * as React from "react";
import {Canvas, CanvasEvent, CanvasProps} from "../../_shared/Canvas";
import {AppState} from "../../../store";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {BrushState} from "../../../store/brush/reducer";
import {EToolType} from "../../../store/tool/types";
import {EBrushType} from "../../../store/brush/types";
import {LineState} from "../../../store/line/reducer";
import get from "lodash/get";
import {ELineType} from "../../../store/line/types";
import {startDrawChanging, stopDrawChanging} from "../../../store/changing/actions";
import {getRepeatingCoords} from "../../../utils/draw";
import {coordHelper2, setPosition} from "../canvasPosition.servise";
import {SVG} from "../../_shared/SVG";
import classNames from "classnames";
import '../../../styles/draw.scss';
import {PatternState} from "../../../store/patterns/pattern/types";
import {brushSquare} from "./tools/brushSquare";
import {brushCircle} from "./tools/brushCircle";
import {brushPattern} from "./tools/brushPattern";
import {lineSolid} from "./tools/lineSolid";
import {lineBroken} from "./tools/lineBroken";
import {lineBrokenTransparent} from "./tools/lineBrokenTransparent";
import {linePattern} from "./tools/linePattern";

export interface CanvasDrawStateProps {
    brush: BrushState
    line: LineState
    tool: EToolType
    pattern: PatternState
    brushPattern: PatternState
    linePattern: PatternState
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

class CanvasDrawComponent extends React.PureComponent<CanvasDrawProps, CanvasDrawState> {

    state = {
        coords: []
    };

    handlers = {
        [EToolType.Brush]: {
            [EBrushType.Square]: brushSquare.call(this),
            [EBrushType.Circle]: brushCircle.call(this),
            [EBrushType.Pattern]: brushPattern.call(this),
        },
        [EToolType.Line]: {
            [ELineType.Solid]: lineSolid.call(this),
            [ELineType.Broken]: lineBroken.call(this),
            [ELineType.BrokenTransparent]: lineBrokenTransparent.call(this),
            [ELineType.Pattern]: linePattern.call(this),
        },
    };

    componentDidUpdate(prevProps: CanvasDrawProps) {
        const {pattern} = this.props;
        if (pattern.selection.params.mask) {
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
                coords: getRepeatingCoords(e.offsetX, e.offsetY, this.props.pattern)
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

        this.setState({coords: getRepeatingCoords(e.offsetX, e.offsetY, this.props.pattern)})
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
                // pointerLock={true}
                // drawOnMove={true}
                className={classNames("draw", {'mask': mask}, className)}
                onDown={this.downHandler}
                downProcess={handlers && handlers.down}
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

const mapStateToProps: MapStateToProps<CanvasDrawStateProps, CanvasDrawOwnProps, AppState> = (state, {patternId}) => ({
    brush: state.brush,
    line: state.line,
    tool: state.tool.current,
    pattern: state.patterns[patternId],
    brushPattern: state.patterns[state.brush.params.pattern],
    linePattern: state.patterns[state.line.params.pattern],
});

const mapDispatchToProps: MapDispatchToProps<CanvasDrawActionProps, CanvasDrawOwnProps> = {
    startChanging: startDrawChanging, stopChanging: stopDrawChanging
};

export const Draw = connect<CanvasDrawStateProps, CanvasDrawActionProps, CanvasDrawOwnProps, AppState>(
    mapStateToProps, mapDispatchToProps
)(CanvasDrawComponent);