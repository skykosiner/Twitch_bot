import tmi from 'tmi.js';
import dotenv from 'dotenv';
import { logChat } from './utils/logChat';
import { Hue } from './utils/hue';

dotenv.config();

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: "yonikosiner",
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: ["yonikosiner"]
});

client.connect();

//@ts-ignore
client.on('message', (channel, tags, message, self) => {
  // Ignore echoed messages.
  if(self) return;

  logChat(`${tags.username}`, message);

  if (message.includes('Thank you for following')) {
      const hue = new Hue(`${tags.username}`);

      hue.lightsFLICk();
  }
});

client.on('connected', (address, port) => {
  console.log(`Connected to ${address}:${port}`);
});
