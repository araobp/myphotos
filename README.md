# My Photos

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
- [myphotos](./myphotos) (this project)
- [spring-myphotos](https://github.com/araobp/spring-myphotos/tree/heroku-connect) on "heroku-connect" branch
- [react-myphotos](https://github.com/araobp/react-myphotos/tree/heroku-connect) on "heroku-connect" branch

## CSP setting

The "[PhotoViewer](./myphotos/force-app/main/default/lwc/photoViewer)" LWC component issues a HTTP GET from JavaScript to MyPhotos REST API service hosted by the Heroku instance.

CSP setting is required for such as access:

<img src="./doc/CSP.png" width="900px">

## References
- [Using Leaflet to show maps in your LWC components](https://sonneiltech.com/2021/01/using-leaflet-to-show-maps-in-your-lwc-components/)
- [panolens-three](https://www.npmjs.com/package/panolens-three)
