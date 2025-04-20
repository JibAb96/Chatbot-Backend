FROM node:23-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3001

# Command to run the app
CMD ["npm", "run", "start:dev"]