import IrcClient from "./irc/index";
import bus from "./message-bus";
import * as dotenv from "dotenv";
import { MessageFromYoni, YoniMessage } from "./irc/yoni-commands";

dotenv.config();

//@ts-ignore
const irc = new IrcClient("yonikosiner", process.env.TWITCH_OAUTH_TOKEN.toString());

bus.on("connected", function() {
    console.log("On Connected baybee");
});

bus.on("from-yoni", function(message: MessageFromYoni) {
    if (message.type === YoniMessage.StartYourEngines) {
        irc.sendMessage("!start");
    }
});

