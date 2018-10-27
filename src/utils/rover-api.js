class RoverApi {
  constructor(roverClientId) {
    this.socket = new WebSocket(`ws://localhost:8000/ws/realtime/${roverClientId}/`);

    // handle message
    this.socket.onmessage = (m) => {
      const message = JSON.parse(m.data);
      console.log(message);
    };
  }
}

export default RoverApi;
