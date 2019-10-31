FROM node:10 as dep

COPY package.json package-lock.json ./

RUN apt install python libpixman-1-dev libpixman-1-0
RUN npm install --production

FROM node:10
RUN groupadd -r --gid 1007 dockerrunner && useradd -r -g dockerrunner dockerrunner
WORKDIR /app
COPY --from=dep /node_modules ./node_modules
EXPOSE 8000
ADD . .
USER dockerrunner
CMD [ "node", "index.js", "--port", "8000", "/data/" ]
