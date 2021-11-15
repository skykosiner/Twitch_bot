import { EventEmitter } from "events";
import bus from "../message-bus";
import Commands, { MessageFromYoni } from "./yoni-commands";

import * as tmi from "tmi.js";

enum IrcState {
    Waiting = 1,
    Connected = 2,
    Errored = 3
};

export type IrcTags = {
    "display-name": string;
}

type Emitter = (emitter: EventEmitter, tags: IrcTags, message: string) => void;

interface IrcClient extends EventEmitter {
    on(event: "from-yoni", cb: (message: MessageFromYoni) => void): this;
}

const channel = "#yonikosiner";

export default class IrcClientImpl extends EventEmitter implements IrcClient {
    private client: tmi.Client;
    private state: IrcState;
    private emitters: Emitter[];

    constructor(username: string, password: string) {
        super();
        this.state = IrcState.Waiting;
        this.emitters = [
            Commands,
        ];

        this.client = new tmi.Client({
            connection: {
                reconnect: true,
                secure: true
            },
            identity: {
                username: username,
                password: password,
            },
            channels: [ channel ]
        });

        this.client.connect().then(() => {
            this.state = IrcState.Connected;
            bus.emit("connected");
        }).catch((e: Error) => {
            this.state = IrcState.Errored;
            console.log("IRC Failed", e);
            bus.emit("error", e);
        });

        //@ts-ignore
        this.client.on("message", (channel, tags, message, self) => {
            bus.emit("message", `${tags.username}: ${message}`);
        });

        bus.on("irc-message", (msg: string) => {
            console.log("IRC#irc-message", msg);
            this.say(msg);
        });

        this.client.on("message", (_: string, tags: IrcTags, message: string) => {
            this.emitters.forEach(e => e(bus, tags, message));
        });
    }

    say(str: string): void {
        if (this.state === IrcState.Waiting) {
            console.log("Unable to send", str);
            return;
        } else if (this.state === IrcState.Errored) {
            throw new Error("Cannot send messages, IRC errored.");
        }

        console.log("IRC#say", str);
        this.client.say(channel, str);
    }

    registerEmitter(emitter: Emitter): void {
        this.emitters.push(emitter);
    }
}

