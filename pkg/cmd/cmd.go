package cmd

import (
	"log"

	"golang.org/x/tools/go/callgraph/static"
)

type Commands int

func zeroBuffer() []byte {
    bufferLen := 1 + 50 + 2 + 200
    return [bufferLen]byte
}

const typeIdx = 0
const statuslineIdx = 1
const costIdx = 51
const dataIdx = 53


const (
    VimCommand Commands = iota
    VimInsert
    VimAfter
    SystemCommand
    StatusUpdate
)

type Command struct {
    _buffer []byte
}

func (c *Command) Reset() Command {
    c._buffer = zeroBuffer()
    return c
}

func (c *Command) SetType(type Commands) Command {
    c._buffer[typeIdx] = type
    return c
}

func (c *Command) SetStatusLine(status string) Command {
    if len(status) > 50 {
        panic("Status line can only go up to 50 in length")
    }
    buffer := []byte{status}
    copy(buffer, c._buffer[statuslineIdx])
    return c
}

func (c *Command) SetData(data: []byte) Command {
    if data == nil {
        return c
    }

    if len(data) > 200 {
        panic("Data is over 200")
    }

    copy(data, c._buffer[dataIdx])
    return c
}
