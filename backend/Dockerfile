FROM node:18-slim

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Environment setup
ENV PORT=5000
EXPOSE 5000

# Run in development mode (or use production entrypoint)
CMD ["node", "server.js"]
