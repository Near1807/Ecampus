# Lancer le projet Ecampus

Ce guide explique comment démarrer le projet en local, soit entièrement avec Docker, soit en mode développement.

## 1. Architecture

Le projet comporte trois parties :

| Service | Technologie | Dossier | Port |
| --- | --- | --- | --- |
| Frontend | React + Vite (TypeScript), servi par Nginx en Docker | `Ecampus-Frontend/` | `3000` (Docker), `5173` (dev) |
| Backend | Spring Boot 4 (Java 21), API REST | `Ecampus-Backend/` | `8080` |
| Base de données | PostgreSQL 17 via Supabase local | `supabase/` | `54322` |

```mermaid
flowchart LR
    Navigateur -->|":3000"| Frontend["Frontend (Nginx)"]
    Frontend -->|"/api/* → backend:8080"| Backend["Backend (Spring Boot)"]
    Backend -->|"JDBC host.docker.internal:54322"| DB[("Postgres Supabase")]
```

Le navigateur ne contacte jamais le backend directement : le frontend transmet au backend toutes les requêtes commençant par `/api`. Ce relais est assuré par Nginx en Docker et par Vite en développement. Il n'y a donc pas de problème de CORS.

## 2. Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/), démarré
- [Node.js](https://nodejs.org/) 24 ou plus récent
- Java 21, uniquement pour lancer le backend hors Docker

## 3. Démarrer la base de données (Supabase)

Dans tous les cas, lancez d'abord Supabase depuis la racine du projet :

```bash
npm install          # installe la CLI Supabase (une seule fois)
npx supabase start   # démarre Postgres, Studio, Auth...
```

Services utiles une fois Supabase démarré :

| Service | URL |
| --- | --- |
| Postgres | `postgresql://postgres:postgres@localhost:54322/postgres` |
| Supabase Studio (interface web) | http://localhost:54323 |
| API Supabase | http://localhost:54321 |

Pour l'arrêter : `npx supabase stop`.

### Migrations de la base

Le schéma de la base est versionné dans `supabase/migrations/`. Le premier fichier, `20261107233918_initial_schema.sql`, crée les 7 tables décrites dans `Base de données – schéma v2.md`.

```bash
npx supabase migration up          # applique les migrations pas encore appliquées (garde les données)
npx supabase migration list        # liste les migrations et leur état
npx supabase db reset              # ⚠️ efface la base locale et rejoue toutes les migrations
npx supabase migration new <nom>   # crée un nouveau fichier de migration
```

> Ne modifiez jamais une migration déjà appliquée. Pour faire évoluer le schéma, créez une nouvelle migration (par exemple `ALTER TABLE ...`).

## 4. Option A : tout lancer avec Docker (recommandé)

Depuis la racine du projet, avec Supabase déjà démarré :

```bash
docker compose up -d --build
```

| Accès | URL |
| --- | --- |
| Application | http://localhost:3000 |
| API (directe) | http://localhost:8080 |
| API (via le frontend) | http://localhost:3000/api/... |

Commandes utiles :

```bash
docker compose logs -f backend   # suivre les logs du backend
docker compose ps                # état des conteneurs
docker compose down              # tout arrêter
```

### Variables d'environnement

Par défaut, le backend se connecte au Postgres de Supabase local. Pour changer ces valeurs, créez un fichier `.env` à la racine du projet :

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:54322/postgres
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
```

> Dans un conteneur, `localhost` désigne le conteneur lui-même. Pour joindre Supabase, qui tourne sur la machine hôte, il faut utiliser `host.docker.internal`.

## 5. Option B : mode développement (sans Docker)

Ce mode recharge le code à chaud et convient mieux pendant le développement.

**Backend**, dans un premier terminal :

```bash
cd Ecampus-Backend
# Windows (PowerShell)
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:54322/postgres"
$env:SPRING_DATASOURCE_USERNAME="postgres"
$env:SPRING_DATASOURCE_PASSWORD="postgres"
./mvnw spring-boot:run
```

> Ces variables sont obligatoires, car `application.yaml` ne contient pas encore la configuration de la base de données. Sans elles, le backend s'arrête au démarrage.

**Frontend**, dans un second terminal :

```bash
cd Ecampus-Frontend
npm install
npm run dev
```

L'application est disponible sur http://localhost:5173. Vite transmet les appels `/api/...` à `http://localhost:8080` (voir `vite.config.ts`).

## 6. Règles pour faire communiquer les services

- **Préfixe `/api`** : les contrôleurs Spring doivent être exposés sous `/api` (par exemple `@RequestMapping("/api/annonces")`). Les proxys ne transmettent au backend que ce préfixe.
- **Côté frontend** : utilisez des URL relatives, par exemple `fetch("/api/annonces")`, jamais `http://localhost:8080/...`. Ainsi le même code fonctionne en dev et en Docker.

## 7. Problèmes fréquents

| Symptôme | Cause / solution |
| --- | --- |
| Le backend s'arrête avec `Failed to configure a DataSource` | Les variables `SPRING_DATASOURCE_*` sont absentes (mode dev). |
| Le backend s'arrête avec `Connection refused` | Supabase n'est pas démarré : lancez `npx supabase start`. |
| Une route de l'API répond `401` | La route est protégée (voir `config/SecurityConfig.java`). Seules les routes listées dans `PUBLIC_ROUTES` sont publiques, par exemple `/api/health`. |
| `Bind for 0.0.0.0:8080 failed: port is already allocated` | Un backend tourne déjà en local : arrêtez-le ou faites `docker compose down`. |
