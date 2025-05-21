[build]
docker build -f Dockerfile.HAProxy -t local_haproxy .


[create container]
docker run -p 35557:35557 --rm --name local_haproxy --volume ${pwd}\HAProxy\haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg local_haproxy



