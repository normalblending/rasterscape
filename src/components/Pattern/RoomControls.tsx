import * as React from "react";
import {InputText} from "../_shared/InputText";
import {Button} from "../_shared/Button";

export interface RoomControlsProps {
    onRoomCreate(roomName: string)
    connected
}

export interface RoomControlsState {
    roomName?: string
}

export class RoomControls extends React.PureComponent<RoomControlsProps, RoomControlsState> {
    state = {
        roomName: "222"
    };

    handleCreateRoom = () => {
        this.props.onRoomCreate(this.state.roomName);
    };
    render() {
        const {connected} = this.props;
        return (
            <>

                {connected}
                <InputText
                    value={this.state.roomName}
                    onChange={roomName => this.setState({roomName})}/>
                <Button
                    onClick={this.handleCreateRoom}/>
            </>
        );
    }
}