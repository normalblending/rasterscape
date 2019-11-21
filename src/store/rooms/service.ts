import * as io from "socket.io-client";

const API_URL = "http://localhost:3000";

export const connectRooms = () => {
    const socket = io("http://localhost:3000", {
        path: '/rooms',
    });
    return socket;
};