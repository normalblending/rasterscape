import * as io from "socket.io-client";


export const connectRooms = () => {
    const socket = io("http://localhost:3002", {
        path: '/rooms',
    });
    return socket;
};