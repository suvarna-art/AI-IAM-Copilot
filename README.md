# 🛡️ IdentityForge AI

> AI-Powered Identity & Access Management Security Platform

**Live Demo:** https://ai-iam-copilot.vercel.app
**Backend API:** https://ai-iam-copilot-api.onrender.com
**API Documentation:** https://ai-iam-copilot-api.onrender.com/docs

## Overview

**IdentityForge AI** is a full-stack cybersecurity and Identity & Access Management (IAM) platform designed to bring identity governance, access control, privileged access monitoring, risk intelligence, analytics, and AI-assisted security analysis into a unified enterprise experience.

The platform combines a modern **React + TypeScript frontend** with a **FastAPI + Python backend** and is deployed publicly using **Vercel** and **Render**.

The project demonstrates how IAM security workflows can be presented through a centralized security operations experience rather than isolated administrative screens.

## Why IdentityForge AI?

Enterprise IAM teams need visibility into:

* who has access
* which accounts are privileged
* where excessive access exists
* which identities represent elevated risk
* which access reviews require attention
* how roles and permissions affect governance
* where security teams should prioritize investigation

IdentityForge AI brings these signals together into a single platform with an AI-assisted security interface.

## Key Capabilities

### Identity Management

Centralized identity inventory with identity status, departments, privilege indicators, risk levels, access counts, and security intelligence.

### Access Control

Visibility into access assignments, privileged access, high-risk access, and excessive access conditions.

### Access Reviews

Governance-oriented access review visibility with review status, pending reviews, overdue reviews, and review intelligence.

### Privileged Access

Dedicated privileged identity inventory with:

* risk severity
* risk scores
* MFA status
* active/inactive state
* last-access visibility
* security-focused prioritization

### Role & Permission Governance

Role inventory with:

* role descriptions
* user counts
* permission counts
* risk levels
* role status

### Risk Intelligence

Security-focused risk visibility across identities and access activity.

### Activity Monitoring

Centralized identity and security activity visibility for operational monitoring and investigation.

### Analytics

Identity and access analytics presented through an enterprise security dashboard.

### AI Copilot

AI-assisted IAM analysis for security questions, identity insights, and governance-oriented recommendations.

### Security Configuration

Environment-based frontend API configuration and environment-driven backend CORS configuration for deployment flexibility.

## Application Modules

The current platform includes:

* Dashboard
* Identities
* Access Control
* Access Reviews
* Privileged Access
* Roles
* Risk Intelligence
* Activity
* Analytics
* AI Confidence
* AI Copilot
* Settings

## Architecture

```text
                         ┌─────────────────────────┐
                         │       End User          │
                         │      Web Browser        │
                         └────────────┬────────────┘
                                      │
                                    HTTPS
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │        Vercel           │
                         │ React + TypeScript +     │
                         │ Vite Frontend            │
                         └────────────┬────────────┘
                                      │
                                VITE_API_URL
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │        Render           │
                         │ FastAPI + Python API    │
                         │ Uvicorn                 │
                         └────────────┬────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
              IAM Services      Security Services   AI Services
                    │                 │                 │
                    ▼                 ▼                 ▼
             Identity & Access   Risk / Reviews    AI Copilot
```

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Modern responsive UI
* Environment-based API configuration

### Backend

* Python
* FastAPI
* Uvicorn
* Pydantic
* REST APIs
* Environment-based configuration
* CORS middleware

### Engineering & Deployment

* Git / GitHub
* Vercel
* Render
* PowerShell
* npm
* Python virtual environment

## Production Deployment

### Frontend

Hosted on **Vercel**:

https://ai-iam-copilot.vercel.app

Production API configuration uses:

```env
VITE_API_URL=https://ai-iam-copilot-api.onrender.com
```

### Backend

Hosted on **Render**:

https://ai-iam-copilot-api.onrender.com

The backend runs FastAPI with:

```text
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Health endpoint:

```text
GET /health
```

API documentation:

```text
GET /docs
```

## Security & IAM Concepts Demonstrated

IdentityForge AI demonstrates practical IAM and cybersecurity concepts including:

* Identity governance
* Role-based access control (RBAC)
* Privileged access monitoring
* Access reviews
* Excessive access detection
* Risk-based identity prioritization
* MFA visibility
* Security activity monitoring
* Least-privilege-oriented analysis
* Environment-based configuration
* Controlled CORS configuration
* Production API/frontend separation

## Project Structure

```text
AI-IAM-Copilot/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── data/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── services/
│   ├── database/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── types/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── docs/
├── infrastructure/
├── scripts/
├── screenshots/
├── tests/
├── CHANGELOG.md
└── README.md
```

## Local Development

### Backend

```powershell
cd backend

# Activate the virtual environment
.\.venv\Scripts\Activate.ps1

# Start FastAPI
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Health check:

```text
http://127.0.0.1:8000/health
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Development API configuration:

```env
VITE_API_URL=http://localhost:8000
```

## Production Build

Create a production frontend build with:

```powershell
cd frontend
npm run build
```

The generated production assets are written to:

```text
frontend/dist/
```

## API Examples

### Health

```http
GET /health
```

### Identities

```http
GET /identities
```

### Roles

```http
GET /roles/
```

### Privileged Access

```http
GET /privileged-access/
```

### API Documentation

```text
/docs
```

## Current Status

**Production deployment: LIVE ✅**

The application has been validated through:

* frontend production build
* backend API verification
* live Render deployment
* live Vercel deployment
* browser smoke testing
* API integration testing
* production CORS validation

## Roadmap

The original application-building roadmap has been substantially completed.

### Next focus

* Portfolio refinement
* Architecture documentation
* Production screenshots
* Performance optimization
* Additional IAM integrations
* Enterprise identity-provider integrations
* Automated testing expansion
* Additional security controls

## Future Enhancements

Potential future extensions include:

* SailPoint integration
* Microsoft Entra ID / Azure integration
* Okta integration
* Real authentication and authorization
* Persistent production database
* Policy-driven access recommendations
* Automated remediation workflows
* Audit/export capabilities
* Advanced RBAC analytics
* CI/CD security checks
* Containerized deployment

## Portfolio Value

IdentityForge AI demonstrates hands-on experience across:

**IAM + Cybersecurity + Full-Stack Development + AI + Cloud Deployment**

The project combines security-focused engineering concepts with a real deployed application rather than a purely local proof of concept.

## Author

**Suvarna**

Cybersecurity | IAM | Identity Governance | SailPoint | Python | React | AI

---

## License

This project is intended as a personal cybersecurity/IAM portfolio project.
