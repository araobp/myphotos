# My Photos

## セールスフォース開発者エディション(無償)でつくる写真アプリ

当プロジェクトでは、Salesforceの開発者エディション（無償）で写真アプリをつくります。位置情報と紐づけたメモ付き写真記録を行えるところが、ここで開発する写真アプリの特徴です。以下、簡単に、このアプリの用途や目標を述べます。

- 当プロジェクトはSalesforce上におけるアプリ開発手法の勉強を当初の目的としております。多分、趣味でプログラミングしている方々(Salesforce関連の仕事をしているのではなく、純粋にプログラミングが好きな方々）にとっても、当プロジェクトの成果は参考になると思っています。
- 私は、このアプリを、私の週末の活動、買い物、散歩やサイクリングで利用しています。AndroidスマホへSalesforceアプリを入れておき、その上で、このアプリを利用しています。
- 基本的には写真記録アプリなのですが、Salesforce的な要素を多分に取り入れております。例えば、「次にあのスーパーへ行ったら、これを買おう」みたいなタスクを登録しておき、そのスーパーへ行った時にこのアプリを起動すると、タスク一覧が表示されます。
- このアプリを利用しながら継続的な改善を継続し、使い勝手が向上しつつあります。
- 現在はRelease 1.0の開発中（最終段階）ですが。。。色々と理由あり、モバイル向けフロントエンドをVueで開発開始。

## ドキュメント

- [概要設計書　Release 1.0](https://docs.google.com/presentation/d/e/2PACX-1vThFeg9FeNg4kEuNcWNcRyY2i67ijAPIiIBs82b_zYlq_BmLSSwvneXUAh5Sk-sQN7y7K5qXxb4oewN/pub?start=false&loop=false&delayms=3000) ... 作成中
- [マニュアル Release 1.0] ... 作成中

## Salesforce Platformでアプリを作ってみた感想

色々とPaaSやローコード開発プラットフォームを試した中で、Salesforceが一番良いと思ったのは、オブジェクトやフィールドを定義すると自動的にUIも生成されるので、オブジェクト定義だけで最低限のアプリとして機能するようになること。そして、その最低限のアプリを使いながら段階的に機能追加し、アプリを継続的に改善し続けることが出来ること。要は、アジャイル開発でアプリをつくるのに適していること。

また、LWCはとても魅力的。簡単に、デスクトップでもモバイルでも使えるレスポンシブなウエブページ（フロントエンド）をつくることが出来るし、SLDSのおかげで、見栄えの良いものが出来る。

また、ApexクラスはREST APIとして公開することもできるので、VueやReactでフロントエンドを作ることも可能。よって、例えば、趣味でVueアプリを作りたいけどバックエンドの開発は面倒だ。。。といった場合、Salesforce開発者エディションはとても役に立つ。セキュリティー、ユーザ認証、データ共有といった実装が面倒なところ、Salesforce開発者エディションがカバーしてくれる。

なので、Salesforce開発者エディションは、色々な意味でとても魅力的な開発プラットフォームである。

Salesforce Platformの難点としては、ガバナー制限を気にした開発が強要されること。これは、クラウドやデータベースリソースを複数のユーザや企業間で公平利用するという意味で、受け入れて行くしかない。

## その他

### いつものようにCORSに悩まされる

以下のアドオンで回避：

https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino/related?hl=ja

<hr>

Salesforce Developer Edition could be a great low-code development platform for Sunday programmers.

And the size of storage (5MB data storage and 20MB file storage) is large enough for storing a few hundreds of low-resolution photo images.

This project is to develop a mobile photo app based on Salesforce Platform (i.e., Salesforce Platform license is assigned to the users).

- Use navigator.geolocation for geolocation (GPS).
- Use HTML input element to capture image from a mobile camera app.
- Use Task object for location-based task reminder.

## Deployment instruction

This project has developed an unmanaged package "myphotos" with "Salesforce Platform" license.

Just deploy it to your salesforce platform by VSCode or SFDX CLI.

Then create a user with "Salesforce Platform" license with "Standard Platform User" profile, then assign a permission sets "MyPhotos" to the user.

That's it!

## Data model

This application uses the following objects and fields:

- "Record__c" custome object for text data of every photo images
- "Place__c" custom object for places I often go
- "Geolocation__c" custome field in "User" standard object for my current location
- "Content Version", "ContentDocument" and "ContentDocumentLink" for photo images

<img src="./images/Schema.jpg" width="600px">

## Components

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

## Images saved as Salesforce Files (ContentDocument/ContentVersion)

Images captured by a mobile camera are saved as Salesforce Files.

[Reference] https://qiita.com/panxl/items/c8a4d5ffe7fe92f6a3ab

<img src="https://camo.qiitausercontent.com/016a2b548a388b19bb86b9599da53f34eb16f207/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f3439363538392f36666339316633352d393661322d643734352d386532652d6366666439313663336338662e706e67" width="500px">

## References
- [Using Leaflet to show maps in your LWC components](https://sonneiltech.com/2021/01/using-leaflet-to-show-maps-in-your-lwc-components/)
- [Nominatim](https://nominatim.org/)
- [Custom File Upload Using LWC](https://www.salesforcetroop.com/custom_file_upload_using_lwc)
