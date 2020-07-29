import * as io from "socket.io-client";

export const createRoom_s = (name) => {
    const socket = io("http://localhost:3000", {
    // const socket = io("/", {
        path: '/room',
        query: {name}
    });
    return socket;
};