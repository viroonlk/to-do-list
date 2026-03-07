FROM php:8.1-apache
RUN docker-php-ext-install pdo pdo_mysql
RUN a2enmod rewrite headers
COPY . /var/www/html/
EXPOSE 80