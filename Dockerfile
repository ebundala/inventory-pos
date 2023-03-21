FROM node:18
# 12.22.3-buster

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn install

# If you are building your code for production
# RUN yarn ci --only=production
# ARG GOOGLE_APPLICATION_CREDENTIALS=serviceAccount.json
# Bundle app source
COPY . .
# RUN yarn run prisma:generate
#RUN rm -rf node_modules && yarn install --frozen-lockfile
ARG NEXT_PUBLIC_HOST=https://iniswap.finance
ARG NEXT_PUBLIC_CLOUD_NAME=ddbqbk80e
ARG NEXT_PUBLIC_CLOUD_PREFIX=exinhn0j
RUN yarn run build
#attach static files volume here
VOLUME [ "/usr/src/app/public" ] 
# VOLUME [ "/usr/src/app/$GOOGLE_APPLICATION_CREDENTIALS" ]

EXPOSE 3000

CMD [ "yarn","start" ]
