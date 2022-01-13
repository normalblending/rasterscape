import * as React from "react";
import {Canvas, CanvasEvent, CanvasProps} from "../../_shared/Canvas";
import {AppState} from "../../../store";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {BrushState} from "../../../store/brush/reducer";
import {DrawToolParams, DrawToolType, EToolType} from "../../../store/tool/types";
import {BrushParams, BrushSelectParams, EBrushType} from "../../../store/brush/types";
import {LineState} from "../../../store/line/reducer";
import {ELineType} from "../../../store/line/types";
import {startDrawChanging, stopDrawChanging} from "../../../store/changing/actions";
import {SVG} from "../../_shared/SVG";
import classNames from "classnames";
import './draw.scss';
import {PatternState} from "../../../store/patterns/pattern/types";
import {brushPattern} from "./tools/brushPattern";
import {lineSolid} from "./tools/lineSolid";
import {lineSolidPattern} from "./tools/lineSolidPattern";
import {lineTrailingPattern} from "./tools/lineTrailingPattern";
import {toolParamsSelector, toolPatternSelector, toolTypeSelector} from "../../../store/tool/selectors";
import {DrawToolProps} from "./tools/types";
import {RepeatingCoordinatesItem} from "../../../store/patterns/repeating/helpers";
import {setPosition} from "../../../store/position";
import {brushForm} from "./tools/brushForm";
import {brushSelect} from "./tools/brushSelect";
import {bindCanvas} from "../../../store/patterns/pattern/actions";
import {CanvasLight} from "../../_shared/Canvas/CanvasLight";

export interface CanvasDrawStateProps {

    pattern: PatternState
    activePattern: boolean
    optimization: boolean
    // coordinates: RepeatingCoordinatesItem[]
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

    onCanvasRef?(canvas: HTMLCanvasElement): void
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
        [EBrushType.Shape]: ToolHandlers
        [EBrushType.Select]: ToolHandlers
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

    const {
        patternId,
        mask,

        startChanging,
        stopChanging,


        onLeave,
        onEnter,
        onChange,
    } = props;


    const downHandler = React.useCallback((e: MouseEvent) => {

        setStateChanging(true);

        startChanging();

    }, [startChanging]);

    const enterHandler = React.useCallback(() => {
        onEnter?.();

        setStateMoving(true);
    }, [onEnter]);
    const leaveHandler = React.useCallback(() => {
        onLeave?.();

        setStateMoving(false);
    }, [onLeave]);

    const upHandler = React.useCallback(({e}) => {

        setStateChanging(false);
        stopChanging();
        onChange?.();
    }, [stopChanging, onChange]);

    // const handlers = React.useMemo(() => {
    //
    //     return toolsDrawHandlers[tool]?.[toolType]({
    //         targetPattern: pattern,
    //         toolPattern,
    //         toolParams,
    //         // coordinates: coordinates || [],
    //     });
    //
    // }, [tool, toolType, pattern, toolParams, toolPattern]);

    const {
        children,
        className,
        disabled,
        onCanvasRef,
        style,
        rotation
        // ...restProps
    } = props;

    return (
        <CanvasLight
            //{...restProps}
            name={patternId}
            style={style}
            // pointerLock={(tool === EToolType.Brush && brushType === EBrushType.Select)}
            // drawOnMove={true}
            disabled={disabled}
            className={classNames("draw", {
                'mask': mask,
                'disabled': disabled
            }, className)}
            onDown={downHandler}
            // releaseProcess={handlers && handlers.release}
            // downProcess={handlers && handlers.down}
            // onClick={handlers && handlers.click}
            // onMove={moveHandler}
            // onDraw={handlers && handlers.draw}
            onEnter={enterHandler}
            onLeave={leaveHandler}
            onUp={upHandler}
            // width={width}
            // height={height}
            // onChange={handleChange}
            onCanvasRef={onCanvasRef}
        >
            {/*{(tool === EToolType.Brush && brushType === EBrushType.Select) ? 1 : 2}*/}
            {/*{!_changing && _moving && handlers && handlers.cursors && (*/}
            {/*    <SVG*/}
            {/*        className={"draw-cursors"}*/}
            {/*        width={width}*/}
            {/*        height={height}*/}
            {/*    >*/}
            {/*        /!*{coordinates?.map(handlers.cursors)}*!/*/}
            {/*    </SVG>*/}
            {/*)}*/}
            {children}
        </CanvasLight>
    );

}

const mapStateToProps: MapStateToProps<CanvasDrawStateProps, CanvasDrawOwnProps, AppState> = (state, {patternId}) => ({
    pattern: state.patterns[patternId],
    activePattern: state.activePattern.patternId === patternId,
    optimization: state.optimization.on,
    // coordinates: (state.position.patternId === patternId) ? state.position.coordinates : null,
});

const mapDispatchToProps: MapDispatchToProps<CanvasDrawActionProps, CanvasDrawOwnProps> = {
    startChanging: startDrawChanging,
    stopChanging: stopDrawChanging,
    setPosition,

};

export const Draw = connect<CanvasDrawStateProps, CanvasDrawActionProps, CanvasDrawOwnProps, AppState>(
    mapStateToProps, mapDispatchToProps
)(CanvasDrawComponent);
