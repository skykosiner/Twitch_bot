import System from "./systemCommands";
import getStatusLine from "./statusline";
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
import statusLine from "./statusline";
import Band from "./band";
import { Ban } from "./irc/band-commands";
import { MessageFromYoni, YoniMessage } from "./irc/yoni-commands";

dotenv.config();

const systemCommands: {[key: string]: System} = {
    "asdf": new System("setxkbmap -layout us", "setxkbmap -layout real-prog-dvorak", 3000),
    "!turn off screen": new System("xrandr --output DP-4 --brightness 0.05", "xrandr --output DP-4 --brightness 1", 5000),
    "!i3 workspace": new System("i3 workspace 10", "", 0),
    "!change background": new System("change_background_random", "", 0),
};

//@ts-ignore
const irc = new IrcClient("controlmycomputerbaby", process.env.TWITCH_OAUTH_TOKEN.toString());
const tcp = new TCP(42069);

tcp.on("listening", function() {
    console.log("TCP server listening on port 42069");
});

tcp.on("close", function() {
    console.log("Client closed that connection baby");
});

tcp.on("connection", function() {
    console.log(`${getTime()}: Connection baby to that tcp girl`);
});

tcp.on("connection-error", function(e: Error | undefined) {
    console.log(`${getTime()}: Error with that tcp baby ${e}`);
});

addValidator(validateVimCommand);

interface VimMessage {
    username: string,
    message: string,
}

interface band {
    message: string
    type: Ban
}

let on: boolean = true;

bus.on("from-yoni", function(msg: MessageFromYoni) {
    if (msg.type === YoniMessage.TurnOn) {
        on = true;
    } else if (msg.type === YoniMessage.TurnOff) {
        on = false;
    } else {
        throw new Error("Unknown message type...\n" + JSON.stringify(msg));
    };
});

bus.on("band", function(data: band): void {
    let msg = data.message.substring(5).trim();
    data.message = data.message.substring(5).trim();
    if (data.type === Ban.ban) {
        new Band(tcp).addBand(msg);
        return;
    } else if (data.type === Ban.unband) {
        tcp.write(new Command().reset()
                  .setStatusLine(`${data.message} has been unbanned`)
                  .setType(CommandType.StatusUpdate).buffer
                 );
        return;
    };
});

bus.on("vim", async function(data: VimMessage): Promise<void> {
    const band = new Band(tcp);
    if (await band.isUserBand(data.username)) {
        bus.emit("irc-message", `Sorry @${data.username} your banded, you can't vim`);
        if (data.username.length > 10) {
            tcp.write(new Command().reset()
                      .setStatusLine(`Hey you are banned, you can't vim`)
                      .setType(CommandType.StatusUpdate).buffer
                     );
             return;
        };
        bus.emit("irc-message", `Sorry @${data.username} your banded, you can't vim`);
        tcp.write(new Command().reset()
            .setStatusLine(`${data.username} is banded, you can't vim`)
            .setType(CommandType.StatusUpdate).buffer
        );

        return;
    };

    let msg: string = data.message.substring(3);

    const va: SystemCommand = {
        username: data.username,
        message: msg.trim(),
        //@ts-ignore
        commandType: getType(data),
    };

    const validationResult = validate(va);

    if (!validationResult.success) {
        tcp.write(
            new Command().reset()
                .setStatusLine(validationResult.error)
                .setType(CommandType.StatusUpdate).buffer
        );

        return;
    };

    if (!on) {
        tcp.write(
            new Command().reset()
                .setStatusLine(`${data.username}: vim is turend off`)
                .setType(CommandType.StatusUpdate).buffer
        );

        return;
    };

    console.log("data", va);
    tcp.write(new Command().reset()
              .setData(getData(va))
              .setStatusLine(getStatusLine(va))
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
    //Flick my lights on and off
    new Hue(name).lightsFLICK();

    // Update status bar to thank the user
    tcp.write(new Command().reset()
         .setStatusLine(`${name}: Thank you for following`)
         .setType(CommandType.StatusUpdate).buffer
     );
});

bus.on("subscribe", function(name) {
    //Flick my lights on and off
    new Hue(name).lightsFLICK();

    // Update status bar to thank the user
    tcp.write(new Command().reset()
         .setStatusLine(`${name}: Thank you for subscribing`)
         .setType(CommandType.StatusUpdate).buffer
     );
});

bus.on("system-command", function(command: string, message: SystemCommand) {
    if (command !== "") {
        console.log("Command", command);
    }

    if (!on) {
        tcp.write(
            new Command().reset()
            .setStatusLine(`${message.username}: system-commands our turend off`)
                .setType(CommandType.StatusUpdate).buffer
        );

        return;
    };

    tcp.write(new Command().reset()
          .setData(Buffer.from(`silent! !${command}`))
          .setStatusLine(statusLine(message))
          .setType(getType(message)).buffer
     );
});

bus.on("start-sys", async function(data: SystemCommand): Promise<void> {
    const band = new Band(tcp);
    if (await band.isUserBand(data.username)) {
        if (data.username.length > 10) {
            bus.emit("irc-message", `Sorry @${data.username} your banded, you can't control my computer baby`);
            tcp.write(new Command().reset()
                      .setStatusLine(`Hey you are banned, you can't do that`)
                      .setType(CommandType.StatusUpdate).buffer
                     );
             return;
        };
        bus.emit("irc-message", `Sorry @${data.username} your band, you can't do that`);
        tcp.write(new Command().reset()
            .setStatusLine(`${data.username} is band`)
            .setType(CommandType.StatusUpdate).buffer
        );

        return;
    };

    console.log("systemCommands", data);
    const validationResult = validate(data);

    //This will let set the status line to the error message
    if (!validationResult.success) {
        tcp.write(new Command().reset()
            .setStatusLine(validationResult.error)
            .setType(CommandType.StatusUpdate).buffer
        );
    }

    const type = getType(data);

    if (type === CommandType.SystemCommand && systemCommands[data.message]) {
        systemCommands[data.message].add(data);
    } else {
        throw new Error(`Invalid command. How the fuck did that even happen?\nThat command should not have been emited to the server...\n${data.message}`);
    };
});
