package irc

import (
	"log"
	"os"
	"strings"

	"github.com/gempir/go-twitch-irc"
	"github.com/yonikosiner/twitch-bot/pkg/band"
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

    // Go func your self
    go func() {
        for msg := range t.channel {
            // Following message
            if strings.HasPrefix(msg.Message, "Thank you for following") {
                var h *hue.Hue
                h.FlickMeDaddy(t.client, []int{1, 14, 16, 19, 20, 21, 22, 23, 24, 25, 26}, msg.Name)
            }

            if strings.HasPrefix(msg.Message, "!band") {
                var b *band.Band = &band.Band{}
                band := strings.TrimSpace(strings.TrimPrefix(msg.Message, "!band"))
                b.AddBand(band, t.client)
            }

            // Vim me daddy
            // TODO: Setup emitters for the vim stuff like at: ../../../master/src/irc/vim-commands.ts
        }
    }()

	return t.client.Connect()
}

func (t *Twitch) Channel() chan IrcMessage {
	return t.channel
}
