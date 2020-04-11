# YadorigiGASWebRTCSignalingServer

Simple WebRTC Signaling Server On Google Apps Scripts For Yadorigi FrameWork

## sample API

https://script.google.com/macros/s/AKfycbyEIu-LGf6EuywyQnEq41Tf21tU0iB3DCDkPBygQkukJEVe3Zo/exec

### Test Page

https://ryunosinfx.github.io/YadorigiGASWebRTCSignalingServer/

### Usage

導入手順

- google にアカウントを開設
- Google Spread Sheet の空のスプレッドシートを開いく
- スクリプトエディタを開き
- YadorigiWebRTCSignalingServer.js をコピー
- 公開 → ウェブアプリケーションとして導入を開く
- Deploy as 　 web app のダイアログで次の設定公開
  - Project version を New
  - Execute the app as:を Me
  - Who has access to the app:を Anyone,even anonymuos
- Current web app URL:で指定された URL にアクセスで利用可能になります。

## spec

## Simple REST API(only POST and GET Method)

### Method :GET:

データが無い場合は文字列 "null"が帰ります。

#### params:(command,group,fileName)

- command:どの処理を呼ぶか指定します。必須
  - get: 指定ファイル名のデータを取得
  - hash: 指定ファイル名のハッシュを取得
  - next: 指定ファイル名の次のデータを取得
  - last; 最後のデータを取得
- group:必須
  - シグナリングするグループを限定します。
- fileName
  - 登録されているファイル名です。
-

### example:

- https://script.google.com/macros/s/AKfycbyEIu-LGf6EuywyQnEq41Tf21tU0iB3DCDkPBygQkukJEVe3Zo/exec?command=get&group=a_1586362907476&fileName=a12a_1586362907476.file

### Method :POST:

GAS の制約で、秒間４件程度しか登録が成功しません。
また、登録成功、登録失敗も API のレスポンスは同じ見分けが付かないです。

#### params:(group,fileName,data,hash)

文字数以上は切り捨て、指定も自主以外は削除します。
レコード生存期間は 10 分です。削除は次の POST 時に実施されます。

content-type:application/x-www-form-urlencoded
で送ってください。文字種はエンコードが不要なものだけ受け付けます。

- group:必須
  - シグナリングするグループを限定します。
  - 128 文字までで、文字種は[^-_\.0-9a-za-z]のみ
- fileName:必須
  - ファイル名です。
  - 128 文字までで、文字種は[^-_\.0-9a-za-z]のみ
- data:必須
  - ファイル本体です。
  - 最大 10KiB までで、文字種は[^-_\.0-9a-za-z]のみ
- hash
  - ファイルのハッシュ値です。
  - SHA512 の Base64 を想定
  - 90 文字までで、文字種は[^-_\.0-9a-za-z]のみ

## 開発 Tips

clasp をローカル環境で終わらせる場合のアップロード

./node_modules/@google/clasp/src/index.js push -f
