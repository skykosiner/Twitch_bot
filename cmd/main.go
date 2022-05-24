package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
    "github.com/gempir/go-twitch-irc"

	// "github.com/yonikosiner/twitch-bot/pkg/hue"
)

func main() {
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    client := twitch.NewClient("yonikosiner", os.Getenv("TWITCH_OAUTH_TOKEN"))

    client.OnNewMessage(func(channel string, user twitch.User, message twitch.Message) {
        msg := fmt.Sprintf("%s: %s", user.DisplayName, message.Text)
        fmt.Println(msg)
    })

    client.Join("yonikosiner")

    client.Connect()

    // var h *hue.Hue
    // h.FlickMeDaddy([]int{1, 14, 16, 19, 20, 21, 22, 23, 24, 25, 26}, "StreamElements")
}
