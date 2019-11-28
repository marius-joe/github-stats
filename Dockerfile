FROM node:10-slim

# Set to a non-root user
USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# Install app dependencies
# Use a wildcard is to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./

RUN npm install

# Bundle app source code
COPY --chown=node . .

RUN npm run build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000

EXPOSE ${PORT}
CMD [ "node", "." ]
