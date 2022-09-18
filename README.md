# My Photos

Salesforce Developer Edition could be a great low-code development platform for Sunday programmers.

And the size of storage (5MB data storage and 20MB file storage) is large enough for storing a few hundreds of low-resolution photo images.

This project is to develop a mobile photo app based on Salesforce Platform (i.e., Salesforce Platform license is assigned to the users).

- Use navigator.geolocation for geolocation (GPS).
- Use HTML input element to capture image from a mobile camera app.

#### Deployment instruction

This project has developed an unmanaged package "myphotos" with "Salesforce Platform" license.

Just deploy it to your salesforce platform by VSCode or SFDX CLI.

Then create a user with "Salesforce Platform" license and assign a permission sets "MyPhotos" to the user.

That's it!

#### Camera for smart phone

This app makes use of a native mobile camera app via HTML input element:

```
      <label class="slds-button slds-button_brand">
        <input style="display: none;" class="slds-col slds-p-around_small" type="file" accept="image/*"
          capture="environment" onchange={handleCapture} />
        Camera
      </label>
```

<img src="./images/Camera.png" height="360px">

#### Home page for desktop

<img src="./images/Tressa.png" width="600px">

#### Record page for desktop

<img src="./images/RecordPage.png" width="600px">

#### Image viewer

<table>
  <tr>
    <td valign="top"><img src="./images/Bunmeido.png"/>
    <td valign="top"><img src="./images/Bunmeido2.png"/></td>
    <td valign="top"><img src="./images/FullMoon.jpg"></td>
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
- [camera](./myphotos/myphotos/main/default/lwc/camera)
- [gps](./myphotos/myphotos/main/default/lwc/gps) (GPS library, not LWC component)

## Distance caliculation for each record of "Record__c"

I added a custom field "Geolocation__c" to "User" standard object.
Then I added a custom formula field "Distance__c" to "Record__c":

```
Distance(Geolocation__c, $User.Geolocation__c, 'km')
```

## Remote site settings

[NominatimCallout](./myphotos/myphotos/main/default/classes/NominatimCallout.cls) Apex script assumes a remote site setting as follows:

<img src="./images/RemoteSiteSettings.png" width="600px">

## Lightning Web Security (LWS)

Although this project does not use HTML5 webcam capability, this is just a note for future extensions of this project.

It is necessary to enable LWS to use navigator.mediaDevices.getUserMedia() to capture image from Mac and PC (its security protected by LWS).

<img src="./images/LWS.png" width="500px">

## References
- [Using Leaflet to show maps in your LWC components](https://sonneiltech.com/2021/01/using-leaflet-to-show-maps-in-your-lwc-components/)
- [Develop Against Any Org](https://developer.salesforce.com/images/atlas.en-us.238.0.sfdx_dev.meta/sfdx_dev/sfdx_dev_develop_any_org.htm)
- [Nominatim](https://nominatim.org/)
- [Custom File Upload Using LWC](https://www.salesforcetroop.com/custom_file_upload_using_lwc)
