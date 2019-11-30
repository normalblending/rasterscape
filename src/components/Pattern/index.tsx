import * as React from "react";
import {Button} from "../_shared/Button";
import "../../styles/pattern.scss";
import {MaskParams, PatternConfig, SelectionState, StoreState} from "../../store/patterns/types";
import {HistoryState} from "../../store/patterns/types";
import {HistoryControls} from "./HistoryControls";
import {SelectionValue} from "../../utils/types";
import {Area} from "../Area";
import {InputNumber} from "../_shared/InputNumber";
import {InputText} from "../_shared/InputText";
import {MaskDraw} from "../Area/MaskDraw";
import {ButtonSelect} from "../_shared/ButtonSelect";
import {ButtonNumber} from "../_shared/ButtonNumber";
import {ButtonNumberCF} from "../_shared/ButtonNumberCF";
import {Canvas} from "../_shared/Canvas";

export interface PatternWindowProps {
    id: number
    imageValue: ImageData
    maskValue?: ImageData
    maskParams?: MaskParams
    height: number
    width: number

    connected?: string

    config: PatternConfig
    history: HistoryState
    store: StoreState
    selection: SelectionState

    resultImage: HTMLCanvasElement

    onImageChange(id: number, imageData: ImageData)

    onMaskChange(id: number, imageData: ImageData)

    onMaskParamsChange(id: number, params: MaskParams)

    onSelectionChange(id: number, selectionValue: SelectionValue)

    onRemove(id: number)

    onUndo(id: number)

    onRedo(id: number)

    onSetWidth(id: number, width: number)

    onSetHeight(id: number, height: number)

    onCreateRoom(id: number, name: string)

    onConfigChange(id: number, value: PatternConfig)
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

    handleSelectionChange = value =>
        this.props.onSelectionChange(this.props.id, value);

    handleClearSelection = () =>
        this.props.onSelectionChange(this.props.id, []);

    handleRemove = () => this.props.onRemove(this.props.id);

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

    render() {
        const {resultImage, connected, imageValue, maskValue, maskParams, height, width, id, config, history, store, selection} = this.props;

        console.log("pattern render ", id, resultImage);
        return (
            <div className="pattern">
                <div className={"areas"}>
                    <Area
                        name={id}
                        width={width}
                        height={height}

                        imageValue={imageValue}

                        selectionValue={selection.value}
                        selectionParams={selection.params}

                        onImageChange={this.handleImageChange}
                        onSelectionChange={this.handleSelectionChange}/>
                    {config.mask &&
                    <MaskDraw
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

                    {selection.value && selection.value.length &&
                    <Button
                        onClick={this.handleClearSelection}>clear</Button>}


                    <div>
                        <ButtonSelect
                            name={"mask"}
                            selected={config.mask}
                            onClick={this.handleConfigToggle}>mask</ButtonSelect>
                    </div>
                </div>

            </div>
        );
    }
}