# Jobzee

Jobzee je web aplikacija za oglase za posao/praksu koja povezuje studente i kompanije.

## Tehnologije

- Frontend: React + Vite
- Backend: Node.js + Express + Sequelize
- Baza: PostgreSQL (Neon)
- Dokumentacija API-ja: Swagger (OpenAPI)
- Kontejnerizacija: Docker + Docker Compose

## Osnovne funkcionalnosti

- Registracija i prijava korisnika (student, alumni, company, admin)
- Pregled i filtriranje oglasa
- Slanje prijava na oglase (uključujući CV)
- Pregled prijava za kompanije i upravljanje statusima
- Uređivanje korisničkog profila

## Pokretanje aplikacije (lokalno, bez Docker-a)

### 1) Backend

1. Pređi u backend folder:

```bash
cd backend
```

2. Instaliraj zavisnosti:

```bash
npm install
```

3. Proveri da postoji `backend/.env` i da su DB varijable podešene.

4. Pokreni backend:

```bash
npm run dev
```

Backend je dostupan na: `http://localhost:5000`

### 2) Frontend

1. U root folderu projekta instaliraj zavisnosti:

```bash
npm install
```

2. Pokreni frontend:

```bash
npm run dev
```

Frontend je dostupan na: `http://localhost:5173`

## Pokretanje aplikacije (Docker)

1. Proveri da postoji `backend/.env`
2. Iz root foldera pokreni:

```bash
docker compose up --build
```

### Adrese

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- Swagger API dokumentacija: `http://localhost:5000/api-docs`

### Gašenje

```bash
docker compose down
```

## API specifikacija (Swagger)

- Swagger UI: `http://localhost:5000/api-docs`
- OpenAPI fajl: `backend/docs/openapi.yaml`

## CI/CD (GitHub Actions)

CI/CD pipeline je implementiran kroz GitHub Actions workflow:

- fajl: `.github/workflows/ci-cd.yml`

Pipeline automatski radi sledeće:

- pokreće se na svaki `push` i `pull request` (`main`, `develop`, `feature/*`)
- pokreće frontend i backend provere/build korake
- gradi Docker image za frontend i backend
- na `main` grani push-uje image-e na GHCR
- opciono pokreće deployment preko webhook-a (ako je podešen `DEPLOY_WEBHOOK_URL` secret)
