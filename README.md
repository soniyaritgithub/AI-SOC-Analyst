# 🛡️ AI SOC Analyst

### Enterprise Security Operations Center Platform

AI SOC Analyst is a full-stack cybersecurity platform designed to simulate a modern **Security Operations Center (SOC)** environment.

The platform provides centralized security monitoring, incident management, security analytics, role-based access control, audit logging, real-time communication capabilities, and production-ready REST APIs through a responsive SOC dashboard.

The project is built with a production-oriented architecture using **React, TypeScript, Django REST Framework, PostgreSQL, Redis, Celery, Django Channels, Docker, and JWT authentication**.

---

## 🌐 Live Application

### Frontend

**Live Demo:**  
https://ai-soc-analyst-eosin.vercel.app

### Backend API

**Backend:**  
https://ai-soc-backend-iqpx.onrender.com

### Swagger API Documentation

**Interactive Swagger UI:**  
https://ai-soc-backend-iqpx.onrender.com/api/docs/

### OpenAPI Schema

https://ai-soc-backend-iqpx.onrender.com/api/schema/

### Health Check

https://ai-soc-backend-iqpx.onrender.com/healthz

> **Note:** The backend is currently hosted on a free Render instance. The first request after inactivity may take approximately 50 seconds or more while the service wakes up.

---

## 📌 Project Overview

Modern Security Operations Centers process large volumes of security alerts and incidents.

AI SOC Analyst provides a centralized platform where security teams can:

- Monitor security incidents
- Analyze incident severity and trends
- Track incident status
- Assign incidents to SOC analysts
- Manage incident response workflows
- Monitor SOC analytics
- Maintain audit logs
- Generate security reports
- Authenticate users securely using JWT
- Apply role-based access control
- Receive real-time security updates
- Access documented REST APIs

The architecture is designed to support additional enterprise SIEM capabilities such as Elasticsearch, IOC management, threat intelligence, alert correlation, observability, and automated CI/CD.

---

# ✨ Key Features

## 🔐 Authentication & Security

- JWT-based authentication
- Access and refresh token support
- Automatic access-token refresh
- Refresh-token rotation
- Refresh-token blacklisting
- Secure logout
- Protected API endpoints
- Role-Based Access Control (RBAC)
- Secure password handling through Django
- CORS configuration
- CSRF trusted-origin configuration
- HTTP security headers

### Supported Roles

| Role        | Purpose                                      |
| ----------- | -------------------------------------------- |
| Admin       | Administrative and privileged SOC operations |
| Manager     | SOC management and monitoring                |
| SOC Analyst | Incident investigation and response          |

---

## 🚨 Incident Management

The incident management module provides a structured workflow for security incidents.

Features include:

- Incident listing
- Incident details
- Incident creation
- Incident updates
- Incident deletion
- Analyst assignment
- Incident status updates
- Severity filtering
- Status filtering
- Search
- Pagination
- Analyst performance data
- Incident statistics
- Incident trend analysis

---

## 📊 SOC Dashboard

The security dashboard provides centralized visibility into SOC activity.

Dashboard capabilities include:

- Security overview
- Incident statistics
- Severity distribution
- Status distribution
- Incident trends
- Latest security incidents
- SOC activity monitoring
- Dashboard data aggregation
- CSV dashboard export
- Real-time monitoring architecture

---

## 📈 Security Analytics

The analytics module helps SOC teams understand incident patterns and operational trends.

Analytics include:

- Incident statistics
- Severity distribution
- Status distribution
- Incident trends
- SOC analyst performance
- Security metrics visualization

Charts and analytics are rendered using **Recharts**.

---

## 📝 Audit Logging

Security-sensitive operations can be tracked through the audit logging system.

The module supports:

- Audit log listing
- Audit log details
- Audit statistics
- Audit dashboard
- Authentication protection
- Role-based authorization

This provides a foundation for accountability and security investigation workflows.

---

## 📄 Security Reports

The reporting module provides infrastructure for SOC reporting and security data exports.

The architecture supports:

- Security report generation
- Incident reporting
- Dashboard exports
- Security analytics reporting

---

## ⚡ Real-Time Architecture

The project includes asynchronous and real-time infrastructure using:

- Django Channels
- ASGI
- Daphne
- Redis
- WebSockets
- Celery

This architecture enables real-time SOC features and background security processing.

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────────┐
                         │        End User         │
                         │   SOC Analyst / Admin   │
                         └────────────┬────────────┘
                                      │
                                    HTTPS
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │      React Frontend     │
                         │  TypeScript + Vite UI   │
                         │         Vercel          │
                         └────────────┬────────────┘
                                      │
                               REST API / JWT
                                      │
                                      ▼
                    ┌─────────────────────────────────┐
                    │       Django REST Backend       │
                    │          Django + DRF           │
                    │          Daphne / ASGI          │
                    └───────────────┬─────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │ PostgreSQL   │      │    Redis     │      │    Celery    │
      │   Database   │      │ Cache/Channel│      │ Background   │
      │              │      │    Layer     │      │    Tasks     │
      └──────────────┘      └──────┬───────┘      └──────────────┘
                                   │
                                   ▼
                           ┌──────────────┐
                           │  WebSockets  │
                           │   Channels   │
                           └──────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

| Technology   | Purpose                          |
| ------------ | -------------------------------- |
| React        | Frontend UI                      |
| TypeScript   | Type-safe frontend development   |
| Vite         | Frontend build tooling           |
| Tailwind CSS | Responsive styling               |
| React Router | Client-side routing              |
| Axios        | API communication                |
| Recharts     | Security analytics visualization |
| Lucide React | Dashboard icons                  |

---

## Backend

| Technology            | Purpose                         |
| --------------------- | ------------------------------- |
| Python                | Backend programming language    |
| Django                | Backend framework               |
| Django REST Framework | REST API development            |
| SimpleJWT             | JWT authentication              |
| drf-spectacular       | OpenAPI / Swagger documentation |
| Django Channels       | WebSocket support               |
| Daphne                | ASGI server                     |
| Celery                | Background task processing      |
| django-filter         | API filtering                   |

---

## Data & Infrastructure

| Technology | Purpose                                   |
| ---------- | ----------------------------------------- |
| PostgreSQL | Primary relational database               |
| Redis      | Cache, Channels and Celery infrastructure |
| Docker     | Backend containerization                  |
| WhiteNoise | Django static-file handling               |

---

## Deployment

| Service | Purpose                               |
| ------- | ------------------------------------- |
| Vercel  | React frontend deployment             |
| Render  | Django backend deployment             |
| GitHub  | Source control and repository hosting |

---

# 📂 Project Structure

```text
AI-SOC-Analyst/
│
├── backend/
│   ├── accounts/
│   ├── audit_logs/
│   ├── common/
│   ├── config/
│   ├── dashboard/
│   ├── detection/
│   ├── incidents/
│   ├── notifications/
│   ├── reports/
│   ├── system/
│   │
│   ├── Dockerfile
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
│
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

---

# 🔌 REST API

The backend exposes documented REST APIs for authentication, incidents, analytics, audit logs, reports, and system functionality.

## API Documentation

Swagger provides an interactive interface for exploring and testing the REST API.

**Swagger UI**

https://ai-soc-backend-iqpx.onrender.com/api/docs/

---

## Important API Routes

```text
/api/accounts/
/api/incidents/
/api/audit-logs/
/api/reports/
/api/dashboard/
/api/system/
/api/schema/
/api/docs/
```

### Incident Analytics

```text
GET /api/incidents/
GET /api/incidents/stats/
GET /api/incidents/severity/
GET /api/incidents/status/
GET /api/incidents/trends/
GET /api/incidents/analysts/
GET /api/incidents/dashboard/
```

### Incident Operations

```text
GET    /api/incidents/<uuid>/
POST   /api/incidents/create/
PATCH  /api/incidents/<uuid>/update/
DELETE /api/incidents/<uuid>/delete/
PATCH  /api/incidents/<uuid>/assign/
PATCH  /api/incidents/<uuid>/status/
```

> Protected endpoints require a valid JWT access token and may additionally enforce role-based permissions.

---

# 🔐 Authentication Flow

```text
User Login
    │
    ▼
Django Authentication
    │
    ▼
Access Token + Refresh Token
    │
    ▼
Frontend Token Service
    │
    ▼
Authorization: Bearer <access_token>
    │
    ▼
Protected REST API
    │
    ├── Valid Token ───────► API Response
    │
    └── Expired Token
             │
             ▼
        Refresh Token
             │
             ▼
       New Access Token
             │
             ▼
        Retry Request
```

---

# ⚙️ Local Development

## 1. Clone Repository

```bash
git clone https://github.com/soniyaritgithub/AI-SOC-Analyst.git

cd AI-SOC-Analyst
```

---

# Backend Setup

## 2. Create Virtual Environment

Windows:

```bash
cd backend

python -m venv venv

venv\Scripts\activate
```

macOS / Linux:

```bash
cd backend

python3 -m venv venv

source venv/bin/activate
```

---

## 3. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Configure Environment Variables

Create the required backend environment configuration using the provided `.env.example` as a reference.

Typical configuration includes:

```env
SECRET_KEY=your-secret-key
DEBUG=True

DB_NAME=your_database
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432

REDIS_URL=redis://127.0.0.1:6379/0

ALLOWED_HOSTS=127.0.0.1,localhost

CORS_ALLOWED_ORIGINS=http://localhost:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173
```

Email-related environment variables may also be required depending on the configured backend environment.

Never commit real secrets or production credentials to GitHub.

---

## 5. Run Database Migrations

```bash
python manage.py migrate
```

---

## 6. Validate Django Configuration

```bash
python manage.py check
```

Expected result:

```text
System check identified no issues (0 silenced).
```

---

## 7. Run Backend Tests

```bash
python manage.py test
```

---

## 8. Start Django Backend

```bash
python manage.py runserver
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/api/docs/
```

---

# Frontend Setup

Open another terminal:

```bash
cd frontend

npm install
```

Create/configure the frontend environment file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Then run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🧪 Production Validation

### Backend

```bash
cd backend

python manage.py check

python manage.py test
```

### Frontend

```bash
cd frontend

npm run lint

npm run build
```

A successful production build generates the optimized frontend bundle in:

```text
frontend/dist/
```

---

# 🛡️ Security Engineering

Security controls implemented in the project include:

- JWT authentication
- Refresh-token rotation
- Token blacklisting
- Role-Based Access Control
- Protected REST endpoints
- Secure Django password hashing
- CORS restrictions
- CSRF trusted origins
- HTTPOnly session configuration
- MIME sniffing protection
- Clickjacking protection
- Strict referrer policy
- Environment-based secret management
- API authorization
- Audit logging

---

# 🚀 Deployment Architecture

```text
GitHub Repository
       │
       ├─────────────────────────┐
       │                         │
       ▼                         ▼
    Vercel                     Render
       │                         │
       ▼                         ▼
React + Vite              Django REST API
Frontend                   Docker / ASGI
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
               PostgreSQL                  Redis
```

The frontend and backend are independently deployable and communicate through secured REST APIs.

---

# 🗺️ Enterprise SOC Roadmap

The next development phase expands the project toward more advanced SIEM and SOC capabilities.

| Phase | Enterprise Feature              | Status     |
| ----- | ------------------------------- | ---------- |
| 7.1   | Elasticsearch                   | 🔜 Planned |
| 7.2   | SIEM Search                     | 🔜 Planned |
| 7.3   | Alert Correlation Engine        | 🔜 Planned |
| 7.4   | IOC Management & Upload         | 🔜 Planned |
| 7.5   | Threat Intelligence Integration | 🔜 Planned |
| 7.6   | API Rate Limiting               | 🔜 Planned |
| 7.7   | Prometheus Metrics              | 🔜 Planned |
| 7.8   | Grafana Dashboard               | 🔜 Planned |
| 7.9   | Sentry Monitoring               | 🔜 Planned |
| 7.10  | CI/CD Pipeline                  | 🔜 Planned |

---

# 🎯 Engineering Goals

This project demonstrates practical experience with:

- Full-stack application architecture
- Cybersecurity-focused application development
- SOC workflow design
- REST API development
- JWT authentication
- Role-Based Access Control
- PostgreSQL data modeling
- Redis infrastructure
- Asynchronous processing
- WebSocket architecture
- Responsive React dashboards
- TypeScript
- API documentation
- Docker containerization
- Production deployment
- Backend testing
- Frontend production builds

---

# 📸 Application Modules

The user interface includes:

- Secure Login
- User Registration
- SOC Dashboard
- Incident Management
- Security Analytics
- User Profile
- Settings
- Audit Logs
- Reporting infrastructure

---

# 👩‍💻 Author

**Sunidhi Shinde**

B.Tech — Computer Science & Engineering

Areas of Interest:

- Cybersecurity
- Security Operations
- SOC Analysis
- Full-Stack Development
- Backend Engineering
- AI-powered Security Systems

### Connect

LinkedIn:  
https://www.linkedin.com/in/sunidhishinde/

GitHub:  
https://github.com/soniyaritgithub

---

# 📜 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for details.

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐.

---

<p align="center">
  <strong>AI SOC Analyst</strong><br/>
  Enterprise Security Monitoring • Incident Response • Security Analytics
</p>
