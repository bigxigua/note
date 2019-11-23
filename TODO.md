## 产品文档
1. 左编辑右目录
2. 左预览右滑动跟随目录

<!-- /usr/local/nginx/sbin -->
<!--  -->

写一个git emoji 配合git commit 的工具

user root;
worker_processes auto;
pid /run/nginx.pid;

events {
        worker_connections 768;
        # multi_accept on;
}

http {
        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 65;
        types_hash_max_size 2048;
        include /etc/nginx/mime.types;
        default_type application/octet-stream;

        log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;

        ##
        # Gzip Settings
        ##

        gzip on;
        gzip_disable "msie6";
        gzip_min_length 1k;
        gzip_comp_level 1;
        gzip_static on;
        gzip_vary on;
        # gzip_proxied any;
        # gzip_comp_level 6;
        gzip_buffers 4 8k;
        # gzip_http_version 1.1;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        include /etc/nginx/conf.d/*.conf;
        include /etc/nginx/sites-enabled/*;
        server {
          listen 80;
          server_name www;
          return 301 https://$host$request_uri;
        }
        server {
          listen      443;
          server_name bigxigua.net;
          charset     utf-8;
          ssl         on;
          ssl_certificate: /etc/nginx/cert/bigxigua.pem;
          ssl_certificate_key: /etc/nginx/cert/bigxigua.key;
          ssl_session_timeout: 5m;
          ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
          ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
          ssl_prefer_server_ciphers on;
          location / {
             try_files $uri $uri/ /;
             root    /root/workspace/note/app/dist;
             index   index.html index.htm;
          }
          location /editor/ {
                root /root/workspace/note/app/public;
          }
          location /fonts/ {
                root /root/workspace/note/app/public;
          }
          location /images/ {
                root /root/workspace/note/app/public;
          }
          location /css/ {
                root /root/workspace/note/app/public;
          }
        }
}


docker run -p 80:80 --name bigxigua1 -p 443:443 -v /etc/nginx/cert:/etc/nginx/cert -v /etc/nginx/nginx.conf:/etc/nginx/nginx.conf -v /etc/nginx/html:/usr/share/nginx/html -v /etc/nginx/log:/var/log/nginx -d nginx -t

docker run -d --name=haha --restart always -p 80:80 -p 443:443 -v /opt/nginx/conf.d:/etc/nginx/conf.d -v /etc/nginx/cert:/etc/nginx/cert -v /etc/nginx/nginx.conf:/etc/nginx/nginx.conf -v /etc/nginx/html:/usr/share/nginx/html -v /etc/nginx/log:/var/log/ nginx

e34770726210


./configure --user=www --group=www --add-module=../ngx_cache_purge-1.3/ --prefix=/applications/nginx-1.6.0 --with-http_stub_status_module --with- --with-http_flvhttp_ssl_module_module --with-http_gzip_static_module
[root@server nginx-1.6.0]# make && make install

./configure --user=www --group=www --add-module=../ngx_cache_purge-1.3/ --prefix=/applications/nginx-1.6.0 --with-http_stub_status_module --with-http_ssl_module --with-http_flv_module --with-http_gzip_static_module

make && make install

cd /usr/local/nginx/sbin
vim /usr/local/nginx/conf/nginx.conf


logs/access.log
nginx path prefix: "/usr/local/nginx"
  nginx binary file: "/usr/local/nginx/sbin/nginx"
  nginx modules path: "/usr/local/nginx/modules"
  nginx configuration prefix: "/usr/local/nginx/conf"
  nginx configuration file: "/usr/local/nginx/conf/nginx.conf"
  nginx pid file: "/usr/local/nginx/logs/nginx.pid"
  nginx error log file: "/usr/local/nginx/logs/error.log"
  nginx http access log file: "/usr/local/nginx/logs/access.log"
  nginx http client request body temporary files: "client_body_temp"
  nginx http proxy temporary files: "proxy_temp"
  nginx http fastcgi temporary files: "fastcgi_temp"
  nginx http uwsgi temporary files: "uwsgi_temp"
  nginx http scgi temporary files: "scgi_temp"