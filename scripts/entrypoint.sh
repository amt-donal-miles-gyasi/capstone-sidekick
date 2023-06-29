#!/bin/sh

set -e

echo "generate for deployment"
yarn prisma:generate
echo "db generation success"

# echo "migrate for deployment"
# yarn migration:deploy
# echo "migration success"

# echo "Push to database"
# yarn db:push
# echo "Push success"

echo "start app"
exec "$@"
