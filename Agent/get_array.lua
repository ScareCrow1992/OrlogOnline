


local argv_size = table.getn(ARGV)
local arr_ = {}

for i=1, argv_size, 1 do
    if(ARGV[i] ~= "X") then
        table.insert(arr_, ARGV[i])
    end
end

return arr_
