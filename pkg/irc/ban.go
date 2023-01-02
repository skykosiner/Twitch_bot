package irc

import (
	"strings"
)

func BandCommands(msg IrcMessage, channel chan IrcMessage) {
	bandCommands := map[string]MessageType{
		"!ban":   Ban,
		"!unban": Unban,
	}

	banType := bandCommands[strings.Fields(msg.Message)[0]]
	msg.Type = banType

	go func() {
		if msg.Type == Ban || msg.Type == Unban {
			channel <- msg
		}
	}()
}
