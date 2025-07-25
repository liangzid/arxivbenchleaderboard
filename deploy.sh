#!/bin/bash


git pull origin

sudo mkdir -p /var/www/arxivroll.moreoverai.com

npm run build
sudo cp -r ./out/* /var/www/arxivroll.moreoverai.com

sudo chown -R www-data:www-data /var/www/arxivroll.moreoverai.com
sudo chmod -R 755 /var/www/arxivroll.moreoverai.com

ls -al /var/www/arxivroll.moreoverai.com


sudo nginx -t
sudo systemctl restart nginx
