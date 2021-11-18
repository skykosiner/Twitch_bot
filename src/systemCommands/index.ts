import bus from "../message-bus";
import { exec } from "child_process";
import { CommandType as cmd } from "../cmd";

export enum CommandType {
    //Will change my keyboard into qwerty (I use dvorak btw. It is for 3 seconds)
    asdf = 1,
    aoeu = 2,
    //Will change my i3 workspace
    i3Workspace = 3,
    //Change my wallpaper
    changeWallpaper = 4,
    //Turn off my monitor (5 seconds)
    turnOffMonitor = 5,
    turnOnMonitor = 6,
    SystemCommand = 7,
}

export type SystemCommand = {
    username: string,
    message: string,
    commandType: cmd,
};

export default class System {
    private StartCommand: CommandType;
    private EndCommand: CommandType;
    private Length: number;

    constructor(startCommand: CommandType, endCommand?: CommandType, length?: number,) {
        this.StartCommand = startCommand;
        this.EndCommand = endCommand;
        this.Length = length;
    }

    private AproveCommand(): boolean {
        if (this.StartCommand <= 0) return false;

        if (this.StartCommand >= 30) return false;

        return true;
    }

    public ExecuteCommand(): void | boolean {
        if (this.AproveCommand() === false) throw new Error("Invalid command");


        switch (this.StartCommand) {
            case CommandType.asdf:
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
            case CommandType.i3Workspace:
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
            case CommandType.changeWallpaper:
                //@ts-ignore
                let changeWallpaper;

                changeWallpaper = exec("change_background_random", (error) => {
                    if (error) {
                        throw new Error(`${error}`);
                    };
                });
                bus.emit("change-wallpaper");
            break;
            case CommandType.turnOffMonitor:
                //@ts-ignore
                let turnOffMonitor;

                turnOffMonitor = exec("xrandr --output HDMI-1 --brightness 0.05", (error) => {
                    if (error) {
                        throw new Error(`${error}`);
                    };
                });

                bus.emit("display-off");
            break;
        };

        setTimeout(() => {
            switch (this.EndCommand) {
                case CommandType.aoeu:
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
                case CommandType.turnOnMonitor:
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
