# Walmart-Sparkathon

![Build](https://img.shields.io/badge/build-setup-important?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

A minimal e-commerce prototype built for a Sparkathon challenge. It consists of a Next.js frontend and an Express.js backend with MongoDB, Redis caching, and background workers for email tasks and queues. The project demonstrates a full-stack shopping flow: product browsing, cart management, user authentication (OTP), voice commands, and order placement.

**Quick links:**
- **Backend:** `./Backend`
- **Frontend:** `./frontend`

**Live demo:** (if deployed) Add link here

**Maintainers:** AshutoshKumar0206 and contributors

**Table of contents**
- **Project**: summary and goals
- **Tech Stack**: badges and icons
- **API Endpoints**: all active backend routes and descriptions
- **Local Setup**: how to run frontend and backend
- **Scaling Plan**: how we plan to scale each piece
- **Future Work & Notes**

**Project**

This repo contains a two-part application:
- Frontend: Next.js 15+ app (React + server components) in `./frontend`.
- Backend: Express.js API in `./Backend` exposing product, user, cart, order and voice endpoints.

**Tech Stack**

- ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&style=flat-square) **Node.js**: Server runtime for backend
- ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white&style=flat-square) **Express**: Backend framework
- ![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white&style=flat-square) **Next.js**: Frontend framework
- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&style=flat-square) **MongoDB**: Primary data store
- ![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&style=flat-square) **Redis**: Caching / session store
- ![Cloudinary](https://img.shields.io/badge/Cloudinary-3A86FF?style=flat-square) **Cloudinary**: Image hosting/transformations
- ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&style=flat-square) **Docker / Compose**: Containerization & local orchestration
- ![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&style=flat-square) **Vercel**: Frontend hosting
- ![Queue](https://img.shields.io/badge/Queue-BullMQ-orange?style=flat-square) **Background Workers**: email and async processing
- ![Queue](https://img.shields.io/badge/Queue-Azure%20WebJobs-blue?style=flat-square) **Background Workers**: email and async processing

**Backend API Endpoints**

Base URL (development): `http://localhost:4000`

- **Index**
	- `GET /` : Health / index route (controller: `indexController.index`) — public

- **Products** (`/products` prefix)
	- `POST /products/createProduct` : Create product (multipart `image`) — expects image file (uses multer) and product data — public/admin (no admin middleware present)
	- `GET /products/getAllProducts` : List all products — public
	- `GET /products/getProductById/:id` : Get product by ID — public
	- `GET /products/getTopDeals` : Returns top deals / featured products — public
	- `GET /products/exploreProducts` : Explore products with basic filters/search — public
	- `GET /products/getProductsByCategory/:category` : Get products for a category — public

- **User** (`/user` prefix)
	- `POST /user/signup` : Register new user — creates OTP/pending flows
	- `POST /user/signin` : Sign in (returns cookie/token depending on implementation)
	- `POST /user/logout` : Logout (protected — `isAuthenticated` middleware)
	- `POST /user/verify-otp` : Verify OTP for user confirmation
	- `POST /user/resend-otp` : Resend OTP
	- `GET /user/dashboard/:id` : User dashboard data for user `:id` — protected
	- `GET /user/me` : Current authenticated user info — protected
	- `GET /user/recommendProducts/:id` : Recommend products for user `:id` — protected

- **Cart** (`/cart` prefix)
	- `POST /cart/addToCart/:id` : Add product `:id` to authenticated user's cart — protected
	- `GET /cart/getCart/:id` : Get cart for user `:id` — protected
	- `PUT /cart/updateCart/:id` : Update cart item/quantities for user `:id` — protected
	- `DELETE /cart/removeFromCart` : Remove item from cart (request body used) — protected

- **Order** (`/order` prefix)
	- `POST /order/placeOrder/:id` : Place an order for user `:id` — protected
	- `GET /order/getOrders/:id` : Get order list for user `:id` — protected

- **Voice** (`/voice` prefix)
	- `POST /voice/interpret` : Interpret a voice/text command (controller: `voiceController.interpretCommand`) — protected
	- `POST /voice/getProductByName` : Search products by name (payload contains name) — protected

Notes:
- Protected routes use `isAuthenticated` middleware in `./Backend/middleware/auth.middleware.js`. Authentication appears cookie/token-based (see `app.js` with `cookie-parser`).
- Uploads are served from `GET /uploads/*` route (static folder mounted in `app.js`).

**Local Setup**

Prerequisites:
- Node.js 18+ (Recommended)
- Docker & Docker Compose (optional, for containerized run)
- MongoDB connection URI and Redis URL configured in `./Backend/.env`

Run Backend (development):

```powershell
cd Backend
npm install
# set env vars in .env, then
npm run dev
```

Run Frontend (development):

```powershell
cd frontend
npm install
npm run dev
```

Docker (quick):

```powershell
docker-compose up --build
```

Environment variables: (example keys — check `./Backend/.env`)
- `PORT` — backend port (default 4000)
- `MONGODB_URI` — connection string
- `REDIS_URL` — redis connection
- `CLOUDINARY_*` — cloudinary credentials
- `JWT_SECRET` / session config as used by auth middleware

**Scaling Plan (how we'll scale this system)**

High-level principles: make backend stateless, use managed services for stateful components, add horizontal scaling with orchestration (Kubernetes or managed container service), and add monitoring/observability.

- **Stateless App Servers**: Run the Express backend as stateless containers behind a load balancer (Nginx/ALB). Persist sessions as JWTs or store sessions in Redis so nodes are interchangeable.

- **Database Scaling (MongoDB)**:
	- Start with a single managed MongoDB Atlas cluster.
	- For read-heavy patterns, enable read replicas and route read traffic to secondaries where appropriate.
	- Use sharding for very large datasets across multiple nodes.
	- Add indexes for product search fields (name, category, price) and monitor slow queries; add query optimization.

- **Caching (Redis)**:
	- Cache product list responses, top-deals, and frequent queries with TTLs.
	- Use Redis for session store and rate-limiting.
	- Use Redis clusters for high availability and partitioning when needed.

- **File & Media Storage (Cloudinary + CDN)**:
	- Keep images in Cloudinary (already integrated), serve via CDN for low latency.
	- Offload thumbnails/transformations to Cloudinary.

- **Background Jobs & Queues**:
	- Keep email sending and heavy tasks in a queue (e.g., BullMQ) processed by worker containers.
	- Scale worker count independently from web workers.

- **Horizontal Scaling & Orchestration**:
	- Use Docker images and migrate to Kubernetes (EKS/GKE/AKS) or managed containers (AWS ECS/Fargate) when scaling.
	- Set autoscaling based on CPU, memory, request latency, and queue backlog metrics.

- **Search & Recommendations**:
	- For large catalogs, offload search to Elasticsearch / OpenSearch or Algolia.
	- For compute-heavy recommendations, use a separate microservice and cache results.

- **CI/CD & Deployment**:
	- Use GitHub Actions (or similar) to run tests, build images, and push to container registry.
	- Deploy frontend to Vercel or static CDN and backend to container platform.

- **Monitoring & Observability**:
	- Instrument app with metrics (Prometheus + Grafana) and tracing (OpenTelemetry, Jaeger).
	- Centralized logging (ELK/Datadog) and alerting for errors, latency, and saturation.

**Security & Best Practices**
- Use HTTPS/SSL termination at load balancer.
- Protect admin/product-creation endpoints behind role checks.
- Rate-limit endpoints and enable CORS properly (already uses allow list in `app.js`).
- Do not store secrets in repo; use environment secrets/managed secret stores.

**Future Work**
- Add explicit admin role and RBAC for product management.
- Add end-to-end tests and integration tests for APIs.
- Improve search with dedicated search engine (OpenSearch/Algolia).
- Create Postman collection or OpenAPI spec for easier testing.

---

If you'd like, I can:
- Add an OpenAPI (Swagger) spec for all endpoints.
- Commit this README and open a PR.
- Add a small `docs/` folder with a Postman collection and sample `.env.example`.

Would you like me to apply this README update to the repository now? 