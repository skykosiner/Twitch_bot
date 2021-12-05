import Band from "./band";
import bus from "./message-bus";

export interface BandI {
    band: boolean,
    message: string,
};

export default async function isBand(username: string): Promise<BandI> {
    const band = new Band();
    if (await band.isUserBand(username)) {
        bus.emit("irc-message", `@${username} you are band. Get out.`);
        return {
            band: true,
            message: `${username} is a band`,
        };
    };

    return {
        band: false,
        message: ``,
    };
}
