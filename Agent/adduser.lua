local randuppercase = string.char(math.random(65, 65 + 25))



redis.call("json.set", "key123", "$", '{"f1": {"a":1}, "f2":{"a":2}}')
