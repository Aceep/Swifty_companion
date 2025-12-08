# Base image
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Install Expo CLI globally
RUN npm install -g expo-cli

# Install watchman (optional, helps file watching)
RUN apt-get update && apt-get install -y \
    watchman \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Expose Expo ports
EXPOSE 19000 19001 19002

# Default command is bash so we can run npx inside container
CMD ["/bin/bash"]
