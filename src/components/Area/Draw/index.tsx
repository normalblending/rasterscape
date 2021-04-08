import * as React from "react";
import {Canvas, CanvasEvent, CanvasProps} from "../../_shared/Canvas/index";
import {AppState} from "../../../store";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {BrushState} from "../../../store/brush/reducer";
import {DrawToolParams, DrawToolType, EToolType} from "../../../store/tool/types";
import {EBrushType} from "../../../store/brush/types";
import {LineState} from "../../../store/line/reducer";
import get from "lodash/get";
import {ELineType} from "../../../store/line/types";
import {startDrawChanging, stopDrawChanging} from "../../../store/changing/actions";
import {coordHelper2} from "../canvasPosition.servise";
import {SVG} from "../../_shared/SVG";
import classNames from "classnames";
import '../../../styles/draw.scss';
import {PatternState} from "../../../store/patterns/pattern/types";
import {brushSquare} from "./tools/brushSquare";
import {brushCircle} from "./tools/brushCircle";
import {brushPattern} from "./tools/brushPattern";
import {lineSolid} from "./tools/lineSolid";
import {lineSolidPattern} from "./tools/lineSolidPattern";
import {lineTrailingPattern} from "./tools/lineTrailingPattern";
import {toolParamsSelector, toolPatternSelector, toolTypeSelector} from "../../../store/tool/selectors";
import {DrawToolProps} from "./tools/types";
import {getRepeatingCoords, RepeatingCoordinatesItem} from "../../../store/patterns/repeating/helpers";
import {setPosition} from "../../../store/position";

export interface CanvasDrawStateProps {
    brush: BrushState
    line: LineState
    tool: EToolType
    toolType: DrawToolType
    toolParams: DrawToolParams
    toolPattern: PatternState
    pattern: PatternState
    brushPattern: PatternState
    linePattern: PatternState
    activePattern: boolean
    optimization: boolean
    coordinates: RepeatingCoordinatesItem[]
}

export interface CanvasDrawActionProps {
    startChanging()

    stopChanging()
    setPosition(patternId: string, x: number, y: number)
}

export interface CanvasDrawOwnProps extends CanvasProps {
    patternId: string
    mask?: boolean
    disabled?: boolean
}

export interface CanvasDrawProps extends CanvasDrawStateProps, CanvasDrawActionProps, CanvasDrawOwnProps {
}

export interface CanvasDrawState {
    coords
}

export type ToolHandlers = (drawToolProps: DrawToolProps) => {
    draw: (e: CanvasEvent) => void,
    down?: (e: CanvasEvent) => void,
    click?: (e: CanvasEvent) => void,
    release?: (e?: CanvasEvent) => void,
    cursors: ({x, y, outer}, index) => void
};

export type ToolsDrawHandlers = {
    [EToolType.Brush]: {
        [EBrushType.Square]: ToolHandlers
        [EBrushType.Circle]: ToolHandlers
        [EBrushType.Pattern]: ToolHandlers
    }
    [EToolType.Line]: {
        [ELineType.Solid]: ToolHandlers
        [ELineType.SolidPattern]: ToolHandlers
        [ELineType.TrailingPattern]: ToolHandlers
    },
};

const CanvasDrawComponent: React.FC<CanvasDrawProps> = (props) => {


    const [_changing, setStateChanging] = React.useState<boolean>(false);
    const [_moving, setStateMoving] = React.useState<boolean>(false);

    const toolsDrawHandlers = React.useMemo<ToolsDrawHandlers>(() => ({
        [EToolType.Brush]: {
            [EBrushType.Square]: brushSquare(),
            [EBrushType.Circle]: brushCircle(),
            [EBrushType.Pattern]: brushPattern(),
        },
        [EToolType.Line]: {
            [ELineType.Solid]: lineSolid(),
            [ELineType.SolidPattern]: lineSolidPattern(),
            [ELineType.TrailingPattern]: lineTrailingPattern(),
        },
    }), []);

    const {
        patternId,
        pattern,
        tool,
        toolType,
        toolParams,
        toolPattern,
        mask,

        startChanging,
        stopChanging,
        setPosition,

        coordinates,

        onLeave,
        onEnter,
        onChange,
    } = props;


    const downHandler = React.useCallback((e: CanvasEvent) => {

        setStateChanging(true);

        startChanging();

        // setCoords([]);

    }, [startChanging]);

    const clickHandler = React.useCallback(() => {

    }, []);

    const moveHandler = React.useCallback(({e, drawing}: CanvasEvent) => {

        // if (!drawing) {
        //     setCoords(
        //         getRepeatingCoords(
        //             e.offsetX,
        //             e.offsetY,
        //             pattern,
        //             true,
        //             tool
        //         )
        //     );
        // }

        setPosition(patternId, e.offsetX, e.offsetY);
    }, [patternId, pattern, tool, setPosition]);

    const enterHandler = React.useCallback(() => {
        onEnter?.();

        setStateMoving(true);
        // setCoords([]);
    }, [onEnter]);
    const leaveHandler = React.useCallback(() => {
        onLeave?.();

        setStateMoving(false);
        // setCoords([]);
    }, [onLeave]);

    const upHandler = React.useCallback(({e}) => {

        setStateChanging(false);
        stopChanging();

        // setCoords(
        //     getRepeatingCoords(
        //         e.offsetX,
        //         e.offsetY,
        //         pattern,
        //         true,
        //         tool)
        // )
    }, [stopChanging, pattern, tool]);


    const handlers = React.useMemo(() => {

        return toolsDrawHandlers[tool]?.[toolType]({
            targetPattern: pattern,
            toolPattern,
            toolParams,
            coordinates: coordinates || [],
        });

    }, [tool, toolType, pattern, toolParams, toolPattern, coordinates]);

    // React.useEffect(() => {
    //
    //     const ha = handlers;
    //     return () => {
    //         console.log(handlers === ha);
    //         handlers?.release?.();
    //     };
    // }, [handlers]);
    // componentDidUpdate(prevProps: CanvasDrawProps) {
    //     const {tool} = this.props;
    //
    //     if (prevProps.tool !== tool) {
    //
    //         const handlers = this.getHandlers(prevProps.tool);
    //         handlers?.release?.();
    //     }
    //
    // }


    const handleChange = React.useCallback((imageData: ImageData) => {
        if (mask) {
            for (let i = 0; i < imageData.data.length; i += 4) {

                imageData.data[i] = 0;
                imageData.data[i + 1] = 0;
                imageData.data[i + 2] = 0;
            }
        }

        onChange(imageData);
    }, [mask, onChange]);

    const {
        children,
        width,
        height,
        className,
        disabled,
        activePattern,
        optimization,
        ...restProps
    } = props;

    return (
        <Canvas
            {...restProps}
            name={patternId}
            throttle={!activePattern && optimization}
            // pointerLock={true}
            // drawOnMove={true}
            disabled={disabled}
            className={classNames("draw", {
                'mask': mask,
                'disabled': disabled
            }, className)}
            onDown={downHandler}
            downProcess={handlers && handlers.down}
            onClick={handlers && handlers.click}
            onMove={moveHandler}
            onDraw={handlers && handlers.draw}
            onEnter={enterHandler}
            onLeave={leaveHandler}
            onUp={upHandler}
            releaseProcess={handlers && handlers.release}
            width={width}
            height={height}
            onChange={handleChange}
        >
            {!_changing && _moving && handlers && handlers.cursors && (
                <SVG
                    className={"draw-cursors"}
                    width={width}
                    height={height}>
                    {coordinates?.map(handlers.cursors)}
                </SVG>
            )}
            {children}
        </Canvas>
    );

}

const mapStateToProps: MapStateToProps<CanvasDrawStateProps, CanvasDrawOwnProps, AppState> = (state, {patternId}) => ({
    brush: state.brush,
    line: state.line,
    tool: state.tool.current,
    toolType: toolTypeSelector(state),
    toolParams: toolParamsSelector(state),
    toolPattern: toolPatternSelector(state),
    pattern: state.patterns[patternId],
    brushPattern: state.patterns[state.brush.params.pattern],
    linePattern: state.patterns[state.line.params.pattern],
    activePattern: state.activePattern.patternId === patternId,
    optimization: state.optimization.on,
    coordinates: (state.position.patternId === patternId) ? state.position.coordinates : null,
});

const mapDispatchToProps: MapDispatchToProps<CanvasDrawActionProps, CanvasDrawOwnProps> = {
    startChanging: startDrawChanging,
    stopChanging: stopDrawChanging,
    setPosition,
};

export const Draw = connect<CanvasDrawStateProps, CanvasDrawActionProps, CanvasDrawOwnProps, AppState>(
    mapStateToProps, mapDispatchToProps
)(CanvasDrawComponent);