#!/usr/bin/env bash


:<<BLOCK
read -p "input old image tag, you will delete it" oldtag
echo $oldtag
echo -e "\033[41;37m something here \033[0m" 
BLOCK



function git.branch {
  br=`git branch | grep "*"`
  echo ${br/* /}
}



if [ `git.branch` = $1 ] ; then  
    echo "您当前所在分支：$1"
else   
    echo "您当前分支不是$1，即将退出";
		exit 0
fi 

echo "您现在有的版本如下："
docker images | grep 172.28.3.45:5000/manage-skynet

read -p "请输入旧版本的docker image tag" oldtag
echo $oldtag

read -p "请输入新的TAG" tag
echo $tag


rm -rf ./server/public/dist/


npm run build

docker rmi manage-skynet:$oldtag --force
docker rmi 172.28.3.45:5000/manage-skynet:$oldtag --force

docker build -t manage-skynet:$tag .

docker tag manage-skynet:$tag 172.28.3.45:5000/manage-skynet:$tag

docker push 172.28.3.45:5000/manage-skynet:$tag

