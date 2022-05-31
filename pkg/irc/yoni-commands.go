package irc

import (
	"strings"
)

func YoniCommands(Msg IrcMessage, channel chan IrcMessage) {
    if Msg.Name != "yonikosiner" {
        return
    }

    m := map[Key]MessageType{}
    m[Key{"!enable"}] = TurnOn
    m[Key{"!disable"}] = TurnOff

    yoniMessage := m[Key{strings.Fields(Msg.Message)[0]}]
    Msg.Type = MessageType(yoniMessage)

    go func() {
        if Msg.Type == TurnOn || Msg.Type == TurnOff {
            channel <- Msg
        }
    }()
}

