#!/usr/bin/env python3

import os
import subprocess
import argparse
import sys
from datetime import datetime

class DeploymentManager:
    def __init__(self, app_name="prestige-detail", port=80):
        self.app_name = app_name
        self.port = port
        self.container_name = f"{app_name}-container"
        self.image_name = f"{app_name}-image"
        self.backup_dir = "deployments/backups"

    def run_command(self, command, shell=False):
        """Execute a shell command and return the output"""
        try:
            if shell:
                process = subprocess.run(command, shell=True, check=True, 
                                      stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                      text=True)
            else:
                process = subprocess.run(command.split(), check=True,
                                       stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                       text=True)
            return process.stdout
        except subprocess.CalledProcessError as e:
            print(f"Error executing command: {command}")
            print(f"Error output: {e.stderr}")
            sys.exit(1)

    def check_docker(self):
        """Check if Docker is installed and running"""
        try:
            self.run_command("docker info")
            print("✅ Docker is running")
        except:
            print("❌ Docker is not running or not installed")
            sys.exit(1)

    def backup_current_deployment(self):
        """Create a backup of the current deployment"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = f"{self.backup_dir}/{timestamp}"
        
        # Create backup directory if it doesn't exist
        os.makedirs(self.backup_dir, exist_ok=True)
        
        # Save current container if it exists
        try:
            self.run_command(f"docker commit {self.container_name} {self.image_name}_backup_{timestamp}")
            print(f"✅ Created backup image: {self.image_name}_backup_{timestamp}")
        except:
            print("ℹ️ No existing container to backup")

    def stop_container(self):
        """Stop the currently running container if it exists"""
        try:
            self.run_command(f"docker stop {self.container_name}")
            self.run_command(f"docker rm {self.container_name}")
            print(f"✅ Stopped and removed existing container: {self.container_name}")
        except:
            print("ℹ️ No existing container to stop")

    def build_image(self):
        """Build the Docker image"""
        print("🔨 Building Docker image...")
        self.run_command(f"docker build -t {self.image_name} .")
        print(f"✅ Built image: {self.image_name}")

    def start_container(self):
        """Start the container"""
        print("🚀 Starting container...")
        self.run_command(
            f"docker run -d --name {self.container_name} "
            f"-p {self.port}:80 "
            f"--restart unless-stopped {self.image_name}"
        )
        print(f"✅ Started container: {self.container_name}")

    def check_deployment(self):
        """Verify the deployment is running"""
        try:
            container_info = self.run_command(f"docker inspect {self.container_name}")
            print(f"✅ Container is running at port {self.port}")
            return True
        except:
            print("❌ Container is not running")
            return False

    def deploy(self):
        """Run the full deployment process"""
        print(f"🚀 Starting deployment of {self.app_name}")
        
        # Check Docker is available
        self.check_docker()
        
        # Backup current deployment
        self.backup_current_deployment()
        
        # Stop existing container
        self.stop_container()
        
        # Build new image
        self.build_image()
        
        # Start new container
        self.start_container()
        
        # Verify deployment
        if self.check_deployment():
            print(f"✅ Deployment successful! Application is running at http://localhost:{self.port}")
        else:
            print("❌ Deployment verification failed")
            sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description='Deploy the Prestige Detail website')
    parser.add_argument('--port', type=int, default=80,
                      help='Port to run the application on (default: 80)')
    parser.add_argument('--name', type=str, default='prestige-detail',
                      help='Application name (default: prestige-detail)')
    parser.add_argument('--no-backup', action='store_true',
                      help='Skip backup of current deployment')

    args = parser.parse_args()

    # Create and run deployment manager
    deployer = DeploymentManager(app_name=args.name, port=args.port)
    deployer.deploy()

if __name__ == "__main__":
    main() 