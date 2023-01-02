package irc

import (
	"os"
	"strings"

	"github.com/gempir/go-twitch-irc"
)

func NewFollower(msg IrcMessage, channel chan IrcMessage, client *twitch.Client) {
	follow := map[string]MessageType{
		"Thank you for following": Follow,
	}

	// Get the first 4 words of the message
	followType := follow[strings.Join(strings.Fields(msg.Message)[:4], " ")]
	msg.Type = followType

	go func() {
		if msg.Type == Follow {
			if msg.Name != "StreamElements" {
				client.Say(os.Getenv("TWITCH_OAUTH_NAME"), "You're not StreamElements, get out")
			}
		}

        channel <- msg
	}()
}
