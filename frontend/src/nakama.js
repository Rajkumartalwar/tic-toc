import { Client } from "@heroiclabs/nakama-js";

const client = new Client("defaultkey", "YOUR_SERVER_IP", "7350");

export async function initSocket() {
  const session = await client.authenticateDevice(
    Date.now().toString()
  );

  const socket = client.createSocket();
  await socket.connect(session);

  return socket;
}

export { client };
