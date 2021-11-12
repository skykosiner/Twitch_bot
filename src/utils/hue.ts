import axios from "axios";

//TODO: check lights satte befor executing then after executing set it back to
//that state

//TODO: change this to a class make sure it only runs if stream elements says
//thank you for following

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

    private async getOneLightState(light: number) {
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

    public async lightsFLICk(): Promise<string | void> {

        if (this.name !== "streamelements") {
            return "Sorry you can't do that";
        };

        const lightStateLocal: boolean[] = [];

        this.lights.map(async (light: number) => {
            let lightState: lightState = await this.getOneLightState(light);
            lightStateLocal.push(lightState.on);
        });

        console.log("Light state should be emptey", lightStateLocal);

        for (let light of this.lights) {
            await this.turnOn(light)

            setTimeout(async () => {
                await this.turnOff(light);
            }, 3000);

        };

        lightStateLocal.map((state: boolean, index: number) => {
            console.log("light state should be full with values", state);
            if (state) {
                this.turnOn(this.lights[index]);
            } else {
                this.turnOff(this.lights[index]);
            };
        });

        //lightStateLocal.map(async (lightState) => {
            //if (lightState === true) {
                //await this.turnOn(light);
            //} else {
                //await this.turnOff(light);
            //};
        //});
    };
};


function test(): void {
    let hue = new Hue("streamelements");
    hue.lightsFLICk();
};

test();
