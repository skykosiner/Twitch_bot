import System from "./systemCommands";
import { SystemCommand } from "cmd";
import * as dotenv from "dotenv";
import TCP from "./tcp";
import getTime from "./get-time";
import bus from "./message-bus";
import validateVimCommand from "./vim-commands"
import validate, { addValidator } from "./validation";
import logChat from "./logChat";
import { Hue } from "./hue";
import Command, { CommandType } from "./cmd";
import getType from "./get-type";
import IrcClient from "./irc";
import getData from "./get-data";

dotenv.config();

const systemCommands: {[key: string]: System} = {
    "asdf": new System("setxkbmap -layout us", "setxkbmap -layout real-prog-dvorak", 3000),
    "!turn off screen": new System("xrandr --output HDMI-1 --brightness 0.05", "xrandr --output HDMI-1 --brightness 1", 5000),
    "!i3 workspace": new System("i3 workspace 10", null, null),
    "!change background": new System("change_background_random", null, null),
};

//@ts-ignore
const irc = new IrcClient("controlmycomputerbaby", process.env.TWITCH_OAUTH_TOKEN.toString());
const tcp = new TCP(42069);

tcp.on("listening", function() {
    console.log("TCP server listening on port 42069");
});

tcp.on("connection", function() {
    console.log(`${getTime()} connection baby to that tcp girl`);
});

addValidator(validateVimCommand);

interface VimMessage {
    username: string,
    message: string,
}

bus.on("vim", function(data: VimMessage): boolean | void {
    let msg: string = data.message.substring(3);

    const va: SystemCommand = {
        username: data.username,
        message: msg.trim(),
        //@ts-ignore
        commandType: getType(data),
    };

    const validationResult = validate(va);

    if (!validationResult.success) return console.log("error", validationResult.error);

    console.log("data", va);
    tcp.write(new Command().reset()
              .setData(getData(va))
              .setStatusLine(`${data.username} has done ${data.message} into vim`)
              .setType(getType(va)).buffer
             );
});

bus.on("connected", function() {
    console.log("We are connected baby 69420 I use dvorak btw");
});

bus.on("error", function(err) {
    console.log("There was a error girl", err);
});

bus.on("message", function(message) {
    logChat(message);
});

bus.on("follow", function(name) {
    const hue = new Hue(name);

    hue.lightsFLICk();
});

bus.on("system-command", function(command: string, message: SystemCommand) {
    console.log("System command", command);

    tcp.write(new Command().reset()
          .setData(Buffer.from(`silent! !${command}`))
          .setStatusLine(`it worked baby ${command}`)
          .setType(getType(message)).buffer
     );
});

bus.on("start-sys", function(data: SystemCommand): void {
    console.log("systemCommands", data);
    const validationResult = validate(data);

    if (!validationResult.success) {
        tcp.write(new Command().reset()
            .setStatusLine(validationResult.error)
            .setType(CommandType.StatusUpdate).buffer
        );
    }

    const type = getType(data);

    if (type === CommandType.SystemCommand && systemCommands[data.message] ||
        type === CommandType.asdf && systemCommands[data.message] || type ===
            CommandType.xrandr && systemCommands[data.message]) {
        console.log(`${systemCommands[data.message]}`);
        systemCommands[data.message].add(data);
    }
});
