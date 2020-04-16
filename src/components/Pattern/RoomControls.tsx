import * as React from "react";
import {InputText} from "../_shared/InputText";
import {Button} from "../_shared/buttons/Button";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {createRoom, leaveRoom} from "../../store/patterns/room/actions";
import '../../styles/roomControls.scss';
import {WithTranslation, withTranslation} from "react-i18next";
import {ButtonSelect} from "bbuutoonnss";

export interface RoomControlsStateProps {
    connected: string
}

export interface RoomControlsActionProps {
    createRoom(patternId: string, roomName: string)
    leaveRoom(patternId: string)
}

export interface RoomControlsOwnProps {
    patternId: string
}

export interface RoomControlsProps extends RoomControlsStateProps, RoomControlsActionProps, RoomControlsOwnProps, WithTranslation {

}

export interface RoomControlsState {

}

export interface RoomControlsProps {

}

export interface RoomControlsState {
    roomName?: string
}

export class RoomControlsComponent extends React.PureComponent<RoomControlsProps, RoomControlsState> {
    state = {
        roomName: ""
    };

    handleCreateRoom = () => {
        const {createRoom, patternId} = this.props;
        createRoom(patternId, this.state.roomName);
    };

    handleLeaveRoom = () => {
        const {leaveRoom, patternId} = this.props;
        leaveRoom(patternId);
    };

    ref;

    constructor(props) {
        super(props);

        this.ref = React.createRef();
    }

    render() {
        const {connected, t} = this.props;
        return (
            <div className={'room-controls'}>

                <InputText
                    disabled={!!connected}
                    value={this.state.roomName}
                    onChange={roomName => this.setState({roomName})}/>
                <ButtonSelect
                    disabled={!this.state.roomName}
                    selected={!!connected}
                    onClick={!!connected ? this.handleLeaveRoom : this.handleCreateRoom}>{t(connected ? 'room.leave' : 'room.enter')}</ButtonSelect>

            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<RoomControlsStateProps, RoomControlsOwnProps, AppState> = (state, {patternId}) => ({
    connected: state.patterns[patternId].room?.value?.connected
});

const mapDispatchToProps: MapDispatchToProps<RoomControlsActionProps, RoomControlsOwnProps> = {
    createRoom,
    leaveRoom
};

export const RoomControls = connect<RoomControlsStateProps, RoomControlsActionProps, RoomControlsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation("common")(RoomControlsComponent));
