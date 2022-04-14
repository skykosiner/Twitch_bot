package main

import (
	"fmt"
	"github.com/yonikosiner/twitch-bot/pkg/irc"
)

func main() {
	irc := &irc.Twitch{}
	irc.Connect()

	if irc.Connect().Error() != "" {
		panic(irc.Connect().Error())
	}

	for msg := range irc.Channel() {
		fmt.Println(msg)
	}
}
