# Overview

Idle Backend is a service which holds all APIs for the entire IDLE ecosystem.

## How to build and run the project locally

### Prerequisites
- [NodeJS](https://nodejs.org/en/download) version 12.14.1 or higher
- [GIT](https://git-scm.com/downloads)
- Running [MariaDB 10.5](https://downloads.mariadb.org/mariadb/+releases/).
- Create a db and name it `idle`
- Create a user with username and password set to `idle`
- Grant user `idle` full privilege to db `idle`
- If you have docker, the previous 4 steps can be automated by executing:
    ```shell
      docker volume create idle-db # Only execute this once
      docker run -d --name=idle-db -p 3306:3306 -v idle-db:/var/lib/mysql \
      -e MYSQL_ROOT_PASSWORD=root \
      -e MYSQL_USER=idle \
      -e MYSQL_PASSWORD=idle \
      -e MYSQL_DATABASE=idle \
      mariadb:10.5  
    ```
- Lastly, execute all sql files in [migrations](./migrations) folder

### Steps

- Checkout the project
  ```shell
    git clone git@github.com:kyleoneil/idle-backend.git
  ```
- Download the dependencies
  ```shell
    cd idle-backend
    npm i
  ```
- Run the project
  ```shell
    npm start
    # or to run with hot reload enabled
    npm run dev
  ```
  