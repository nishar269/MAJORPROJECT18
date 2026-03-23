FROM node:18-slim

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Environment setup
EXPOSE 5173

# Vite default dev command
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
