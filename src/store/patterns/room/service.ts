import * as io from "socket.io-client";


export const createRoom_s = (name) => {
    const socket = io("http://localhost:3002", {
        path: '/room',
        query: {name}
    });
    return socket;
};