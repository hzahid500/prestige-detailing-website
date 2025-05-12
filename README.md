# Prestige Detail Website

A modern, responsive website for a premium auto detailing service.

## Deployment

### Prerequisites

- Python 3.6 or higher
- Docker
- Linux/Unix environment

### Quick Start

1. Make the deployment script executable:

```bash
chmod +x deploy.py
```

2. Run the deployment script:

```bash
./deploy.py
```

The script will:

- Check if Docker is running
- Back up any existing deployment
- Build a new Docker image
- Start a new container
- Verify the deployment

### Advanced Usage

The deployment script supports several options:

```bash
# Deploy on a different port
./deploy.py --port 8080

# Deploy with a custom name
./deploy.py --name my-detail-site

# Deploy without creating a backup
./deploy.py --no-backup
```

### Backup Management

Backups are stored in `deployments/backups` directory with timestamps. Each backup is a Docker image that can be restored if needed.

### Troubleshooting

1. If the deployment fails, check:

   - Docker service is running
   - Port 80 (or specified port) is available
   - Sufficient disk space for Docker images

2. To view container logs:

```bash
docker logs prestige-detail-container
```

3. To stop the container:

```bash
docker stop prestige-detail-container
```

## Development

The website is built using:

- HTML5
- CSS3
- JavaScript
- Nginx (for serving static files)

## License

[Your License Here]
