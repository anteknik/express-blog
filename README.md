# Simple Blog Engine
[![Total Downloads](https://poser.pugx.org/anteknik/express-blog/downloads)](https://packagist.org/packages/anteknik/express-blog)
[![Latest Unstable Version](https://poser.pugx.org/anteknik/express-blog/v/unstable)](https://packagist.org/packages/anteknik/express-blog)
[![License](https://poser.pugx.org/anteknik/express-blog/license)](https://packagist.org/packages/anteknik/express-blog)
[![NPM Version](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/express-blog)
[![NPM Downloads](https://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.com/package/express-blog)

This repository contains a sample implementation of a simple blog engine with NodeJS and ExpressJS. 

## Dependencies

Before you can run a blog , make sure some things have been there :

1. MySQL database , with the model in accordance with the existing table in the 'data' directory.
2. The Environment following variables are configured :

    a. 'DB_HOST', contains hostname of the database system.
    
    b. 'DB_USER', contains lists of users who can access the database.
    
    c. 'DB_PASSWORD', contains user passwords in (b).
    
    d. 'DB_BLOG', contains the name of the database that will be used.

In terms NodeJS , before installing dependency through 'npm' , first run the following command (Windows):

    $ npm install -g gulp
    $ npm install -g node-gyp

for Linux and Mac users, use sudo :

    $ sudo npm install -g gulp
    $ sudo npm install -g node-gyp

After the command exits, install dependency with the command :

    $ npm install

both Mac, Windows, or Linux.

## Running Blog

There is only one command to run a blog, namely :

    $ gulp server

And the blog will be accessible in the http://localhost:3000/
