# rocket-escape-room-api

This app simulates a scape room kind off game on the web. It uses json-server to have a static page\
that uses the api to read rooms as json objects and then render them on HTML.\
\
Right now this can run fine on linux, and with knowledge of nodejs can be run on Windows too. 
We are working on creating a docker image or container tho, so you could use this app from docker with just few clicks and configurations

## Requirements

To run this app with the same environment we used, you require:

### node v20+
If you dont have it, you can use nvm for installing it or the next command:\
```bash
 $ sudo apt install nodejs=20.x.x
```

### npm
You can install it via apt
```bash
 $ sudo apt-get install npm
```

### json-server 
For easy use it should be installed globally for the user\
Also this npm package needs superuser/admin permissions to use port 80.\
So you can install it with high level permissions to use this port OR\
You can install globally on a normal user but a wirning will show if you try to use port 80, so gotta change it.\
\
Commands:
```bash
# This for super user 
 $ sudo npm install json-server --global
# This for normal user
 $ npm install json-server --global
```
 
 
 ## Credits
 This project is a grupal project for class.\
 The team is:\
  - Ignacio Loayza
  - Alex Borda
  - Pau Lorca
  - Eric Aixendri
  - Me
 	



