# My Photos

Salesforce Platform could be a great low-code development platform for Sunday programmers as well as for ISVs.

This project is to develop a mobile photo app based on Salesforce Platform.

- Use navigator.geolocation for geolocation (GPS).
- Use navigator.mediaDevices.getUserMedia() to capture image from Mac and PC (its security protected by LWS).
- Use HTML input element to capture image from a mobile camera.

---
## Project goal redirection (August 28th, 2022)

I have been enjoying and developing this app over a half year in my free time.

This project has been dependent on React as a frontend library and SpringBoot as a backend framework. The Java app on SpringBoot has been running on Heroku... Unfortunately, [this announcement](https://blog.heroku.com/next-chapter) made me sad.

I leave "heroku-connect" branch intact and switch back to "main" branch.

I am working on remaking this project to exclude the Heroku part (the API server backend implemented on SpringBoot and Heroku Connect) and the React part (frontend) from this project.

---
<table>
  <tr>
    <td valign="top"><img src="./doc/react-myphotos.png" height="350px"></td>
    <td valign="top"><img src="./doc/Tressa.png" height="350px"></td>
  </tr>
</table>

## Architecture

```
                                Record__c custom object
   [LWC components]-------------[APEX backend scripts]
    Web components               Salesforce Platform
                                          |
   [React frontend]-----------------------+
```

#### Original LWC components in this project

- [pictureMap](./myphotos/myphotos/main/default/lwc/pictureMap)
- [picturesMap](./myphotos/myphotos/main/default/lwc/picturesMap)
- [imageViewer](./myphotos/myphotos/main/default/lwc/imageViewer)

<img src="./doc/RecordPage.png" width="700px">

<table>
  <tr>
    <td valign="top"><img src="./doc/Bunmeido.png"/></td>
    <td valign="top"><img src="./doc/Bunmeido2.png"/></td>    
  </tr>
</table>

## Remote site settings

[NominatimCallout](./myphotos/myphotos/main/default/classes/NominatimCallout.cls) Apex script assumes a remote site setting as follows:

<img src="./doc/RemoteSiteSettings.png" width="600px">

## Lightning Web Security

Enable LWS (Lightning Web Security) to enable "navigator.mediaDevices.getUserMedia()".

<img src="./doc/LWS.png" width="500px">

## References
- [Using Leaflet to show maps in your LWC components](https://sonneiltech.com/2021/01/using-leaflet-to-show-maps-in-your-lwc-components/)
- [Develop Against Any Org](https://developer.salesforce.com/docs/atlas.en-us.238.0.sfdx_dev.meta/sfdx_dev/sfdx_dev_develop_any_org.htm)
- [Nominatim](https://nominatim.org/)
