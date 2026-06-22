# Blog Platform Monorepo

Test application for CI/CD pipelines using GitHub Actions for continuous integration and Argo CD for Kubernetes deployment on AKS.

## Architecture

- `apps/frontend`: Node.js React/Vite blog frontend.
- `services/api`: Java Spring Boot REST API.
- `infra/k8s`: Kubernetes manifests for AKS.
- `infra/argocd`: Argo CD `Application` manifest.
- `.github/workflows/ci.yml`: CI pipeline with tests, builds, container image build, and open source vulnerability scanning.

## Local Development

Prerequisites:

- Node.js 20+
- Java 21+
- Docker and Docker Compose

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Run the API:

```bash
cd services/api
mvn spring-boot:run
```

Run the frontend:

```bash
cd apps/frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

API: `http://localhost:8080/api/posts`

## CI Security Scans

The GitHub Actions workflow uses open source tools:

- Trivy for filesystem, dependency, configuration, and container image vulnerability scanning.
- OWASP Dependency-Check for Java dependency CVEs.
- Semgrep for static analysis.
- npm audit for frontend dependency advisories.

## Deployment

1. Push container images to GitHub Container Registry from CI.
2. Update `infra/k8s/frontend/deployment.yaml` and `infra/k8s/api/deployment.yaml` image names for your GitHub organization/repository.
3. Apply the Argo CD application:

```bash
kubectl apply -n argocd -f infra/argocd/blog-platform.yaml
```

The manifests deploy into the `blog-platform` namespace. For production, replace the sample PostgreSQL password with a secret managed by Azure Key Vault, External Secrets Operator, or your preferred secret manager.
