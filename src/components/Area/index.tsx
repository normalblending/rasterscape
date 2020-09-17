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
    selectUnable: boolean
}

export interface AreaActionProps {
}

export interface AreaOwnProps {
    disabled?: boolean
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

    demonstration?: boolean
    onDemonstrationUnload?()
}

export interface AreaProps extends AreaStateProps, AreaActionProps, AreaOwnProps {

}

export interface AreaState {
    rotation?: RotationValue
    style?: any
    areaStyle?: any
}

const getStyle = (rotation, width, height) => rotation ? {
    transformOrigin: `${width / 2 + rotation.offset?.xc}px ${height / 2 - rotation.offset?.yc}px`,
    transform: `rotate(${rotation.angle}deg)`,
} : null;
const getAreaStyle = (rotation, width, height) => rotation ? {
    transform: `translateX(${rotation.offset.xd}px) translateY(${-rotation.offset.yd}px)`,
} : null;

class AreaComponent extends React.PureComponent<AreaProps, AreaState> {


    constructor(props) {
        super(props);
        this.state = {
            style: getStyle(props.rotation, props.width, props.height),
            areaStyle: getAreaStyle(props.rotation, props.width, props.height),
            rotation: props.rotation
        };
    }


    static getDerivedStateFromProps(props, state) {
        // if (state.rotation !== props.rotation) {
        return {
            rotation: props.rotation,
            style: getStyle(props.rotation, props.width, props.height),
            areaStyle: getAreaStyle(props.rotation, props.width, props.height)
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
            rotation,
            disabled,
            selectUnable,
            demonstration,
            onDemonstrationUnload,
        } = this.props;

        return (
            <div className="area"
                 style={this.state.areaStyle}>
                <Draw
                    disabled={disabled}
                    mask={mask}
                    patternId={name}
                    style={this.state.style}
                    rotation={rotation}
                    value={imageValue}
                    width={width}
                    height={height}
                    onChange={onImageChange}
                    demonstration={demonstration}
                    onDemonstrationUnload={onDemonstrationUnload}
                />
                <Selection
                    style={this.state.style}
                    isUnable={selectUnable}
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

const mapStateToProps: MapStateToProps<AreaStateProps, AreaOwnProps, AppState> = (state, {name}) => ({
    currentTool: state.tool.current,
    selectUnable: false,//state.tool.current === EToolType.Line
});

const mapDispatchToProps: MapDispatchToProps<AreaActionProps, AreaOwnProps> = {};

export const Area = connect<AreaStateProps, AreaActionProps, AreaOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(AreaComponent);