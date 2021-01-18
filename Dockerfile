FROM node:11

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Copy app source code
COPY . .

#Build application

RUN npm run build

#Start application

CMD [ "npm", "start" ]
