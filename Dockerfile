# Stage 1: Build the Angular SSR app
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files and install all dependencies (including devDependencies for ng build)
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app for production with SSR
RUN npm run build:ssr -- --configuration production

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

# Command to start the SSR server in production
CMD ["npm", "run", "serve:ssr:nojokerecipe-frontend"]
