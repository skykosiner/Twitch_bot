import { appendFile, readFile, readFileSync, writeFileSync } from "fs";
import bus from "./message-bus";

export default class Band {
    public banded: string[] = []

    public async addBand(username: string): Promise<boolean | void> {
        await this.getBandFile();
        if(this.banded.includes(username)) return bus.emit("irc-message", "The user is allready band");

        this.banded.push(username);

        appendFile("./band-users.txt", `${username}\n`, function(err) {
            if (err) throw err;
            return;
       })
    };

    public async removeBand(username: string): Promise<boolean | void> {
        await this.getBandFile();

        const data = readFileSync("./band-users.txt", 'utf-8');
        const ip = username

        const newValue = data.replace(new RegExp(ip), '');
        writeFileSync("./band-users.txt", newValue, 'utf-8');

        const con = "\n";
        username = username.concat(con);

        let filterBand = this.banded.filter(function (currentElement) {
            return currentElement !== username;
        });

        this.banded.concat(filterBand);


        console.log(this.banded);

    };

    public async isUserBand(username: string): Promise<boolean> {
        await this.getBandFile();
        const con = "\n";
        username = username.concat(con);
        return this.banded.includes(username);
    }

    public getBandFile() {
        return new Promise((res, rej) => {
            readFile("./band-users.txt", (err: Error | undefined, data: Buffer) => {
                if (err) {
                    console.log(err);
                    rej(err);
                } else {
                    const arr = data.toString().split("\n")
                    for (const a in arr) {
                        if (arr[a] !== "") this.banded.push(arr[a]);
                    };
                    res(null);
                }
            });
        });
    }
};
