# Use the official Node.js image as the base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Create the .env.local file
RUN touch .env.local

# Copy the rest of the application files
COPY . .

# Expose the port for the development server
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]
