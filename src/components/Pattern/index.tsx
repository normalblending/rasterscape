import * as React from "react";
import {Button} from "../_shared/Button";
import "../../styles/pattern.scss";
import {
    LoadingParams,
    MaskParams,
    PatternConfig,
    RepeatingParams,
    RotationValue, Segments,
    SelectionState,
    StoreState
} from "../../store/patterns/types";
import {HistoryState} from "../../store/patterns/types";
import {HistoryControls} from "./HistoryControls";
import {SelectionValue} from "../../store/patterns/types";
import {Area} from "../Area";
import {InputNumber} from "../_shared/InputNumber";
import {InputText} from "../_shared/InputText";
import {MaskDraw} from "../Area/MaskDraw";
import {ButtonSelect} from "../_shared/ButtonSelect";
import {RotationControls} from "./RotatingControls";
import {RepeatingControls} from "./RepeatingControls";
import {SaveLoadControls} from "./SaveLoadControls";
import {SelectionControls} from "./SelectionControls";

export interface PatternWindowProps {
    id: string
    imageValue: ImageData
    maskValue?: ImageData
    maskParams?: MaskParams
    rotation?: RotationValue
    repeating?: RepeatingParams
    loading: LoadingParams

    height: number
    width: number

    connected?: string

    config: PatternConfig
    history: HistoryState
    store: StoreState
    selection: SelectionState

    resultImage: HTMLCanvasElement

    onImageChange(id: string, imageData: ImageData)

    onMaskChange(id: string, imageData: ImageData)

    onMaskParamsChange(id: string, params: MaskParams)

    onSelectionChange(id: string, selectionValue: Segments, bBox: SVGRect)

    onRemove(id: string)

    onDouble(id: string)

    onUndo(id: string)

    onRedo(id: string)

    onSetWidth(id: string, width: number)

    onSetHeight(id: string, height: number)

    onCreateRoom(id: string, name: string)

    onConfigChange(id: string, value: PatternConfig)

    onRotationChange(id: string, value: RotationValue)

    onRepeatingChange(id: string, value: RepeatingParams)

    onLoad(id: string, image)

    onSave(id: string)

    onLoadingParamsChange(id: string, params: LoadingParams)

    onCreatePatternFromSelection(id: string)

    onCutBySelection(id: string)
}

export interface PatternWindowState {
    roomName?: string
}

const inputNumberProps = {min: 0, max: 500, step: 1, delay: 1000, notZero: true};

export class Pattern extends React.PureComponent<PatternWindowProps, PatternWindowState> {

    state = {
        roomName: "222"
    };


    handleImageChange = imageData => this.props.onImageChange(this.props.id, imageData);

    handleMaskChange = imageData => this.props.onMaskChange(this.props.id, imageData);

    handleSelectionChange = (value, bBox: SVGRect) =>
        this.props.onSelectionChange(this.props.id, value, bBox);

    handleClearSelection = () =>
        this.props.onSelectionChange(this.props.id, [], null);

    handleRemove = () => this.props.onRemove(this.props.id);

    handleDouble = () => this.props.onDouble(this.props.id);

    handleUndo = () => this.props.onUndo(this.props.id);

    handleRedo = () => this.props.onRedo(this.props.id);

    handleSetWidth = width => this.props.onSetWidth(this.props.id, width);

    handleSetHeight = height => this.props.onSetHeight(this.props.id, height);


    handleMaskParamsChange = (params: MaskParams) =>
        this.props.onMaskParamsChange(this.props.id, params);

    handleCreateRoom = () => {
        this.props.onCreateRoom(this.props.id, this.state.roomName);
    };

    handleConfigToggle = (data) => {
        this.props.onConfigChange(this.props.id, {
            ...this.props.config,
            [data.name]: !data.selected
        })
    };

    handleRotationChange = (rotation: RotationValue) => {
        this.props.onRotationChange(this.props.id, rotation)
    };

    handleRepeatingChange = (repeating: RepeatingParams) => {
        this.props.onRepeatingChange(this.props.id, repeating)
    };

    handleLoad = (image) => {
        this.props.onLoad(this.props.id, image)
    };
    handleSave = () => {
        this.props.onSave(this.props.id)
    };
    handleLoadingParamsChange = (params: LoadingParams) => {
        this.props.onLoadingParamsChange(this.props.id, params)
    };
    handleCreatePatternFromSelection = () => {
        this.props.onCreatePatternFromSelection(this.props.id)
    };
    handleCutBySelection = () => {
        this.props.onCutBySelection(this.props.id)
    };


    render() {
        const {
            connected,
            resultImage, imageValue, maskValue, maskParams,
            height, width, id, config,
            history, store, selection, rotation, repeating, loading
        } = this.props;

        console.log("pattern render ", id, rotation);
        return (
            <div className="pattern">
                <div className={"areas"}>
                    <Area
                        name={id}
                        width={width}
                        height={height}

                        rotation={rotation}

                        imageValue={imageValue}

                        selectionValue={selection.value.segments}
                        selectionParams={selection.params}

                        onImageChange={this.handleImageChange}
                        onSelectionChange={this.handleSelectionChange}/>
                    {config.mask &&
                    <MaskDraw
                        rotation={rotation}
                        params={maskParams}
                        value={maskValue}
                        name={id}
                        width={width}
                        height={height}
                        onParamsChange={this.handleMaskParamsChange}
                        onChange={this.handleMaskChange}/>}
                    {/*{resultImage instanceof HTMLCanvasElement ? resultImage : ""}*/}
                </div>
                <div className="pattern-controls">
                    <Button onClick={this.handleRemove}>del</Button> {id}
                    <Button onClick={this.handleDouble}>double</Button>

                    {connected}
                    <InputText
                        value={this.state.roomName}
                        onChange={roomName => this.setState({roomName})}/>
                    <Button
                        onClick={this.handleCreateRoom}/>


                    <InputNumber
                        onChange={this.handleSetWidth}
                        value={width}
                        {...inputNumberProps}/>
                    <InputNumber
                        onChange={this.handleSetHeight}
                        value={height}
                        {...inputNumberProps}/>

                    {config.history &&
                    <HistoryControls
                        history={history.value}
                        onUndo={this.handleUndo}
                        onRedo={this.handleRedo}/>}


                    <SelectionControls
                        selectionValue={selection.value}
                        onCreatePattern={this.handleCreatePatternFromSelection}
                        onClear={this.handleClearSelection}
                        onCut={this.handleCutBySelection}/>

                    {config.rotation &&
                    <RotationControls
                        patternId={id}
                        rotation={rotation}
                        onChange={this.handleRotationChange}/>}

                    {config.repeating &&
                    <RepeatingControls
                        patternId={id}
                        repeating={repeating}
                        onChange={this.handleRepeatingChange}/>}

                    <SaveLoadControls
                        patternId={id}
                        loading={loading}
                        onParamsChange={this.handleLoadingParamsChange}
                        onLoad={this.handleLoad}
                        onSave={this.handleSave}/>

                    <div>
                        <ButtonSelect
                            name={"mask"}
                            selected={config.mask}
                            onClick={this.handleConfigToggle}>mask</ButtonSelect>
                        <ButtonSelect
                            name={"repeating"}
                            selected={config.repeating}
                            onClick={this.handleConfigToggle}>repeating</ButtonSelect>
                        <ButtonSelect
                            name={"rotation"}
                            selected={config.rotation}
                            onClick={this.handleConfigToggle}>rotation</ButtonSelect>
                    </div>
                </div>

            </div>
        );
    }
}