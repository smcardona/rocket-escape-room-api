# rocket-escape-room-api

This app simulates a scape room kind off game on the web. It uses json-server to have a static page\
that uses the api to read rooms as json objects and then render them on HTML.\
\
Right now this can run fine on linux, and with knowledge of nodejs can be run on Windows too. 
We are working on creating a docker image or container, so you could use this app from docker with just few clicks and configurations

## Requirements

To run this app with the same environment we used, you require:

### node v20+ and npm
You can use  [nvm](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/) for windows or linux to install different verions of node\
Or you could quickly install the node version on windows on [this page](https://nodejs.org/en/download/prebuilt-installer) or using apt on linux:\
```bash
$ sudo apt install nodejs=20.x.x npm
```

### json-server
To run the program you could install json-server globally so you dont have npm packages in the folder:\

```bash
    $ npm install json-server --global
```
Note: If you are in linux, and you wanted to use http default port 80, then you would have to run the command as superuser,\
so the package install globally on superuser directory. Then to run the server you also need to use sudo.


## Running the app locally
To start the program you can use the next command if you installed it globally.\
You can choose which port the host is gonna use. Default is 3000 if you dont specify it.
```bash
    $ npx json-server RocketAPI.json --port 3000
```
Note again: if you wanna use port 80 on linux you need higher permissions, so mind using sudo at the beginning


## Using docker
This project now has files to build docker images and compose.\
We plan to push the image to a docker repository later.\
For now you can run the following commands in the correct order:\

```bash
    $ docker build -t scaperoom .
```

This will create the image that you can compose into a container using the next command:
```bash
    $ docker compose up -d
```

This will run the app on the port 80 of the localhost. If you want a different port you can specify it modifying the field in [docker-compose](docker-compose.yml).\
Or you can run the next command to run a new container bassed on the image and telling the port (e. 8000)

```bash
    $ docker run -d -p 8000:3000 --name rocket-api scaperoom
```


 
## Credits
This is a group project for class.\
The team is:
 - Ignacio Loayza
 - Alex Borda
 - Pau Lorca
 - Eric Ayxendri
 - Me
 	



