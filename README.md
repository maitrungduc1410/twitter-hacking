# twitter-hacking

> This project try to know how Twitter prevent user from viewing its source by using \"View Page Source\" on browser

# How to setup
- Clone the source code to server
- Make sure your server has install Nginx
- Copy the setup from my `nginx.default.conf` to your Nginx config file (remember to change the domain name or your server IP to fit yours)
- Start your Nginx and go to your domain/IP and test

> [!CAUTION]
> By default nginx uses user `www-data` to run, so make sure you clone the source code to directory that's accessible by `www-data`, Eg. `/var/www/data` is good example
# Note
- Nothing much within 3 HTML files and also static folder
- The trick is in the Nginx config file

# Demo
- You can check my demo: https://twitter-hacking.jamesisme.com/