# Define the Node version
ARG NODE_VERSION=20.10.0

# Use the specified version of Node.js with Alpine Linux for a smaller image size
FROM node:${NODE_VERSION}-alpine

# Install bash for debugging (optional)
RUN apk add --no-cache bash

# Use production node environment by default
ENV NODE_ENV production

# Set the working directory for the application
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid copying into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Switch to a non-root user for enhanced security
USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on
EXPOSE 5000

# Start the application
CMD node server.js
