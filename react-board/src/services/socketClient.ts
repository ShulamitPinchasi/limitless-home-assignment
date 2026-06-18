import { ClientEvent, ServerEvent } from "../interfaces/events";

class SocketClient {
  private socket: WebSocket | null = null;
  WS_URL = import.meta.env.VITE_WS_URL;

  connect(onMessage: (event: ServerEvent) => void, onOpen?: () => void) {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    this.socket = new WebSocket(this.WS_URL);

    this.socket.onopen = () => {
      console.log("WebSocket connected");
      onOpen?.();
    };

    this.socket.onmessage = (message) => {
      const event = JSON.parse(message.data) as ServerEvent;
      onMessage(event);
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected");
      this.socket = null;
    };
  }

  send(event: ClientEvent) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    this.socket.send(JSON.stringify(event));
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const socketClient = new SocketClient();
