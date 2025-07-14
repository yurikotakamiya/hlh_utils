# HLH Utils

> 🐾 **Note**: The name `hlh_utils` comes from my three cats — Happy, Lucky, and Healthy — and started as a personal family utility app.  
> It has since evolved into a modular automation toolkit using GPT, Ollama, and web scraping pipelines.

---

## ✨ Overview

**HLH Utils** is a full-stack automation toolchain designed to ingest, filter, summarize, and display content from web forums and YouTube. It leverages LLMs (via GPT and Ollama), scraping logic, cron scheduling, and a custom admin UI to assist with daily content curation and analysis.

---

## 🧠 Features

- Scrape posts and metadata from anonymous message boards
- Filter content using local LLMs (Ollama, e.g., LLaMA3)
- Schedule daily ingestion pipelines with Jenkins
- Summarize YouTube videos using transcripts and GPT
- Admin UI to browse stored content and summaries
- Fully Dockerized for local and cloud deployment

---

## 🛠 Tech Stack

**Frontend**: React, Ant Design
**Backend**: Node.js, Express, PostgreSQL
**Infra**: Docker Compose  


---

## 🚀 Quick Start

```bash
git clone https://github.com/yurikotakamiya/hlh_utils.git
cd hlh_utils
docker-compose up --build
```

---

## 📂 Project Structure

```
hlh_utils/
├── backend/            # Node.js + Express backend
├── frontend/           # React (Vite) frontend
├── jenkins/            # Jenkins cron jobs
├── scripts/            # Scrapers and data pipelines
├── data/               # Ingested content and metadata
├── docker-compose.yml  # Container orchestration
```

---

## ⚙️ Developer Guide

For internal development, data access, and Docker commands, see [`DEV_GUIDE.md`](./DEV_GUIDE.md)

---

## 📄 License

MIT License
