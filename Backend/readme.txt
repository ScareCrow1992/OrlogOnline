
[build]
docker build -f Dockerfile.backend -t local_backend .



[create container]
docker run -p 7370:7370 -e HTTP_PORT=7370 --name backend0 --volume ${pwd}\Backend\static:/Backend/static --volume ${pwd}\Backend\index:/Backend/index --volume ${pwd}\Backend\ecosystem.config.cjs:/Backend/ecosystem.config.cjs --volume ${pwd}\Backend\package.json:/Backend/package.json --env-file .\rdbms\.env local_backend


[create container (linux) ]
docker run -p 7370:7370 -e HTTP_PORT=7370 --name backend0 --volume ./Backend/static:/Backend/static --volume ./Backend/index:/Backend/index --volume ./Backend/ecosystem.config.cjs:/Backend/ecosystem.config.cjs --volume ./Backend/package.json:/Backend/package.json local_backend


docker run -p 7371:7371 -e HTTP_PORT=7371 --name backend1 --volume ${pwd}\Backend\static:/Backend/static --volume ${pwd}\Backend\index:/Backend/index --volume ${pwd}\Backend\ecosystem.config.cjs:/Backend/ecosystem.config.cjs --volume ${pwd}\Backend\package.json:/Backend/package.json --env-file .\rdbms\.env local_backend






[create container]
docker run -p 7370:7370 -p 7371:7371 -p 7372:7372 -p 7373:7373 --volume ${pwd}\Backend\static:/Backend/static --volume ${pwd}\Backend\index:/Backend/index --volume ${pwd}\Backend\ecosystem.config.cjs:/Backend/ecosystem.config.cjs --volume ${pwd}\Backend\package.json:/Backend/package.json --env-file .\rdbms\.env local_backend
