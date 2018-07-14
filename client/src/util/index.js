import openSocket from 'socket.io-client';

export const socket = openSocket('http://localhost:8000', {autoConnect: false});

// let instance = null;

// export default class Socket {
//     static socket;
//     constructor() {
//         if(this.socket) {
//             return this.socket;
//         }
//         this.socket = openSocket('http://localhost:8000');
//     }
// }