# используем лбраз линкс Alpine 
FROM node:19.5.0-alpine

# указываем рабочую директорию

WORKDIR /app

# скопировать package-json-lock внутрб контейнера 

COPY package*.json ./

# учтановить зависимости

RUN npm install

# копируем всё остальное приложение в контенер

COPY . . 

# установить prisma

RUN npm install -g prisma

# генерируем prisma client

RUN prisma generate

# копируем prisma schema

COPY prisma/schema.prisma ./prisma/

# открыть порт в нашем контейнере 

EXPOSE 3000

#  запускаем сервер

CMD ["npm", "start"]