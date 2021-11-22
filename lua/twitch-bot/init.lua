local TCP = require("twitch-bot.tcp");
local Pobo = require("twitch-bot.pobo");
local Enum = require("twitch-bot.enum");
local EnvClient = require("twitch-bot.envelope");

local CommandTypes = Enum({
    VimCommand = 0,
    SystemCommand = 1,
    VimInsert = 2,
    VimAfter = 3,
})

local M = {}

function M.disconnect()
    if not M._tcp then
        return
    end

    M._tcp:disconnect()
    M._init = false
    M._tcp = nil
    M._env = nil
end


function M.init()
    local vwm_host = "localhost"
    M._tcp = TCP:new(vwm_host, 42069)
    M._env = EnvClient:new(M._tcp)
    M._env:connect()
    M._env:on("connect", function()
        print("Connected to the server")
    end)

    M._env:on("data", function(line)
        local pobo = Pobo:new(line, 1)

        local status = pobo:get_status()

        require("yoni.statusline").set_status(status)

        local cmd = pobo:get_data()
        vim.cmd(cmd)
    end)
end

return M