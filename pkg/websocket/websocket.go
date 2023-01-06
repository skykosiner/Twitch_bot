package websocket

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Ws struct {
	Broadcast chan string
	Clients   map[*websocket.Conn]bool
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (ws *Ws) NewChatMessage(message string) {
	for client := range ws.Clients {
		err := client.WriteMessage(websocket.TextMessage, []byte(message))

		if err != nil {
			log.Fatal("error sending message to client")
			client.Close()
			delete(ws.Clients, client)
		}
	}
}

func (ws *Ws) Server() {
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil) // error ignored for sake of simplicity

		if err != nil {
			log.Print("Error during connection upgradation:", err)
			delete(ws.Clients, conn)
			return
		}

		defer conn.Close()

		ws.Clients[conn] = true

		for {
			// Read message from browser
			msgType, msg, err := conn.ReadMessage()
			if err != nil {
				return
			}

			// Print the message to the console
			fmt.Printf("%s sent: %s\n", conn.RemoteAddr(), string(msg))

			for client := range ws.Clients {
				err := client.WriteMessage(msgType, msg)

				if err != nil {
					log.Fatal("error sending message to client")
					client.Close()
					delete(ws.Clients, client)
				}
			}
			go func() {
				for msg := range ws.Broadcast {
					ws.NewChatMessage(msg)
				}
			}()
		}
	})

	log.Println("websocket server running on port 42069")
	http.ListenAndServe(":42069", nil)
}
