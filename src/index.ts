import IrcClient from "./irc/index";
import logChat from "./logChat";
import SystemCommand, { SystemCommands } from "./systemCommands/index";
import bus from "./message-bus";
import * as dotenv from "dotenv";
import { MessageFromYoni, YoniMessage } from "./irc/yoni-commands";
import { Hue } from "./hue/index";

dotenv.config();

//@ts-ignore
const irc = new IrcClient("controlmycomputerbaby", process.env.TWITCH_OAUTH_TOKEN.toString());

bus.on("connected", function() {
    console.log("We are connected baby 69420 I use dvoark btw");
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

bus.on("from-yoni", function(message: MessageFromYoni) {
    if (message.type === YoniMessage.ASDF) {
        const systemCommand = new SystemCommand(SystemCommands.asdf, SystemCommands.aoeu, 3000);
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

function getTime() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

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
