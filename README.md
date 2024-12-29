## 概要
2024年の活動を振り返ることができます。

![overview](https://github.com/user-attachments/assets/8280c513-2444-4699-b65d-02fd5a757073)

## 開発サーバーの起動

```sh
bun i
bun dev
```

## セルフホスティング

### 環境変数

`.env.example`を参考に環境変数を用意して下さい。

権限の問題で組織のリポジトリやプライベートリポジトリにアクセスを許可できない場合は、`GITHUB_TOKEN`にトークンを設定してくれたら見れると思います。
```ts
GITHUB_ENV="ghp_..."
```

### デプロイ

以下のコマンドで `Cloudflare Pages`にデプロイ可能です。
```sh
bun run deploy
```
2回目以降はワークフローで動かすことも可能です
その場合は以下をリポジトリシークレットに追加してください

```sh
CLOUDFLARE_PROJECT_NAME
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
```

## 記事
https://zenn.dev/namidapoo/articles/dev-recap-2024
