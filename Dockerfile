FROM node:lts-alpine

RUN apk add --no-cache bash curl git openssl build-base python3 py3-pip

WORKDIR /workspace

# Start as root to handle permissions
USER root

CMD ["sh", "-c", "\
  echo 'Fixing permissions...'; \
  chown -R node:node /workspace; \
  \
  if [ ! -f \"app/package.json\" ]; then \
    echo 'Initializing Next.js...'; \
    # Run the installer as the node user \
    su node -c \"npx create-next-app@latest app --ts --tailwind --eslint --app --src-dir --import-alias '@/*' --use-npm --skip-install --force\"; \
  else \
    cd app; \
  fi; \
  \
  chown -R node:node /workspace; \
  echo 'Installing dependencies...'; \
  su node -c \"npm install\"; \
  echo 'Starting dev server...'; \
  su node -c \"npm run dev -- --hostname 0.0.0.0\" \
"]