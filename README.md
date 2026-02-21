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
- Swagger API dokumentacija: http://localhost:5000/api-docs

## API specifikacija (Swagger)

Swagger dokumentacija je dostupna na ruti:

- `http://localhost:5000/api-docs`

OpenAPI specifikacija se nalazi u fajlu:

- `backend/docs/openapi.yaml`

### Gašenje

```bash
docker compose down
```
