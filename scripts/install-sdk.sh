#!/usr/bin/env bash
set -euo pipefail

# Install Java 21 (LTS) and Gradle for Spring Boot + Kotlin development
echo "==> Updating package lists..."
sudo apt-get update -qq

echo "==> Installing OpenJDK 21..."
sudo apt-get install -y openjdk-21-jdk

echo "==> Installing Gradle..."
sudo apt-get install -y gradle

echo ""
echo "==> Installed versions:"
java -version
gradle --version | head -3
echo ""
echo "Done. Kotlin is managed via Gradle's Kotlin plugin — no separate install needed."
