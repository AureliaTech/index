FROM node:24.2-alpine

# Install Docker CLI
RUN apk add --no-cache docker-cli

# Create a user to run the application
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Add the user to the docker group (this will be effective when the docker socket is mounted)
RUN addgroup -g 999 docker && \
    adduser nodejs docker

# Switch to the nodejs user
USER nodejs

# Set the working directory
WORKDIR /app

# Copy package files
COPY --chown=nodejs:nodejs package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY --chown=nodejs:nodejs . .

# Expose port (adjust as needed for your application)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]