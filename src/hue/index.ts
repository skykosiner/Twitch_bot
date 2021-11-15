import axios from "axios";
import bus from "../message-bus";

//interface lightState {
    //on: boolean;
    //bri: number;
    //hue: number;
    //sat: number;
    //xy: number[];
    //ct: number;
//}

//TODO: add a way to get the current state of the light and change back to that
//state after turn on and off

export class Hue {
    //On no a local ip on github whatever will you do?
    private static baseURL: string = "http://10.0.0.23/api/vGeourmApBqx37QJaJUQ4AxboqUjli1Fj3LtTQdY/";
    private lights: number[] = [1, 14, 16, 19, 20, 21, 22, 23, 24, 25, 26];
    private name: string;

    constructor(name: string) {
        this.name = name;
    };

    private async turnOn(light: number): Promise<any> {
        return await axios.put(Hue.baseURL + "lights/" + light + "/state", {
            on: true
        });
    };

    private async turnOff(light: number): Promise<any> {
        return await axios.put(Hue.baseURL + "lights/" + light + "/state", {
            on: false
        });
    };

    public async lightsFLICk(): Promise<boolean | void> {

        if (this.name !== "StreamElements") {
           return bus.emit("irc-message", "You aint a bot get out only stream elements can do that baby");
        };

        for (let light of this.lights) {
            await this.turnOn(light)

            setTimeout(async () => {
                await this.turnOff(light);
                setTimeout(async () => {
                    await this.turnOn(light);
                }, 3000);
            }, 3000);
        };
    };
};
