import axios from "axios";
import bus from "../message-bus";

interface lightState {
    on: boolean;
    bri: number;
    hue: number;
    sat: number;
    xy: number[];
    ct: number;
}

export class Hue {
    //On no a local ip on github whatever will you do?
    private static baseURL: string = "http://10.0.0.23/api/vGeourmApBqx37QJaJUQ4AxboqUjli1Fj3LtTQdY/";
    private lights: number[] = [1, 14, 16, 19, 20, 21, 22, 23, 24, 25, 26];
    private name: string;

    constructor(name: string) {
        this.name = name;
    };

    private async getLightState(light: number) {
        let url = Hue.baseURL + "lights/" + light;
        let response: { data: { state: lightState }}  = await axios.get(url);

        return response.data.state;
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

        if (this.name !== "yonikosiner") {
           return bus.emit("irc-message", "You aint a bot get out only stream elements can do that baby");
        };

        const lightStateLocal: boolean[] = [];

        this.lights.map(async (light: number) => {
            let lightState: lightState = await this.getLightState(light);
            lightStateLocal.push(lightState.on);
        });

        for (let light of this.lights) {
            await this.turnOn(light)

            setTimeout(async () => {
                await this.turnOff(light);
            }, 3000);

        };

        lightStateLocal.map((state: boolean, index: number) => {
            if (state) {
                this.turnOn(this.lights[index]);
            } else {
                this.turnOff(this.lights[index]);
            };
        });
    };
};
