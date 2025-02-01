# Use Node.js official image as base
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose port 8080
EXPOSE 8080

# Start the application
CMD [ "node", "index.js" ] 