FROM node:18
#FROM node

# app working folder
WORKDIR /usr/src/app

# install app
COPY . .

# install dependencies
RUN npm ci

# internally to log information 
ENV DEBUG=playground:*
# Run CMD
CMD npm start

# install dependencies
#COPY package*.json ./

#RUN npm install

# install app
#COPY . . 

#EXPOSE 3001

# Run CMD
#CMD ["node", "index.js"]

