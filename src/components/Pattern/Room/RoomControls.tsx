import * as React from "react";
import * as cn from 'classnames';
import {InputText} from "../../_shared/inputs/InputText";
import {Button} from "../../_shared/buttons/simple/Button";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";
import {createRoom, leaveRoom, setDrawer} from "../../../store/patterns/room/actions";
import './roomControls.scss';
import {WithTranslation, withTranslation} from "react-i18next";
import {Chat} from "./Chat";

export interface RoomControlsStateProps {
    connected: string
    drawer: string
    meDrawer: boolean
    members: number
}

export interface RoomControlsActionProps {
    createRoom(patternId: string, roomName: string)

    leaveRoom(patternId: string)

    setDrawer(patternId: string)
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
        roomName: "",
    };

    handleCreateRoom = () => {
        const {createRoom, patternId} = this.props;
        createRoom(patternId, this.state.roomName);
    };

    handleLeaveRoom = () => {
        const {leaveRoom, patternId} = this.props;
        leaveRoom(patternId);
    };

    handleSetDrawer = () => {
        const {setDrawer, patternId} = this.props;
        setDrawer(patternId);
    };

    passInputRef;

    constructor(props) {
        super(props);

        this.passInputRef = React.createRef();
    }

    componentDidMount() {
        setTimeout(this.passInputRef.current.focus, 0);
    }

    componentWillUnmount() {
        this.handleLeaveRoom();
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter' && this.state.roomName) {
            this.handleCreateRoom();
        }
    }

    render() {
        const {connected, t, patternId, drawer, meDrawer, members} = this.props;
        return (
            <div className={cn('room-controls', {
                ['me-drawer']: meDrawer
            })}>
                {connected && (<>
                    <Chat
                        patternId={patternId}
                    />
                </>)}
                <div className={'room-enter'}>
                    {!connected ? (<>
                        <InputText
                            ref={this.passInputRef}
                            disabled={!!connected}
                            value={this.state.roomName}
                            onKeyPress={this.handleKeyPress}
                            onChange={roomName => this.setState({roomName})}/>
                        <Button
                            disabled={!this.state.roomName}
                            onClick={this.handleCreateRoom}
                        >{t('room.enter')}</Button>
                    </>) : (<>

                        <div
                            className={'room-name'}>
                            <span>{this.state.roomName}</span> {members ? <small>({members})</small> : ''}
                        </div>
                        <Button
                            className={'room-delete'}
                            disabled={!this.state.roomName}
                            onDoubleClick={this.handleLeaveRoom}
                        >{t('room.leave')}</Button>
                    </>)}
                </div>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<RoomControlsStateProps, RoomControlsOwnProps, AppState> = (state, {patternId}) => ({
    connected: state.patterns[patternId].room?.value?.connected,
    drawer: state.patterns[patternId].room?.value?.drawer,
    meDrawer: state.patterns[patternId].room?.value?.meDrawer,
    members: state.patterns[patternId].room?.value?.members,
});

const mapDispatchToProps: MapDispatchToProps<RoomControlsActionProps, RoomControlsOwnProps> = {
    createRoom,
    leaveRoom,
    setDrawer
};

export const RoomControls = connect<RoomControlsStateProps, RoomControlsActionProps, RoomControlsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation("common")(RoomControlsComponent));