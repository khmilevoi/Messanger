# Messanger

Чтобы запустить приложение необходимо установить платформу node.
Чтобы перейти к установке нажмите [сюда](https://nodejs.org/dist/v10.16.0/node-v10.16.0-x64.msi)

Далее необходимо устновить СУБД PostgreSQL.
Чтобы перейти к установке нажмите [сюда](https://www.postgresql.org/download/) и выбирете свою операционную систему.

При создании пароля, необходимо ввести 

      53574268sat

Затем необходимо создать базу данных с именем 

      kh_chat
      
Открыть панель запросов, нажав на базу данных правой кнопкой мыши и выбрать пункт "Query Tool..." и из файла backup.sql вставить комманды в открывшееся поле, после чего запустить, нажав кнопку с иконкой молнии.

Далее необходимо запустить файл 

      install.bat
      
И когда все зависимости и библиотеки установятся, необходимо запустить файл 

      start.bat
      
