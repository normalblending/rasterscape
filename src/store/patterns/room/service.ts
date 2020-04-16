import * as io from "socket.io-client";


export const createRoom_s = (name) => {
    // const socket = io("http://64.227.78.194:3000", {
    const socket = io("/", {
        path: '/room',
        query: {name}
    });
    return socket;
};