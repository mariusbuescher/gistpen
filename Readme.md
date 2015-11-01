# gistpen

> A small application that turns your gists in small web sample snippets.

## Requirements

There are some requirements that have to be met for this project.

- node.js v4.2.x
- redis
- a GitHub account

## Set up

First install all dependencies by typing ```npm install```. After that make sure
redis is up and running. You can check that by typing ```ps -A | grep redis``` in
you console (POSIX only).

After you are done with that you will need to set your configurations right. Add a
file to the config folder that is named like the your environment will be named, e.g.
development. There you can overwrite the configurations for GitHub with your own client ID
and secret. Read [this](https://developer.github.com/v3/oauth/) on how to create an app.

After that set your environment name: ```export NODE_ENV=<env-name>```

Done? Fine. Now type ```npm start``` and you are good to go.
