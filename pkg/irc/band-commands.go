package irc

import (
	"strings"
)

type Key struct {
    X string
}

func BanCommands(Msg IrcMessage, channel chan IrcMessage) {
    m := map[Key]MessageType{}
    m[Key{"!band"}] = Ban
    m[Key{"!unband"}] = Unban

    banType := m[Key{strings.Fields(Msg.Message)[0]}]
    Msg.Type = MessageType(banType)


    go func() {
        if Msg.Type == Ban || Msg.Type == Unban {
            channel <- Msg
        }
    }()
}
