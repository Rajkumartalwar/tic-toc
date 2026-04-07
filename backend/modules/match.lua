local nk = require("nakama")

local function match_init(context, params)
  local state = {
    board = {"", "", "", "", "", "", "", "", ""},
    turn = "X"
  }
  return state, 1, "match"
end

local function match_loop(context, dispatcher, tick, state, messages)
  for _, msg in ipairs(messages) do
    local data = nk.json_decode(msg.data)
    local pos = data.position + 1

    if state.board[pos] == "" then
      state.board[pos] = state.turn

      state.turn = (state.turn == "X") and "O" or "X"

      dispatcher.broadcast_message(1, nk.json_encode(state))
    end
  end

  return state
end

return {
  match_init = match_init,
  match_loop = match_loop
}
