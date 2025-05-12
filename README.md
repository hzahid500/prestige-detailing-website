# Prestige Detail Website

<p align="center">
  <img src="public/images/pic-prestige-website01.jpg" alt="Prestige Detail Website Screenshot" width="100%" />
</p>

<h1 align="center">Premium Auto Detailing Services</h1>
<p align="center">Experience the ultimate in automotive care with our professional detailing services</p>

<p align="center">
  <a href="#deployment">
    <img src="https://img.shields.io/badge/BOOK%20NOW-%E2%86%92-00a8ff?style=for-the-badge" alt="Book Now" />
  </a>
</p>

## Overview

A modern, responsive website for a premium auto detailing service, featuring:

- Professional service packages
- Online booking system
- Responsive design
- Modern UI/UX
- Fast loading static site

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

### Features

- Responsive design for all devices
- Modern, clean UI
- Interactive service cards
- Online booking system
- Service package calculator
- Professional photo gallery
- Contact form with validation

## License

[Your License Here]
