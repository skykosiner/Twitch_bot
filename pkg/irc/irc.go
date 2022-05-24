package irc

import (
	"log"
	"os"

	"github.com/gempir/go-twitch-irc"
)

type Twitch struct {
	channel       chan IrcMessage
	client        *twitch.Client
	enableLogging bool
	callbacks     []LoggingCallback
}

func CreateIrcClient() *Twitch {
	return &Twitch{make(chan IrcMessage, 1), nil, false, nil}
}

func (t *Twitch) Connect() error {
	token := os.Getenv("TWITCH_OAUTH_TOKEN")
	channel := "yonikosiner"

	t.client = twitch.NewClient(channel, token)

	t.client.Join(channel)

	t.client.OnNewMessage(func(channel string, user twitch.User, message twitch.Message) {
		log.Println(message.Text)
	})

	t.client.Say(channel, "69420")

	return t.client.Connect()
}
