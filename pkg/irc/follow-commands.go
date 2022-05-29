package irc

import (
	"strings"

	"github.com/yonikosiner/twitch-bot/pkg/utils"
)

func FollowCommands(Msg IrcMessage, channel chan IrcMessage) {
    if utils.CountWordsInString(Msg.Message) < 4 {
        return
    }

    m := map[Key]MessageType{}
    m[Key{"Thank you for following"}] = Follow

    str := strings.Fields(Msg.Message)[:4]
    finalString := strings.Join(str, " ")

    followType := m[Key{finalString}]
    Msg.Type = MessageType(followType)


    go func() {
        if Msg.Type == Follow {
            channel <- Msg
        }
    }()
}
