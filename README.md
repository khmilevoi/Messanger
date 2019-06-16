# Messanger

Чтобы запустить приложение необходимо устновить платформу Node.js.
Чтобы сделать это перейдите по [этой ссылке](https://nodejs.org/dist/v10.16.0/node-v10.16.0-x64.msi).

Затем необходимо установить СУБД PostgreSQL. Для этого перейдите по [этой ссылке](https://www.postgresql.org/download/). И выбрав свою операционную систему устновите СУБД.
При устновке при вводе пароля необходимо вписать 

  53574268sat
  
Затем необходимо запустить pgAdmin и перейдя в сервер, нажать правой кнопкой мыши на него и создать базу данных с именем

  kh_chat

затем, нажав правой клавишей мыши по базе данных и выбрав пункт "Query Tools...", вставить в появившееся поле код из файла

  backup.sql

затем выполнить его, нажав на кнопку в форме молнии

После этого выполнить файл install.bat в директории приложения, а после того как все зависимости и библиотеки установятся, активировать файл start.bat

Если все действия были соверщенны правильно, то по ссылке http://localhost:3000 должно запуститься приложение
