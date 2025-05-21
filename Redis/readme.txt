[container build]
docker build -f Dockerfile.redis -t local_redis .



[container run]
#docker run -v /myredis/conf:/usr/local/etc/redis --name myredis redis redis-server /usr/local/etc/redis/redis.conf

# docker run -p 6379:6379 --volume ${pwd}\redis:/usr/local/etc/redis 7807c603cf93