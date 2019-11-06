import * as React from "react";
import {Canvas, CanvasProps} from "./Canvas";
import {circle} from "../../utils/canvas";
import {pathDataToString} from "../../utils/path";
import {AppState, store} from "../../store";
import {Size} from "../../utils/types";
import {WindowState} from "../../store/mainCanvas/reducer";
import {windowSelectors} from "../../store/_shared/canvas/selectors";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";

export interface CanvasDrawStateProps extends CanvasProps {
    size?: Size
    value?: ImageData
}

export interface CanvasDrawActionProps extends CanvasProps {
    onChange?(imageData?: ImageData)

}

export interface CanvasDrawOwnProps extends CanvasProps {
    children?: React.ReactNode
    className?: string
    style?: any
}

export interface CanvasDrawProps extends CanvasProps {
}

export interface CanvasDrawState {
}

export class CanvasDraw extends React.PureComponent<CanvasDrawProps, CanvasDrawState> {

    drawProcess = (e, pre, ctx, canvas) => {
        ctx.fillStyle = '#000';
        circle(ctx, e.offsetX, e.offsetY, 10);

        ctx.strokeStyle = '#f00';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#fff0';

        var p = new Path2D(pathDataToString(store.getState().mainCanvas.selection));
        ctx.stroke(p);
        ctx.fill(p);
    };

    clickProcess = (e, ctx, canvas) => {
        ctx.fillStyle = '#000';
        circle(ctx, e.offsetX, e.offsetY, 10);
    };

    render() {
        return (
            <Canvas
                drawProcess={this.drawProcess}
                clickProcess={this.clickProcess}
                {...this.props}/>
        );
    }
}

export const canvasDrawConnect = (getWindowState: (state: AppState) => WindowState, changeAction) => {
    const WindowSelectors = windowSelectors(state => state.mainCanvas);
    const mapStateToProps: MapStateToProps<CanvasDrawStateProps, CanvasDrawOwnProps, AppState> = state => ({
        value: WindowSelectors.getImageValue(state),
        size: WindowSelectors.getSize(state)
    });

    const mapDispatchToProps: MapDispatchToProps<CanvasDrawActionProps, CanvasDrawOwnProps> = {
        onChange: changeAction
    };

    return connect<CanvasDrawStateProps, CanvasDrawActionProps, CanvasDrawOwnProps, AppState>(
        mapStateToProps, mapDispatchToProps
    )(CanvasDraw)
};