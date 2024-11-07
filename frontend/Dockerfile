# syntax=docker/dockerfile:1

# Set the Node.js version as an argument
ARG NODE_VERSION=20.10.0

# Use node image for the base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for installing production dependencies
FROM base as deps

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Create the .cache directory and set permissions for the node user
RUN mkdir -p /usr/src/app/node_modules/.cache && \
    chown -R node:node /usr/src/app/node_modules/.cache

################################################################################
# Create a stage for building the application
FROM deps as build

# Copy package.json, package-lock.json, and other necessary config files first (before source files)
COPY package.json package-lock.json tailwind.config.js postcss.config.js ./

# Ensure build dependencies (PostCSS, Tailwind, etc.) are installed
RUN npm ci

# Copy all source files (including pages, components, and other assets)
COPY . .

# Set environment variable for React build
ARG REACT_APP_BACKEND_SERVER
ENV REACT_APP_BACKEND_SERVER=${REACT_APP_BACKEND_SERVER}

# Ensure TailwindCSS is processed during build (using PostCSS with Tailwind)
RUN npm run build

################################################################################
# Use Nginx to serve the build output
FROM nginx:alpine as final

# Copy the build folder to the Nginx HTML directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copy the custom nginx.conf to the Nginx configuration directory
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 (default Nginx port)
EXPOSE 80

# Nginx runs in the foreground by default
CMD ["nginx", "-g", "daemon off;"]
