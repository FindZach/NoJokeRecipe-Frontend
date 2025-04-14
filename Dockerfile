# Stage 1: Build the Angular SSR app
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files and install all dependencies (including devDependencies for ng build)
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Inject API_URL into environment.prod.ts if provided, otherwise use the default
ARG API_URL=https://backend.nojokerecipes.com
RUN if [ -n "$API_URL" ] && [ "$API_URL" != "https://backend.nojokerecipes.com" ]; then \
      sed -i "s|apiUrl: '.*'|apiUrl: '$API_URL'|" src/environments/environment.prod.ts; \
    fi && \
    npm run build:ssr -- --configuration=production

# Stage 2: Create the production image
FROM node:20-slim

WORKDIR /app

# Copy only the built artifacts from the builder stage
COPY --from=builder /app/dist/nojokerecipe-frontend ./dist/nojokerecipe-frontend
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev --ignore-scripts

# Expose the port the app runs on
EXPOSE 4000

# Command to start the SSR server
CMD ["npm", "run", "serve:ssr:nojokerecipe-frontend"]
