import React from "react";

function App() {
    const messages: string[] = [];
    const [msgs, setMsg] = React.useState(messages as string[]);
    const ws = new WebSocket("ws://localhost:42069/ws");

    ws.onmessage = (event) => {
        if (msgs.includes(event.data)) {
            setMsg((messages) => [...messages, event.data])
        }
    };

    ws.onopen = () => {
        console.log("Opening a connection...");
    };

    ws.onclose = () => {
        console.log("Websocket clossed :(");
    };

    ws.onerror = (event) => {
        console.log("ERR: ", event);
    };

    console.log("msg", msgs);

    return (
        <div className="App">
            {msgs.map((msg, index) => {
                return (
                    <p key={index}>{msg}</p>
                )
            })}
        </div>
    );
};

export default App;
