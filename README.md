# My photos

(Work in progress)

## Goals

- Mobile photo app based on React and SpringBoot/Heroku for my weekend cycling
- Integration with Salesforce by Heroku Connect to privide rich UIs for desktop

## Components

- A custom object on Salesforce Platform
- React-based mobile app (frontend)
- SpringBoot-based REST API service with PostgreSQL (backend)
- Heroku Connect for synchronizing data between Heroku and Salesforce Platform
- Apex scripts and Lightning Web Components to privide rich UIs for desktop

## Architecture

```
                            Table <- - - - - in sync - - - - -> Custom object
[Mobile app]---REST---[REST API service]---Heroku Connect---[APEX backend scripts]---[LWC frontend]
  React                SpringBoot/Heroku                     Salesforce Platform      Web components

```

## Projects
- [spring-myphotos](https://github.com/araobp/spring-myphotos)
- [react-myphotos](https://github.com/araobp/react-myphotos)
- [sfdc-myphotos](https://github.com/araobp/sfdc-myphotos) (this project has just started)

