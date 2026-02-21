Jobzee

## Dockerizacija

Oba dela aplikacije su dockerizovana:

- frontend: React + Vite build, servira se preko Nginx-a
- backend: Node.js + Express API
- orkestracija: docker-compose

### Pokretanje

1. Proveri da postoji `backend/.env`
2. Pokreni:

```bash
docker compose up --build
```

### Adrese

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Gašenje

```bash
docker compose down
```
