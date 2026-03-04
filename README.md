⚡ Built with Vibe Coding (ChatGPT-assisted development)

# MedProof

MedProof は
**医療文章の校閲を少しラクにするデスクトップツール**です。

![MedProof Screenshot](docs/screenshot.png)

医療記事を書いていると

・表記揺れ
・禁止語
・単位表記
・不自然な表現

などをチェックする必要があります。

MedProof はそれらを **自動検出して一覧表示**し、
文章の修正をサポートします。

---

# ✨ Features

* Before / After の **2ペインエディタ**
* Issue一覧表示
* 該当箇所ジャンプ
* txt / md / csv 読み込み
* ルールベース文章チェック
* Windowsデスクトップアプリ（EXE）

---

# 🚀 Run (開発)

```bash
cd apps/desktop
npm install
npm run dev
```

Electron アプリが起動します。

---

# 📦 Build

```bash
cd apps/desktop
npm run build
```

---

# 🖥 EXE作成

```bash
cd apps/desktop
npm run dist
```

生成される場所

```
apps/desktop/release
```

---

# 🧠 Vibe Coding

このプロジェクトは
**AIとの対話をベースにした開発（Vibe Coding）**で作られています。

設計
実装
デバッグ
ビルド

を **ChatGPTと対話しながら反復して開発**しています。

いわば

> 「思考 → 対話 → 実装 → 修正」

のループで作られたツールです。

---

# ⚠️ Notes

以下のログは Electron DevTools 由来のため問題ありません。

```
Autofill.enable failed
Autofill.setAddresses failed
```

また

```
watch exited with code 1
```

は Electron 終了時のプロセス停止ログです。

---

# License

MIT
