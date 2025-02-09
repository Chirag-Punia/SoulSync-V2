set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'


print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

for cmd in kubectl docker kind; do
    if ! command -v $cmd &> /dev/null; then
        print_error "$cmd is not installed"
        exit 1
    fi
done


if [ ! -f ".env.frontend" ] || [ ! -f ".env.backend" ]; then
    print_error "Environment files .env.frontend and .env.backend must exist"
    exit 1
fi


set -a
source .env.frontend
source .env.backend
set +a


print_status "Building Docker images..."
docker build -t mental-health-frontend:latest ./frontend
docker build -t mental-health-backend:latest ./backend


print_status "Loading images into kind cluster..."
kind load docker-image mental-health-frontend:latest
kind load docker-image mental-health-backend:latest


print_status "Creating namespace..."
kubectl apply -f k8s/namespace.yaml


print_status "Creating ConfigMaps..."
envsubst < k8s/configmap.yaml | kubectl apply -f -


print_status "Creating Secrets..."
envsubst < k8s/secrets.yaml | kubectl apply -f -


print_status "Creating Services..."
kubectl apply -f k8s/services.yaml


print_status "Creating Deployments..."
kubectl apply -f k8s/deployments.yaml


print_status "Waiting for deployments to be ready..."
kubectl wait --namespace=mental-health-app \
  --for=condition=ready pod \
  --selector=app=frontend \
  --timeout=300s

kubectl wait --namespace=mental-health-app \
  --for=condition=ready pod \
  --selector=app=backend \
  --timeout=300s

print_status "Deployment completed successfully!"


FRONTEND_IP=$(kubectl get service frontend-service -n mental-health-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
print_status "Your application is accessible at: http://${FRONTEND_IP}"
