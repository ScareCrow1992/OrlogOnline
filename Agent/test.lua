local path_ = ARGV[1]
local from_ = ARGV[2]

local cState_ = redis.call("json.get", path_, ".state")

local argv_size = table.getn(ARGV)

if(cState_ == string.format("\"%s\"", from_)) then

    local property_
    local value_

    for i = 3, argv_size, 1 do
        value_ = ARGV[i]

        if(value_ ~= "X") then
            property_ = string.format(".%s", KEYS[i])

            if(value_ == "false" or value_ == "true" or value_ == "null") then
                value_ = string.format("%s", ARGV[i])
            else 
                value_ = string.format("\"%s\"", ARGV[i])
            end
                
            redis.call("json.set", path_, property_, value_)
        end
    end
    
    return "O"
else
    return "X"
end

