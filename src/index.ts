import IrcClient from "./irc/index";
import logChat from "./logChat";
import SystemCommand, { SystemCommands } from "./systemCommands/index";
import bus from "./message-bus";
import * as dotenv from "dotenv";
import { MessageFromYoni, YoniMessage } from "./irc/yoni-commands";

dotenv.config();

//@ts-ignore
const irc = new IrcClient("yonikosiner", process.env.TWITCH_OAUTH_TOKEN.toString());

bus.on("connected", function() {
    console.log("We are connected baby 69420 I use dvoark btw");
});

bus.on("message", function(message) {
    logChat(message);
});

bus.on("from-yoni", function(message: MessageFromYoni) {
    if (message.type === YoniMessage.ASDF) {
        const systemCommand = new SystemCommand(SystemCommands.asdf, SystemCommands.aoeu, 5000);
        systemCommand.ExecuteCommand();
    };

    if (message.type === YoniMessage.i3Workspace) {
        const systemCommand = new SystemCommand(SystemCommands.i3Workspace);
        systemCommand.ExecuteCommand();
    };

    if (message.type === YoniMessage.changeBackground) {
        const systemCommand = new SystemCommand(SystemCommands.changeWallpaper);
        systemCommand.ExecuteCommand();
    };

    if (message.type === YoniMessage.displayOff) {
        const systemCommand = new SystemCommand(SystemCommands.turnOffMonitor, SystemCommands.turnOnMonitor, 5000);
        systemCommand.ExecuteCommand();
    };
});

bus.on("asdf", function() {
    console.log("you in qwerty now mother fucker");
});

bus.on("aoeu", function() {
    console.log("back in dvoark baby");
});

bus.on("i3-workspace", function() {
    console.log("i3 workspace changed to 10");
});

bus.on("change-wallpaper", function() {
    console.log("wallpaper changed");
});

bus.on("display-off", function() {
    console.log("display off");
});

bus.on("display-on", function() {
    console.log("display on");
});
