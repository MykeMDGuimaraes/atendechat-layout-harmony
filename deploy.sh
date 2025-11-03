#!/bin/bash

set -e

echo "🚀 Starting deployment to app.diasolutions.ia.br..."

# Variables
BUILD_DIR="dist"
REMOTE_USER="root"
REMOTE_HOST="app.diasolutions.ia.br"
REMOTE_PATH="/var/www/frontend"
BACKUP_DIR="/var/www/frontend-backup-$(date +%Y%m%d-%H%M%S)"

# Step 1: Build the project
echo "📦 Building the project..."
npm run build

# Step 2: Check if build was successful
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build failed! Directory $BUILD_DIR not found."
    exit 1
fi

echo "✅ Build successful!"

# Step 3: Backup current production version
echo "💾 Creating backup of current production..."
ssh $REMOTE_USER@$REMOTE_HOST "if [ -d $REMOTE_PATH ]; then sudo cp -r $REMOTE_PATH $BACKUP_DIR; fi"

# Step 4: Upload new build to server
echo "📤 Uploading new build to server..."
rsync -avz --delete $BUILD_DIR/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/dist/

# Step 5: Reload Nginx
echo "🔄 Reloading Nginx..."
ssh $REMOTE_USER@$REMOTE_HOST "sudo systemctl reload nginx"

# Step 6: Verify deployment
echo "🔍 Verifying deployment..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://app.diasolutions.ia.br)

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "✅ Deployment successful! Site is live at https://app.diasolutions.ia.br"
else
    echo "⚠️ Warning: Site returned HTTP $HTTP_STATUS"
    echo "Check logs: ssh $REMOTE_USER@$REMOTE_HOST 'sudo tail -f /var/log/nginx/atendechat-error.log'"
fi

echo "🎉 Deployment complete!"
