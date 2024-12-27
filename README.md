# hlh_utils

To run the app, run:
`docker-compose up --build`


## Docker Commands to Free Up Disk Space

To free up disk space on your Docker host, you can use the following commands:

### Remove all stopped containers
`docker container prune -f`

### Remove all unused images
`docker image prune -a -f`

### Remove all unused volumes
`docker volume prune -f`

### Remove all unused networks
`docker network prune -f`

### Remove all unused data
`docker system prune -a --volumes -f`

### Check disk usage
`docker system df`


### For runnning the contents installation for 2ch website, run 
`docker exec -it hlh_utils-backend-1 sh`

### For accessing ollama in docker compose
`docker exec -it hlh_utils-ollama-1 /bin/sh`