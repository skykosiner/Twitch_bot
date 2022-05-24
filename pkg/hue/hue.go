package hue

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

type hueAPI struct {
	On bool `json:"on"`
}

type Hue struct {}

func (h *Hue) isConnected(url string) bool {
    resp, err := http.Get(url)

    if err != nil {
        log.Fatal("There was an error")
    }

    if err != nil {
        log.Fatal("There was an error `hue.go`", err)
    }

    if resp.StatusCode != 200 {
        return false
    }

    return true
}

func (h *Hue) turnOn(light int, url string) {
    jsonReq, err := json.Marshal(&hueAPI{On: true})

    if err != nil {
        log.Fatal("There was an errer turning on the light `hue.go`", err)
    }

    url = fmt.Sprintf("%slights/%d/state", url, light)
    req, err := http.NewRequest(http.MethodPut, url, bytes.NewBuffer(jsonReq))

    if err != nil {
        log.Fatal("There was an issue turnning on the lights `hue.go`", err)
    }

    req.Header.Set("Content-Type", "application/json; charset=utf-8")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        log.Fatalln(err)
    }

    defer resp.Body.Close()
}

func (h *Hue) turnOff(light int, url string) {
    jsonReq, err := json.Marshal(&hueAPI{On: false})

    if err != nil {
        log.Fatal("There was an errer turning off the light `hue.go`", err)
    }

    url = fmt.Sprintf("%slights/%d/state", url, light)

    req, err := http.NewRequest(http.MethodPut, url, bytes.NewBuffer(jsonReq))

    if err != nil {
        log.Fatal("There was an issue turnning off the lights `hue.go`", err)
    }

    req.Header.Set("Content-Type", "application/json; charset=utf-8")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        log.Fatalln(err)
    }

    defer resp.Body.Close()
}

func (h *Hue) FlickMeDaddy(lights []int, name string) {
    url := os.Getenv("HUE_URL")
	if name != "StreamElements" {
        // TODO: Don't crash the program, I want to just not run this function, and
        // let the user know that only stream elements can have that in chat.
        // But for now, crash the program
		os.Exit(1)
	}

    if !h.isConnected(os.Getenv("HUE_URL")) {
        log.Fatal("You're not connected to the hue serever")

        // TODO: Put that error message in the statusbar
        os.Exit(1)
    }

    for i := 0; i < len(lights); i++ {
        h.turnOn(lights[i], url)

        duration := time.Duration(3)*time.Second
        time.Sleep(duration)

        h.turnOff(lights[i], url)

        time.Sleep(duration)

        h.turnOn(lights[i], url)
    }
}
