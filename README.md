# My Photos

I have been enjoying this app over a half year in my free time.

Unfortunately, [this announcement](https://blog.heroku.com/next-chapter) made me sad.

I leave "heroku-connect" branch intact and switch back to "main" branch.

I am working on remaking this to exclude the Heroku part (the API server backend implemented on SpringBoot, and Heroku Connect) from this project.

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

## References
- [Using Leaflet to show maps in your LWC components](https://sonneiltech.com/2021/01/using-leaflet-to-show-maps-in-your-lwc-components/)
- [Develop Against Any Org](https://developer.salesforce.com/docs/atlas.en-us.238.0.sfdx_dev.meta/sfdx_dev/sfdx_dev_develop_any_org.htm)
- [Nominatim](https://nominatim.org/)
