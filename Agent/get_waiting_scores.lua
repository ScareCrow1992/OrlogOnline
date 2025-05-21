local argv_size = table.getn(ARGV)
local table_ = {}

for i = 1, argv_size, 1 do
    local key_ = string.format("/user/%s/", ARGV[i])
    local score_ = redis.call("json.get", key_, ".score")

    table.insert(table_, score_)

end

return table_