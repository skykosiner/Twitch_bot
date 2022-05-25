package irc

import (
	"fmt"
	"os"
	"strings"

	"github.com/gempir/go-twitch-irc"
	"github.com/yonikosiner/twitch-bot/pkg/band"
	"github.com/yonikosiner/twitch-bot/pkg/hue"
	"github.com/yonikosiner/twitch-bot/pkg/utils"
)

type Key struct {
    X string
}

type MessageType int

const (
    MSG MessageType = iota
    Ban
    Unban
    Follow
    TurnOn
    TurnOff
)

type IrcMessage struct {
	Name    string
	Message string
    Type MessageType
}

type Twitch struct {
	channel       chan IrcMessage
	client        *twitch.Client
}

func (t *Twitch) Connect() error {
    on := true

    t.channel = make(chan IrcMessage)

	token := os.Getenv("TWITCH_OAUTH_TOKEN")
	channel := os.Getenv("TWITCH_OAUTH_NAME")

	t.client = twitch.NewClient(channel, token)
	t.client.Join(channel)
	t.client.OnNewMessage(func(_ string, user twitch.User, message twitch.Message) {
		msg := IrcMessage{user.DisplayName, message.Text, MSG}
		t.channel <- msg
	})

    // Go func your self
    go func() {
        for msg := range t.channel {
            switch msg.Type {
        case MSG:
                utils.LogChat(fmt.Sprintf("%s: %s", msg.Name, msg.Message))
                FollowCommands(msg, t.channel)
                BanCommands(msg, t.channel)
                YoniCommands(msg, t.channel)
                // TODO: Setup emitters for the vim stuff like at: ../../../master/src/irc/vim-commands.ts
        case Ban:
                mods := []string{"yonikosiner", "nniklask"}

                if !utils.StringInArray(msg.Name, mods) {
                    t.client.Say(os.Getenv("TWITCH_OAUTH_NAME"), "Only Yoni and mods can band users")
                }

                var b *band.Band = &band.Band{}
                band := strings.TrimSpace(strings.TrimPrefix(msg.Message, "!band"))
                b.AddBand(band, t.client)
        case Follow:
                if !on {
                    var h *hue.Hue
                    h.FlickMeDaddy(t.client, []int{1, 14, 16, 19, 20, 21, 22, 23, 24, 25, 26}, msg.Name)
                }
        case TurnOn:
            on = true
        case TurnOff:
            on = false
        default:
            panic(fmt.Sprintln("Unknown type", msg.Type))
            }
        }
    }()

	return t.client.Connect()
}

func (t *Twitch) Channel() chan IrcMessage {
	return t.channel
}
