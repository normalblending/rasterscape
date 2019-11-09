import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../store";
import {
    redo,
    setHeight,
    setSelection, setSelectionParams,
    setWidth,
    storeImage,
    undo,
    unstoreImage,
    updateImage
} from "../store/mainWindow/actions";
import {InputNumber} from "./_shared/InputNumber";
import {Button} from "./_shared/Button";
import {SetMainWindowHeightAction, SetMainWindowWidthAction} from "../store/mainWindow/types";
// import {canvasSelectionConnect} from "./_shared/CanvasSelection";
import {Checkbox} from "./_shared/Checkbox";
// import {canvasSelectionControlsConnect} from "./_shared/CanvasSelectionControls";
// import {canvasDrawConnect} from "./_shared/CanvasDraw";
import "../styles/mainWindow.scss";

export interface MainCanvasStateProps {
    imageData: ImageData,
    beforeLength: number,
    afterLength: number,
    isStored: boolean,
    width: number,
    height: number
}

export interface MainCanvasActionProps {
    updateImage(imageData: ImageData)

    undo(),

    redo(),

    setWidth(width: number): SetMainWindowWidthAction,

    setHeight(height: number): SetMainWindowHeightAction,

    storeImage(),

    unstoreImage()
}

export interface MainCanvasOwnProps {

}

export interface MainCanvasProps extends MainCanvasStateProps, MainCanvasActionProps, MainCanvasOwnProps {

}

const inputNumberProps = {min: 0, max: 500, step: 1, delay: 1000, notZero: true};

// const CanvasSelector = canvasSelectionConnect(state => state.mainWindow, setSelection);
// const CanvasDraw = canvasDrawConnect(state => state.mainWindow, updateImage);
// const CanvasSelectorControls = canvasSelectionControlsConnect(state => state.mainWindow, setSelectionParams)

const MainCanvasComponent: React.FC<MainCanvasProps> = ({imageData, updateImage, undo, redo, storeImage, unstoreImage, setWidth, setHeight, beforeLength, afterLength, isStored, width, height}) => {

    console.log("main canvas render");
    const [selectionEnabled, setSelectionEnabled] = React.useState(true);

    const handleSelectionEnabledChange = enabled => {
        setSelectionEnabled(enabled);
        if (!enabled) {
            //setSelection(null);
        }
    };

    return (
        <div className="mainWindow">
            {/*<CanvasDraw>*/}
                {/*{selectionEnabled &&*/}
                {/*<CanvasSelector/>}*/}
            {/*</CanvasDraw>*/}
            {/*<CanvasSelectorControls/>*/}
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
        </div>
    );
};

const mapStateToProps: MapStateToProps<MainCanvasStateProps, MainCanvasOwnProps, AppState> = state => ({
    imageData: state.mainWindow.current.imageData,
    width: state.mainWindow.current.width,
    height: state.mainWindow.current.height,
    beforeLength: state.mainWindow.history.before.length,
    afterLength: state.mainWindow.history.after.length,
    isStored: !!state.mainWindow.stored
});

const mapDispatchToProps: MapDispatchToProps<MainCanvasActionProps, MainCanvasOwnProps> = {
    updateImage, undo, redo, storeImage, unstoreImage, setWidth, setHeight
};

export const MainWindow = connect<MainCanvasStateProps, MainCanvasActionProps, MainCanvasOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(MainCanvasComponent);