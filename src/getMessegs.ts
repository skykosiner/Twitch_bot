/* interface chat {
    name: string,
    message: string,
}; */

export class messges {
    // public messegs: chat[];

    public connectToChat(): void {
        const ws = new WebSocket("localhost:5000/ws")

        ws.onmessage = (event) => {
            console.log(event.data);
        }
    }
};
