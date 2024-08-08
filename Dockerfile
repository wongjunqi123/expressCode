# Use the official Node.js 20 image as a parent image
FROM node:20

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Yarn is included in the official Node image, so no need to install it separately

# Copy package.json, yarn.lock (if available), and other relevant configuration files into the container
COPY package.json yarn.lock ./

# Install app dependencies including TypeScript and ts-node using Yarn
RUN yarn install --frozen-lockfile
RUN yarn add typescript ts-node --dev

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Your app binds to port 3000, so use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Use ts-node to run your TypeScript application directly
CMD [ "npx", "ts-node", "index.ts" ]