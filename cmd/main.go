package main

import (
	"log"

	"github.com/joho/godotenv"

	"github.com/yonikosiner/twitch-bot/pkg/irc"
	// "github.com/yonikosiner/twitch-bot/pkg/hue"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	var t *irc.Twitch = &irc.Twitch{}
    t.Connect()

	// var h *hue.Hue
	// h.FlickMeDaddy([]int{1, 14, 16, 19, 20, 21, 22, 23, 24, 25, 26}, "StreamElements")
}
