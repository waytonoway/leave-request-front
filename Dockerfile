# Use Node.js as the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the frontend application files into the container
COPY . .

# Expose the port the app runs on
EXPOSE 3003

# Start the development server
CMD ["npm", "start"]
