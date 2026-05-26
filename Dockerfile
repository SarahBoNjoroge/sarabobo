FROM php:8.3-apache

# Install mysqli and other extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy all project files
COPY . .

# Install PHP dependencies
RUN composer install --ignore-platform-reqs --no-interaction --no-progress

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set Apache to serve from root so /api/books/index.php works
RUN echo '<Directory /var/www/html>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/custom.conf \
    && a2enconf custom

EXPOSE 80