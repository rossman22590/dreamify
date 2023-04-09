# Use the official Node.js image as the base image
FROM node:16.8.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Set the NODE_ENV environment variable to production
ENV NODE_ENV=production

# Build the Next.js application
RUN npm run build

# Expose the port for the production server
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]
