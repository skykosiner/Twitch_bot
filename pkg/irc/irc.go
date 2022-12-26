package irc

import (
	"os"

	"github.com/gempir/go-twitch-irc"
)

type MessageType int

type IrcMessage struct {
	Name    string
	Message string
	Type    MessageType
}

type Twitch struct {
	channel chan IrcMessage
	client  *twitch.Client
}

func (t *Twitch) Connect() error {
	on := true

	t.channel = make(chan IrcMessage)

	token := os.Getenv("TWITCH_OAUTH_TOKEN")
	channel := os.Getenv("TWITCH_OAUTH_NAME")

	t.client = twitch.NewClient(channel, token)
	t.client.Join(channel)
}
