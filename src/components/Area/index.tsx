import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {BrushState} from "../../store/brush/reducer";
import {EToolType, selectionTools} from "../../store/tool/types";
import {Selection} from "./Selection";
import {Draw} from "./Draw";
import {SelectionState, StoreState} from "../../store/patterns/reducer";
import {SelectionValue} from "../../utils/types";
import {SelectionParams} from "../../store/patterns/helpers";
import "../../styles/area.scss";

export interface AreaStateProps {
    currentTool: EToolType
}

export interface AreaActionProps {
}

export interface AreaOwnProps {
    id: number // нужен для маски выделения
    height: number
    width: number

    imageValue: ImageData
    selectionValue: SelectionValue
    selectionParams: SelectionParams

    onImageChange(imageData: ImageData)

    onSelectionChange(selectionValue: SelectionValue)
}

export interface AreaProps extends AreaStateProps, AreaActionProps, AreaOwnProps {

}

const AreaComponent: React.FC<AreaProps> = ({currentTool, id, height, width, imageValue, selectionValue, selectionParams, onImageChange, onSelectionChange}) => {

    console.log(selectionTools.indexOf(currentTool) !== -1);
    return (
        <div className="area">
            <Draw
                value={imageValue}
                width={width}
                height={height}
                onChange={onImageChange}/>
            <Selection
                isActive={selectionTools.indexOf(currentTool) !== -1}
                id={id}
                width={width}
                height={height}
                value={selectionValue}
                params={selectionParams}
                onChange={onSelectionChange}/>
        </div>
    );
};

const mapStateToProps: MapStateToProps<AreaStateProps, AreaOwnProps, AppState> = state => ({
    currentTool: state.tool.current
});

const mapDispatchToProps: MapDispatchToProps<AreaActionProps, AreaOwnProps> = {};

export const Area = connect<AreaStateProps, AreaActionProps, AreaOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(AreaComponent);