import io from "socket.io-client";


class SocketService {
  constructor() {
    this.socket = null;
    this.messageCallback = null;
    this.isConnected = false;
    this.ongoingGptResponseEndedCallBack = null;
    this.timeStamp = null;
  }

  setCallback(callback) {
    this.messageCallback = callback;
  }

  setOngoingGptResponseEndedCallBack(callback){
    this.ongoingGptResponseEndedCallBack = callback;
  }

  connect(socketUrl) {
    const socket = io(socketUrl, {
        transports: ["websocket"],
        cors: {
          origin: 'http://localhost:3000/',
        },
        autoConnect: false,
        forceNew:false,
        reconnectionAttempts: 1
    });

    // Connecting the socket
    socket.connect();

    // Connection opened
    socket.io.on("error", (error) => {
        console.log(error);
    });

    // Connection related
    socket.on('connect', () => {
        console.log('WebSocket connected:');
        this.isConnected = true;
    });
    socket.on('isConnected', (val) => {
        this.isConnected = Boolean(val)
        console.log('Is connected : ', val);
    });

    // receiving the chatgpt response
    socket.on('gptResponse', (msg) => {
        if (this.messageCallback) {
            this.messageCallback(msg);
        }
    });

    socket.on('ongoingGptResponseEnded', (msg) => {
        console.log(msg);
        if (this.ongoingGptResponseEndedCallBack) {
            this.ongoingGptResponseEndedCallBack(msg);
        }
    });

    // Connection issue
    socket.io.on("connect_error", (error) => {
        this.isConnected = false;
        console.log(error)
    });
    
    socket.io.on("reconnect_attempt", (attempt) => {
        console.log(attempt);
    });

    // Disconnect
    socket.on("disconnect", (reason) => {
        this.isConnected = false;
        console.log(reason)
        if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
          this.socket.connect();
          console.log("IO Server Disconnect error. RETRYING !")
        }
        // else the socket will automatically try to reconnect
    });

    this.socket=socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  sendMessage(message) {
    if (this.socket && this.socket.connected) {
        this.timeStamp = new Date();
        this.socket.emit('requestToFlask', message);
    } else {
      console.error('WebSocket not open. Unable to send message.');
    }
  }

  getTimeStamp(){
    return this.timeStamp;
  }
}

export default new SocketService();
