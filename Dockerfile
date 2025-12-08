# Base Node image
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Optional: install watchman, git, curl
RUN apt-get update && apt-get install -y \
    watchman \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Expose Expo dev server ports
EXPOSE 19000 19001 19002

# Start bash for interactive development
CMD ["/bin/bash"]
