FROM node:20.18.0

ARG MACHINE_NAME={{app_name}}
ENV MACHINE_NAME={{app_name}}

WORKDIR /usr/src/{{app_name}}
RUN mkdir -p /usr/src/{{app_name}}/logs

# install app dependencies
COPY package*.json ./

# install nano cmd editor as it's not bundled with node:carbon
# RUN apt-get update
# RUN apt-get install nano

# test bcrypt segmentation fault error
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server/server.js"]
