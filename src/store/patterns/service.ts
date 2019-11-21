import * as io from "socket.io-client";

const API_URL = "http://localhost:3000";

export const createRoom_s = (name) => {
    const socket = io("http://localhost:3000", {
        path: '/room',
        query: {name}
    });
    return socket;
};