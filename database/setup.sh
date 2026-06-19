#!/bin/bash
# database/setup.sh
#
# WHY THIS FILE EXISTS:
# Sets up the local PostgreSQL database for this project from scratch:
#   1. Creates the database
#   2. Creates a dedicated app role (NOT the postgres superuser)
#   3. Grants that role exactly the permissions it needs
#   4. Runs every migration file in order
#
# This is the exact sequence that was run and tested when designing the
# Phase 1 schema, so running this script reproduces that verified setup.
#
# USAGE (run as a user that can sudo to the postgres system account):
#   chmod +x database/setup.sh
#   ./database/setup.sh
#
# Assumes PostgreSQL is already installed and running locally.

set -e # stop immediately if any command fails

DB_NAME="pdf_ai_assistant"
APP_USER="pdf_app_user"
APP_PASSWORD="dev_password_123" # change this for anything beyond local dev!

echo "1. Creating database (skips if it already exists)..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME};"

echo "2. Creating app role (skips if it already exists)..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname = '${APP_USER}'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE USER ${APP_USER} WITH PASSWORD '${APP_PASSWORD}';"

echo "3. Granting database + schema privileges..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${APP_USER};"
sudo -u postgres psql -d "${DB_NAME}" -c "GRANT ALL ON SCHEMA public TO ${APP_USER};"

echo "4. Granting table + sequence privileges (current and future tables)..."
sudo -u postgres psql -d "${DB_NAME}" -c "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${APP_USER};"
sudo -u postgres psql -d "${DB_NAME}" -c "GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO ${APP_USER};"
sudo -u postgres psql -d "${DB_NAME}" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${APP_USER};"

echo "5. Running migrations in order..."
for migration in "$(dirname "$0")"/migrations/*.sql; do
  echo "   -> applying $(basename "$migration")"
  sudo -u postgres psql -d "${DB_NAME}" -f "$migration"
done

echo ""
echo "✅ Database setup complete. Update backend/.env with:"
echo "   DB_NAME=${DB_NAME}"
echo "   DB_USER=${APP_USER}"
echo "   DB_PASSWORD=${APP_PASSWORD}"
