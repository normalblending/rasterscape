import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {EToolType, selectionTools} from "../../store/tool/types";
import {Selection} from "./Selection";
import {Draw} from "./Draw";
import "../../styles/area.scss";
import {RotationValue} from "../../store/patterns/rotating/types";
import {Segments, SelectionParams, SelectionValue} from "../../store/patterns/selection/types";

export interface AreaStateProps {
    currentTool: EToolType
}

export interface AreaActionProps {
}

export interface AreaOwnProps {
    mask?: boolean
    name: any // нужен для маски выделения
    height: number
    width: number
    rotation?: RotationValue

    imageValue: ImageData
    selectionValue: Segments
    selectionParams: SelectionParams

    onImageChange(imageData: ImageData)

    onSelectionChange(selectionValue: SelectionValue, bBox: SVGRect)
}

export interface AreaProps extends AreaStateProps, AreaActionProps, AreaOwnProps {

}

export interface AreaState {
    rotation?: RotationValue
    style?: any
}

const getStyle = (rotation) => rotation ? {
    transform: `rotate(${rotation.angle}deg) translateY(${-rotation.offset.y}px) translateX(${rotation.offset.x}px)`,
} : null;

class AreaComponent extends React.PureComponent<AreaProps, AreaState> {



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

    render() {
        const {
            mask,
            currentTool,
            name,
            height,
            width,
            imageValue,
            selectionValue,
            selectionParams,
            onImageChange,
            onSelectionChange,
            rotation
        } = this.props;

        console.log("area", this.state);
        return (
            <div className="area">
                <Draw
                    mask={mask}
                    patternId={name}
                    style={this.state.style}
                    rotation={rotation}
                    value={imageValue}
                    width={width}
                    height={height}
                    onChange={onImageChange}/>
                <Selection
                    style={this.state.style}
                    isActive={selectionTools.indexOf(currentTool) !== -1}
                    name={name}
                    width={width}
                    height={height}
                    value={selectionValue}
                    params={selectionParams}
                    onChange={onSelectionChange}/>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<AreaStateProps, AreaOwnProps, AppState> = (state) => ({
    currentTool: state.tool.current
});

const mapDispatchToProps: MapDispatchToProps<AreaActionProps, AreaOwnProps> = {};

export const Area = connect<AreaStateProps, AreaActionProps, AreaOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(AreaComponent);