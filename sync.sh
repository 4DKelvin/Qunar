#local server to local mac
rsync -ravz  --exclude="sycn.sh" --exclude="sql" --exclude="redstar" --exclude="manage.php" --exclude="*.sql"  --exclude="*.DS_Store" --exclude=".gitignore" --exclude="*.sql"  --exclude=".DS_Store" --exclude=".git" --exclude=".project" --exclude=".settings"  ~/Projects/Vue-Sui-Mobile/dist/* root@120.76.228.4:/home/wwwroot/m.ddjiadian.com/api/static/
