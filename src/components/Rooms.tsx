import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../store";
import {Room} from "../store/rooms/reducer";
import {Button} from "./_shared/Button";
import {roomsConnect} from "../store/rooms/actions";

export interface RoomsStateProps {
    rooms: Room[]
}

export interface RoomsActionProps {
    roomsConnect()
}

export interface RoomsOwnProps {

}

export interface RoomsProps extends RoomsStateProps, RoomsActionProps, RoomsOwnProps {

}

export interface RoomsState {

}

class RoomsComponent extends React.PureComponent<RoomsProps, RoomsState> {

    componentDidMount() {
        this.props.roomsConnect();
    }

    handleRoomConnect = room => {
        console.log(room);
    };

    render() {
        const {rooms} = this.props;
        return (
            <>
                {rooms.map(room =>
                    <Button onClick={this.handleRoomConnect} value={room}>{room.name}</Button>
                )}
            </>
        );
    }
}

const mapStateToProps: MapStateToProps<RoomsStateProps, RoomsOwnProps, AppState> = state => ({
    rooms: state.rooms.rooms
});

const mapDispatchToProps: MapDispatchToProps<RoomsActionProps, RoomsOwnProps> = {
    roomsConnect
};

export const Rooms = connect<RoomsStateProps, RoomsActionProps, RoomsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(RoomsComponent);