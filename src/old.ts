import tmi from 'tmi.js';
import dotenv from "dotenv";

dotenv.config();

// Define configuration options
const opts = {
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_PASSWORD,
  },
  connection: {
      secure: true,
      reconnect: true
  },
  channels: [
      "yonikosiner" ]
};

// Create a client with our options
const client = new tmi.client(opts)

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
//@ts-ignore
function onMessageHandler (target: any, context: any, msg: any, self: any) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
//@ts-ignore
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
