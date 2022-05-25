package irc

import (
	"strings"
)

func CountWordsInString(str string) int {
    newStr := strings.Split(str, " ")

    var count int

    for i := 0; i < len(newStr); i++ {
        count++
    }

    return count
}

func FollowCommands(Msg IrcMessage, channel chan IrcMessage) {
    if CountWordsInString(Msg.Message) < 4 {
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

