FROM mysql:8.0.33
LABEL "project"="Vprofile"
LABEL "Author"="mungai"

ENV MYSQL_ROOT_PASSWORD="1234"
ENV MYSQL_DATABASE="bookshop"
ADD db/sql_dump docker-entrypoint-initdb.d/db_backup.sql
EXPOSE 3306

