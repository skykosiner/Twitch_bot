package irc

import (
	"os"
	"strings"

	"github.com/gempir/go-twitch-irc"
	"github.com/yonikosiner/twitch-bot/pkg/hue"
)

type IrcMessage struct {
	Name    string
	Message string
}

type Twitch struct {
	channel       chan IrcMessage
	client        *twitch.Client
}

func (t *Twitch) Connect() error {
    t.channel = make(chan IrcMessage)

	token := os.Getenv("TWITCH_OAUTH_TOKEN")
	channel := os.Getenv("TWITCH_OAUTH_NAME")

	t.client = twitch.NewClient(channel, token)
	t.client.Join(channel)
	t.client.OnNewMessage(func(_ string, user twitch.User, message twitch.Message) {
		msg := IrcMessage{user.DisplayName, message.Text}
		t.channel <- msg
	})

    go func() {
        for msg := range t.channel {
            if strings.HasPrefix(msg.Message, "Thank you for following") {
                var h *hue.Hue
                h.FlickMeDaddy(t.client, []int{1, 14, 16, 19, 20, 21, 22, 23, 24, 25, 26}, msg.Name)
            }
        }
    }()

	return t.client.Connect()
}

func (t *Twitch) Channel() chan IrcMessage {
	return t.channel
}
