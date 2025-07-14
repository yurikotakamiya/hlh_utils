# Developer Guide – HLH Utils

This is a reference guide for running, debugging, and maintaining the system locally or remotely (Oracle server, etc.).

---

## 🐳 Docker Maintenance

### Remove stopped containers
```bash
docker container prune -f
```

### Remove unused images
```bash
docker image prune -a -f
```

### Remove unused volumes
```bash
docker volume prune -f
```

### Remove unused networks
```bash
docker network prune -f
```

### Full cleanup
```bash
docker system prune -a --volumes -f
```

### Check disk usage
```bash
docker system df
```

### Remove dangling images
```bash
docker images -f "dangling=true" -q | xargs docker rmi -f
```

---

## 🔌 Docker Access Commands

### Attach to backend container
```bash
docker exec -it hlh_utils-backend-1 sh
```

### Access Ollama container
```bash
docker exec -it hlh_utils-ollama-1 /bin/sh
```

Then pull a model:
```bash
ollama pull llama3.2:1b
```

### Access PostgreSQL container
```bash
docker exec -it hlh_utils-db-1 psql -U postgres -d mydatabase
```

---

## 📦 Data Processing (2ch Content)

To manually trigger ingestion inside the container:

```bash
docker exec -it hlh_utils-backend-1 node scripts/fetchPosts.js
```

---

## 🔁 Notes

- All ingestion jobs are scheduled via Jenkins in `jenkins/`
- All scraped content is saved to `data/` folder in HTML + JSON format
- Logs and runtime metadata stored inside respective container folders
