FROM node:slim
LABEL Eyevinn Technology <work@eyevinn.se>
WORKDIR /app
ADD . .
RUN npm install
CMD [ "npm", "start" ]