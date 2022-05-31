package irc

import (
	"fmt"
	"strings"
)

/*
        0             1 - 51               52 - ...?
+---------------+---------------+-------------------------------+
|     type      |   statusline  |           data...             |
+---------------+---------------+-------------------------------+
*/

type Command struct {
	_buffer []byte
}

const typeIdx = 0
const statuslineIdx = 1
const dataIdx = 53

func (c *Command) New(setType MessageType, setStatusLine string, setData []byte) []byte {
    c._buffer = make([]byte, 1 + 2 + 51 + 200)

    fmt.Println(setStatusLine)

	if len(setStatusLine) > 50 {
		panic("Status line can only go up to 50")
	}

	if setData == nil {
		return c._buffer
	}

	if len(setData) > 200 {
		panic("Data is over 200, that's illegal")
	}

	c._buffer[typeIdx] = byte(setType)
    copy(c._buffer[statuslineIdx:dataIdx], []byte(strings.TrimSpace(setStatusLine)))
    copy(c._buffer[dataIdx:200], []byte(setData))

    fmt.Println("Buffer", c._buffer)
    fmt.Println("Type", c._buffer[typeIdx])
    fmt.Println("Buffer into string", string(c._buffer))

	return c._buffer
}
