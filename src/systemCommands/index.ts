import bus from "../message-bus";
import { exec } from "child_process";

export enum SystemCommands {
    //Will change my keyboard into qwerty (I use dvorak btw. It is for 5 seconds)
    "asdf" = 1,
    "aoeu" = 2,
    //Will change my i3 workspace
    "i3Workspace" = 3,
    //Change my wallpaper
    "changeWallpaper" = 4,
    //Turn off my monitor (5 seconds)
    "turnOffMonitor" = 5,
    "turnOnMonitor" = 6,
}

export default class System {
    private StartCommand: SystemCommands;
    private EndCommand: SystemCommands;
    private Length: number;

    constructor(startCommand: SystemCommands, endCommand?: SystemCommands, length?: number,) {
        this.StartCommand = startCommand;
        this.EndCommand = endCommand;
        this.Length = length;
    }

    private lastComanndTime(): boolean {
        let lastTime = 0;

        const timeSinceLastFetch = Date.now() - lastTime;
        if (timeSinceLastFetch <= 60000) return false;

        return true;
    }

    private AproveCommand(): boolean {
        if (this.StartCommand <= 0) return false;

        if (this.StartCommand >= 30) return false;

        return true;
    }

    public ExecuteCommand(): void | boolean {
        if (this.AproveCommand() === false) throw new Error("Invalid command");
        if (this.lastComanndTime() === false) return bus.emit("irc-message", "You can only run a command every 1 minute");
        switch (this.StartCommand) {
            case SystemCommands.asdf:
                //@ts-ignore
                //Turn that bad boy into qwerty
                let asdf;
                asdf = exec("setxkbmap -layout us", (error) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        throw new Error(`${error}`);
                    };
                });
                bus.emit("asdf");
                break;
            case SystemCommands.i3Workspace:
                //@ts-ignore
                //Change my workspace to 10 as I don't ever use 10
                let i3;

                i3 = exec("i3 workspace 10", (error) => {
                    if (error) {
                        throw new Error(`${error}`);
                    };
                });
                bus.emit("i3-workspace");
            break;
            case SystemCommands.changeWallpaper:
                //@ts-ignore
                let changeWallpaper;

                changeWallpaper = exec("change_background_random", (error) => {
                    if (error) {
                        throw new Error(`${error}`);
                    };
                });
                bus.emit("change-wallpaper");
            break;
            case SystemCommands.turnOffMonitor:
                //@ts-ignore
                let turnOffMonitor;

                turnOffMonitor = exec("xrandr --output HDMI-1 --brightness 0", (error) => {
                    if (error) {
                        throw new Error(`${error}`);
                    };
                });

                bus.emit("display-off");
            break;
        };

        setTimeout(() => {
            switch (this.EndCommand) {
                case SystemCommands.aoeu:
                    //@ts-ignore
                    //Back into dvorak baby
                    let child;
                    child =  exec("setxkbmap -layout real-prog-dvorak", (error) => {
                        if (error) {
                            throw new Error(`${error}`);
                        };
                    });
                    bus.emit("aoeu");
                break;
                case SystemCommands.turnOnMonitor:
                    //@ts-ignore
                    let turnOnMonitor;

                    turnOnMonitor = exec("xrandr --output HDMI-1 --brightness 1", (error) => {
                        if (error) {
                            throw new Error(`${error}`);
                        };
                    });

                    bus.emit("display-on");
                break;
            };
        }, this.Length);
    };
};
