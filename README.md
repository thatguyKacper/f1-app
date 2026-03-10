# Formula 1 Stats Dashboard 🏎️

This project is a full-stack, cloud-native web application designed to visualize historical and current Formula 1 data, inspired by the official F1 website's results pages. It processes extensive datasets to display race results, driver standings, and season calendars in a clean, modern interface.

## 🏗️ Architecture & Infrastructure

The application was built with a microservices-oriented mindset and designed to run on a **Kubernetes (K8s)** cluster. The production-grade architecture features:

* **Microservices:**
  * **Frontend:** A standalone Next.js (App Router) application handling Server-Side Rendering (SSR).
  * **Backend:** A NestJS API powered by Prisma ORM, serving as a robust data-processing layer.
  * **Database:** A PostgreSQL instance storing comprehensive F1 statistics.

## 💻 Local Development (Docker)

You don't need a Kubernetes cluster to run or contribute to this project. A complete `docker-compose.yml` file is provided, which spins up the PostgreSQL database, pgAdmin, and maps the local initialization scripts and CSV folders directly into the containers. In **/f1-db** simply run:

`
docker-compose up -d
`

...and you can start developing the Next.js and NestJS applications locally on your machine!
