# My Photos

## セールスフォース開発者エディション(無償)でつくる写真アプリ

当プロジェクトでは、Salesforce Platformによるアプリ開発を勉強するため、Salesforce開発者エディション（無償）上で写真アプリをつくります。位置情報と紐づけたメモ付き写真記録を行えるところが、ここで開発する写真アプリの特徴です。また、このアプリをスマホからも利用出来る様にします。

以下、簡単に、このアプリの用途を述べます：

- 私は、このアプリを、私の週末の活動、買い物、散歩やサイクリングで利用しています。スマホへSalesforceアプリ(Salesforce for Android/iOS)を入れておき、その上で、このアプリを利用しています。
- 基本的には写真記録アプリなのですが、Salesforce的な要素を取り入れております。例えば、「次にあのスーパーへ行ったら、これを買おう」みたいなタスクを登録しておき、そのスーパーへ行った時にこのアプリを起動すると、タスク一覧が表示されます。

## 未管理パッケージとして公開

本プロジェクトの成果はSalesforceへ未管理パッケージとしてupload済み (2022/10/29 ver1.2)

[未管理パッケージとしてインストール](https://login.salesforce.com/packaging/installPackage.apexp?p0=04t5i000000Z5f6)

## ドキュメント

- [概要設計書　Release 1.0](https://docs.google.com/presentation/d/e/2PACX-1vThFeg9FeNg4kEuNcWNcRyY2i67ijAPIiIBs82b_zYlq_BmLSSwvneXUAh5Sk-sQN7y7K5qXxb4oewN/pub?start=false&loop=false&delayms=3000) ... 作成中
- [マニュアル Release 1.0] ... 作成中

<hr>

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
