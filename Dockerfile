# Use the official Node.js image as the base image
FROM node:16.8.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install TailwindCSS and PostCSS
RUN npm install -D tailwindcss postcss postcss-cli

# Copy the Tailwind config file to the working directory
COPY tailwind.config.js .

# Copy the rest of the application files
COPY . .

# Process the globals.css file with PostCSS and TailwindCSS
RUN npx postcss src/app/globals.css -o public/globals.css --env production

# Expose the port for the development server
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]
