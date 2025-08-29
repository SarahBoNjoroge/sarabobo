FROM php:8.1-apache
RUN apt-get update && apt-get install git -y \
  && docker-php-ext-install mysqli pdo pdo_mysql 
RUN rm -rf /var/www/html
WORKDIR /var/www/bookshop
COPY ./api .
RUN rm -f /etc/apache2/sites-available/000-default.conf
COPY apache/bookshop.conf /etc/apache2/sites-available/bookshop.conf
RUN a2enmod  rewrite headers
RUN a2dissite 000-default && a2ensite bookshop
EXPOSE 80
CMD  ["apache2-foreground"]

