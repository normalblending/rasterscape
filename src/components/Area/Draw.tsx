import * as React from "react";
import {Canvas, CanvasProps} from "../_shared/Canvas";
import {circle} from "../../utils/canvas";
import {AppState} from "../../store/index";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {BrushState} from "../../store/brush/reducer";
import {EToolType} from "../../store/tool/types";

export interface CanvasDrawStateProps {
    brush: BrushState
    tool: EToolType
}

export interface CanvasDrawActionProps {
}

export interface CanvasDrawOwnProps extends CanvasProps {
}

export interface CanvasDrawProps extends CanvasDrawStateProps, CanvasDrawActionProps, CanvasDrawOwnProps {
}

export interface CanvasDrawState {
}

class CanvasDrawComponent extends React.PureComponent<CanvasDrawProps, CanvasDrawState> {

    drawProcess = (e, pre, ctx, canvas) => {










        // воттут




        console.log(111);








        ctx.fillStyle = '#000';
        circle(ctx, e.offsetX, e.offsetY, 10);
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

const mapStateToProps: MapStateToProps<CanvasDrawStateProps, CanvasDrawOwnProps, AppState> = state => ({
    brush: state.brush,
    tool: state.tool.current
});

const mapDispatchToProps: MapDispatchToProps<CanvasDrawActionProps, CanvasDrawOwnProps> = {
};

export const Draw = connect<CanvasDrawStateProps, CanvasDrawActionProps, CanvasDrawOwnProps, AppState>(
    mapStateToProps, mapDispatchToProps
)(CanvasDrawComponent);