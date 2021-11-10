import axios from "axios";

//TODO: check lights satte befor executing then after executing set it back to
//that state

//TODO: change this to a class make sure it only runs if stream elements says
//thank you for following

const url = "http://10.0.0.23/api/vGeourmApBqx37QJaJUQ4AxboqUjli1Fj3LtTQdY/";

async function turnOn(light: number): Promise<object> {
    return await axios.put(url + "lights/" + light + "/state", { on: true });
};

async function turnOff(light: number): Promise<object> {
    return await axios.put(url + "lights/" + light + "/state", { on: false });
};

//List of lights that I want to control by there id
const lights: number[] = [1, 14, 16, 19, 20, 21, 22, 23, 24, 25, 26]

export default function runHue() {
    lights.forEach(async (light) => {
        turnOn(light);
        setTimeout(() => {
            turnOff(light);
            setTimeout(() => {
                turnOn(light);
            }, 3000);
        }, 2000);
    });
};
