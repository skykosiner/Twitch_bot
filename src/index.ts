import IrcClient from "./irc/index";
import logChat from "./logChat";
import TCP from "./tcp";
import getData from "./get-data";
import SystemCommand, { CommandType, SystemCommand as sys } from "./systemCommands/index";
import validateVimCommand from "./vim-commands"
import validate, { addValidator } from "./validation";
import bus from "./message-bus";
import * as dotenv from "dotenv";
import { MessageFromYoni, YoniMessage } from "./irc/yoni-commands";
import { Hue } from "./hue";
import Command, { CommandType as cmdT } from "./cmd";
import getType from "./get-type";

dotenv.config();

function getTime(): string {
    const date: Date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

//@ts-ignore
const irc = new IrcClient("controlmycomputerbaby", process.env.TWITCH_OAUTH_TOKEN.toString());
const tcp = new TCP(42069);

tcp.on("listening", function() {
    console.log("TCP server listening on port 42069");
});

tcp.on("connection", function() {
    console.log(`${getTime()} connection baby to that tcp girl`);
});

interface VimMessage {
    username: string,
    message: string,
}

addValidator(validateVimCommand);

bus.on("vim after", function(data: VimMessage): boolean | void {
    let msg: string = data.message.substring(3);

    const va: sys = {
        username: data.username,
        message: msg.trim(),
        //@ts-ignore
        commandType: cmdT.VimAfter,
    };

    const validationResult = validate(va);

    if (!validationResult.success) return console.log("error", validationResult.error);

    console.log("data", va);
    tcp.write(new Command().reset()
              .setData(getData(va))
              .setType(getType(va)).buffer
             );
});

bus.on("vim insert", function(data: VimMessage) {
    const msg: string = data.message.substring(3);
    const vi: sys = {
        username: data.username,
        message: msg.trim(),
        //@ts-ignore
        commandType: cmdT.VimInsert,
    };

    const validationResult = validate(vi);

    if (!validationResult.success) return console.log("error", validationResult.error);

    console.log("data", vi);
    tcp.write(new Command().reset()
              .setData(getData(vi))
              .setType(getType(vi)).buffer
             );
});

bus.on("vim command", function(data: VimMessage) {
    const msg: string = data.message.substring(3);
    const vc: sys = {
        username: data.username,
        message: msg.trim(),
        //@ts-ignore
        commandType: cmdT.VimCommand,
    };

    const validationResult = validate(vc);

    if (!validationResult.success) return console.log("error", validationResult.error);

    console.log("data", vc);
    tcp.write(new Command().reset()
              .setData(getData(vc))
              .setType(getType(vc)).buffer
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


let lastCommand: boolean = false;

bus.on("from-yoni", function(message: MessageFromYoni): boolean | void {
    if (lastCommand) {
        bus.emit("irc-message", "Sorry you must wait 10 seconds inbetween commands");
        setTimeout(() => {
            lastCommand = false;
        }, 10000);
    }

    lastCommand = true;

    console.log(lastCommand);

    if (message.type === YoniMessage.ASDF) {
        const systemCommand = new SystemCommand(CommandType.asdf, CommandType.aoeu, 3000);
        systemCommand.ExecuteCommand();
    };

    if (message.type === YoniMessage.i3Workspace) {
        const systemCommand = new SystemCommand(CommandType.i3Workspace);
        systemCommand.ExecuteCommand();
    };

    if (message.type === YoniMessage.changeBackground) {
        const systemCommand = new SystemCommand(CommandType.changeWallpaper);
        systemCommand.ExecuteCommand();
    };

    if (message.type === YoniMessage.displayOff) {
        const systemCommand = new SystemCommand(CommandType.turnOffMonitor, CommandType.turnOnMonitor, 5000);
        systemCommand.ExecuteCommand();
    };
});


bus.on("asdf", function() {
    console.log(`${getTime()} you in qwerty now mother fucker`);
});

bus.on("aoeu", function() {
    console.log(`${getTime()} back in dvoark baby`);
});

bus.on("i3-workspace", function() {
    console.log(`${getTime()} i3 workspace changed to 10`);
});

bus.on("change-wallpaper", function() {
    console.log(`${getTime()} wallpaper changed`);
});

bus.on("display-off", function() {
    console.log(`${getTime()} display off how can you see me? you should not see me!`);
});

bus.on("display-on", function() {
    console.log(`${getTime()} display on ignore him ^ he was being rude`);
});
