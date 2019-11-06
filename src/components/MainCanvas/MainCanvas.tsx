import * as React from "react";
import {Canvas} from "../_shared/Canvas";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState, store} from "../../store";
import {
    redo,
    setHeight,
    setSelection, setSelectionParams,
    setWidth,
    storeImage,
    undo,
    unstoreImage,
    updateImage
} from "../../store/mainCanvas/actions";
import {circle} from "../../utils/canvas";
import {InputNumber} from "../_shared/InputNumber";
import {Button} from "../_shared/Button";
import {SetHeightAction, SetWidthAction} from "../../store/mainCanvas/types";
import {canvasSelectorConnect, ECurveType, ESelectionMode} from "../_shared/CanvasSelector";
import {Checkbox} from "../_shared/Checkbox";
import {SelectionParams, SelectionValue} from "../../utils/types";
import {SelectButtons} from "../_shared/SelectButtons";
import {pathDataToString} from "../../utils/path";
import {ButtonNumber, ValueD} from "../_shared/ButtonNumber";
import {ESelectItemType, SelectCompact} from "../_shared/SelectCompact";
import {MainCanvasSelector} from "../../store/mainCanvas/selectors";
import {canvasSelectorControlsConnect} from "../_shared/CanvasSelectorControls";
import {canvasDrawConnect} from "../_shared/CanvasDraw";

export interface MainCanvasStateProps {
    imageData: ImageData,
    beforeLength: number,
    afterLength: number,
    isStored: boolean,
    width: number,
    height: number,
    selection: SelectionValue,
    selectionParams: SelectionParams
}

export interface MainCanvasActionProps {
    updateImage(imageData: ImageData)

    undo(),

    redo(),

    setWidth(width: number): SetWidthAction,

    setHeight(height: number): SetHeightAction,

    storeImage(),

    unstoreImage()

    setSelection(selection: SelectionValue)
}

export interface MainCanvasOwnProps {

}

export interface MainCanvasProps extends MainCanvasStateProps, MainCanvasActionProps, MainCanvasOwnProps {

}

const inputNumberProps = {min: 0, max: 500, step: 1, delay: 1000, notZero: true};

const CanvasSelector = canvasSelectorConnect(state => state.mainCanvas, setSelection);
const CanvasDraw = canvasDrawConnect(state => state.mainCanvas, updateImage);
const CanvasSelectorControls = canvasSelectorControlsConnect(state => state.mainCanvas, setSelectionParams)

const MainCanvasComponent: React.FC<MainCanvasProps> = ({imageData, updateImage, undo, redo, storeImage, unstoreImage, setWidth, setHeight, setSelection, beforeLength, afterLength, isStored, width, height, selection, selectionParams}) => {

    console.log("main canvas render");
    const [selectionEnabled, setSelectionEnabled] = React.useState(true);
    const [selectType, setSelectType] = React.useState(ESelectionMode.Points);
    const [curveType, setCurveType] = React.useState(ECurveType.Default);
    const [a, setA] = React.useState(["", 0]);

    const handleSelectionEnabledChange = enabled => {
        setSelectionEnabled(enabled);
        if (!enabled) {
            //setSelection(null);
        }
    };

    const handleChangeA = (name, value) => {
        setA([name, value])
    };

    return (
        <>
            <CanvasDraw
                className="mainCanvas">
                {selectionEnabled &&
                <CanvasSelector/>}
            </CanvasDraw>
            <CanvasSelectorControls/>
            <Checkbox
                value={selectionEnabled}
                onChange={handleSelectionEnabledChange}/>
            <Button
                onClick={undo}
                disabled={!beforeLength}
                width={70}>
                undo{beforeLength ? `(${beforeLength})` : ""}</Button>
            <Button
                onClick={redo}
                disabled={!afterLength}
                width={70}>
                redo{afterLength ? `(${afterLength})` : ""}</Button>
            <Button
                onClick={storeImage}>
                store</Button>
            <Button
                onClick={unstoreImage}
                disabled={!isStored}
                width={70}>
                unstore</Button>
            <InputNumber
                onChange={setWidth}
                value={width}
                {...inputNumberProps}/>
            <InputNumber
                onChange={setHeight}
                value={height}
                {...inputNumberProps}/>
        </>
    );
};

const mapStateToProps: MapStateToProps<MainCanvasStateProps, {}, AppState> = state => ({
    imageData: state.mainCanvas.current.imageData,
    width: state.mainCanvas.current.width,
    height: state.mainCanvas.current.height,
    beforeLength: state.mainCanvas.history.before.length,
    afterLength: state.mainCanvas.history.after.length,
    isStored: !!state.mainCanvas.stored,
    selection: MainCanvasSelector.getSelectionValue(state),
    selectionParams: MainCanvasSelector.getSelectionParams(state),
});

const mapDispatchToProps: MapDispatchToProps<MainCanvasActionProps, MainCanvasOwnProps> = {
    updateImage, undo, redo, storeImage, unstoreImage, setWidth, setHeight, setSelection
};

export const MainCanvas = connect<MainCanvasStateProps, MainCanvasActionProps, MainCanvasOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(MainCanvasComponent);