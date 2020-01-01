FROM node:latest
VOLUME /tmp:/tmp
RUN mkdir -p /srv
WORKDIR /srv
COPY ./server /srv
RUN cd /srv && npm install
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ENV SERVICE_TAGS traefik.tags=cj.com,traefik.frontend.rule=Host:manage.loongcent.com.cn,traefik.enable=true,traefik.frontend.entryPoints=http,traefik.frontend.passHostHeader=true
ENV SERVICE_3000_CHECK_HTTP /health
ENV SERVICE_3000_NAME manage-skynet

EXPOSE 3000
ENTRYPOINT ["npm", "run"]
