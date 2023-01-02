package irc

import (
	"fmt"
	"os"
	"strings"

	"github.com/gempir/go-twitch-irc"
	banCommands "github.com/skykosiner/twitch-bot-golang/pkg/ban"
	"github.com/skykosiner/twitch-bot-golang/pkg/hue"
	"github.com/skykosiner/twitch-bot-golang/pkg/utils"
)

type MessageType int

const (
	MSG MessageType = iota
	Ban
	Unban
	Follow
)

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
	// on := true

	t.channel = make(chan IrcMessage)

	token := os.Getenv("TWITCH_OAUTH_TOKEN")
	channel := os.Getenv("TWITCH_OAUTH_NAME")

	t.client = twitch.NewClient(channel, token)
	t.client.Join(channel)
	t.client.OnNewMessage(func(_ string, user twitch.User, message twitch.Message) {
		msg := IrcMessage{user.DisplayName, message.Text, MSG}
		t.channel <- msg
	})

	go func() {
		for msg := range t.channel {
			switch msg.Type {
			case MSG:
				utils.LogChat(msg.Name, msg.Message)
				BandCommands(msg, t.channel)
				NewFollower(msg, t.channel, t.client)
			case Ban:
				mods := []string{"yonikosiner", "nniklask"}

				if !utils.StringInArr(msg.Name, mods) {
					t.client.Say(os.Getenv("TWITCH_OAUTH_NAME"), fmt.Sprintf("Hey %s, you're not a mod. You can't band people", msg.Name))
					return
				}

				var b *banCommands.Ban = &banCommands.Ban{}
				userNameToBeBand := strings.Fields(msg.Message)[1]

				b.AddBand(userNameToBeBand, t.client)
			case Follow:
				hue.FlickMeDaddy(t.client, []int{1, 14, 16, 19, 20, 21, 22, 23, 24, 25, 26})
			}
		}
	}()

	return t.client.Connect()
}
