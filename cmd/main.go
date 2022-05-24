package main

import (
    "log"
    "github.com/joho/godotenv"

	"github.com/yonikosiner/twitch-bot/pkg/hue"
	// "github.com/yonikosiner/twitch-bot/pkg/irc"
)

func main() {
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

	/* irc := &irc.Twitch{}
	irc.Connect()

	if irc.Connect().Error() != "" {
		panic(irc.Connect().Error())
	}

	for msg := range irc.Channel() {
		fmt.Println(msg)
	} */

    var h *hue.Hue
    h.FlickMeDaddy([]int{1, 14, 16, 19, 20, 21, 22, 23, 24, 25, 26}, "StreamElements")
}
