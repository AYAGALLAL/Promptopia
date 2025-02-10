# Use Debian latest as the base image 
FROM debian:latest

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y nodejs npm && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json before installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose the default Next.js port
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "run", "dev"]
