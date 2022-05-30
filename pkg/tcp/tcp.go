package tcp

import (
	"log"
	"net"
	"os"
)

const (
	HOST = "localhost"
	PORT = "42069"
	TYPE = "tcp"
)

type Server struct {
	Connections []net.Conn
}

func (s *Server) Start() *Server {
	listen, err := net.Listen(TYPE, HOST+":"+PORT)

	if err != nil {
		log.Fatal(err)
		os.Exit(1)
	}

	for {
		conn, err := listen.Accept()

		if err != nil {
			log.Fatal("Error accepting tcp connection `tcp.go`", err)
			os.Exit(1)
		}

		s.Connections = append(s.Connections, conn)

		return s
	}
}

func (s *Server) Write(data []byte) {
	for _, connection := range s.Connections {
        connection.Write([]byte(data))
		/* code, err := connection.Write([]byte(data))

		if err != nil {
			log.Fatal("There was an error `tcp.go`", err)
		}

		log.Println("code", code) */
	}
}
