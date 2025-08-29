FROM node:alpine3.21 AS build-home
RUN apk add --no-cache git

WORKDIR bookshop
COPY . .
RUN npm install && npm run build


FROM node:alpine3.21
WORKDIR /bookshop
COPY --from=build-home /bookshop/.next .next
COPY --from=build-home /bookshop/public public 
COPY --from=build-home /bookshop/package*.json ./
COPY --from=build-home /bookshop/node_modules ./node_modules
EXPOSE 3000
CMD ["npm","start"]


