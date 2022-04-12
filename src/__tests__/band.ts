import Band from "../band";

describe("Band", function() {
    it("Should add a new band to the file and the array should be the same as the file", async function() {
        const band = new Band();

        await band.addBand("e");

        expect(["e"]).toEqual(band.banded);
    });
    it("Should not let the user e continue", async function(): Promise<boolean | void> {
        const band = new Band();
        await band.getBandFile();

        let enter: boolean;

        if (band.isUserBand("e")) return enter = false;

        expect(enter).toEqual(false);
    });

    it("Should let the user bob continue", async function(): Promise<void | boolean> {
        const band = new Band();
        await band.getBandFile();

        let enter: Boolean;

        if (band.isUserBand("bob")) return enter = false;

        enter = true;

        expect(enter).toEqual(true);
    });
    it("Allow the array to have more then one band", async function(): Promise<void | boolean> {
        const band = new Band();
        await band.addBand("Jeff");

        expect(["e", "Jeff"]).toEqual(band.banded);
    });
})
