FROM node:10.13-alpine
ENV NODE_ENV production
ENV TZ Europe/Stockholm
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN apk --update add tzdata 
RUN npm install --production --registry=http://npm.teamless.com/ \
    && mv node_modules ../
COPY . .
CMD node index.js