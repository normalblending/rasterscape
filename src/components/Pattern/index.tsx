import * as React from "react";
import {Button} from "../_shared/Button";
import "../../styles/pattern.scss";
import {PatternConfig} from "../../store/patterns/helpers";
import {HistoryState, SelectionState, StoreState} from "../../store/patterns/reducer";
import {HistoryControls} from "./HistoryControls";
import {SelectionValue} from "../../utils/types";
import {Area} from "../Area";
import {InputNumber} from "../_shared/InputNumber";
import * as io from "socket.io-client";
import {base64ToImageData, imageDataToBase64} from "../../utils/imageData";
import {InputText} from "../_shared/InputText";

export interface PatternWindowProps {
    id: number
    imageValue: ImageData
    height: number
    width: number

    connected?: string

    config: PatternConfig
    history: HistoryState
    store: StoreState
    selection: SelectionState

    onImageChange(id: number, imageData: ImageData)

    onSelectionChange(id: number, selectionValue: SelectionValue)

    onRemove(id: number)

    onUndo(id: number)

    onRedo(id: number)

    onSetWidth(id: number, width: number)

    onSetHeight(id: number, height: number)

    onCreateRoom(id: number, name: string)
}

export interface PatternWindowState {
    roomName?: string
}

const inputNumberProps = {min: 0, max: 500, step: 1, delay: 1000, notZero: true};

export class Pattern extends React.PureComponent<PatternWindowProps, PatternWindowState> {

    socket;

    state = {
        roomName: "222"
    };

    constructor(props) {
        super(props);


        // this.socket = io.connect("http://localhost:3000");
        //
        // this.socket.on("image", base64 => {
        //     base64ToImageData(base64).then(imageData => {
        //         console.log(imageData);
        //         this.props.onImageChange(this.props.id, imageData);
        //     });
        // })
    }


    handleImageChange = imageData => {
        // this.socket.emit("image", imageDataToBase64(imageData));
        this.props.onImageChange(this.props.id, imageData);
    };

    handleSelectionChange = value =>
        this.props.onSelectionChange(this.props.id, value);

    handleClearSelection = () =>
        this.props.onSelectionChange(this.props.id, []);

    handleRemove = () => this.props.onRemove(this.props.id);

    handleUndo = () => this.props.onUndo(this.props.id);

    handleRedo = () => this.props.onRedo(this.props.id);

    handleSetWidth = width => this.props.onSetWidth(this.props.id, width);

    handleSetHeight = height => this.props.onSetHeight(this.props.id, height);



    handleCreateRoom = () => {
        this.props.onCreateRoom(this.props.id, this.state.roomName);
    };

    render() {
        const {connected, imageValue, height, width, id, config, history, store, selection} = this.props;

        console.log("pattern render " + id);
        return (
            <div className="pattern">
                <Area
                    id={id}
                    width={width}
                    height={height}

                    imageValue={imageValue}

                    selectionValue={selection.value}
                    selectionParams={selection.params}

                    onImageChange={this.handleImageChange}
                    onSelectionChange={this.handleSelectionChange}/>
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


                </div>

            </div>
        );
    }
}