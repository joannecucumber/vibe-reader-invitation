# KOL 邀請函｜設計到上線工作流程

從 Claude Design 拿到 HTML/JSX 雛形 → 手機可用的公開網站。一個 KOL 10 分鐘搞定。

## 前置工具

```bash
# 必裝
brew install gh               # GitHub CLI
curl -fsSL https://bun.sh/install | bash   # Bun（含 bunx）

# 登入一次
gh auth login
bunx vercel@latest login      # 第一次會開瀏覽器
```

## 1. 取得設計 handoff

從 Claude Design 的 URL 下載的是 **gzip tar 包**（不是一般網頁）。

```bash
curl -sSL "<DESIGN_URL>" -o package.gz
gunzip package.gz
tar -xf package
# → 解開後會有 untitled/README.md, untitled/chats/, untitled/project/

# 必讀：
cat untitled/README.md              # 使用指南
cat untitled/chats/chat1.md         # 設計師跟 AI 的對話，意圖全在這
```

## 2. 首次專案設定

```bash
# 搬到正式位置
mv untitled/project ~/vibe-reader-invitation
cd ~/vibe-reader-invitation

# 清掉設計雛形用的 runtime Babel，改預編譯 JSX（手機載入快 10x）
cat > build.sh <<'EOF'
#!/bin/bash
set -e
cd "$(dirname "$0")"
cat components/Envelope.jsx components/Ticket.jsx components/HoloChip.jsx \
    components/Terminal.jsx components/App.jsx > /tmp/invitation.jsx
bunx --bun esbuild /tmp/invitation.jsx \
    --loader:.jsx=jsx --jsx=transform --minify --target=es2017 \
    --outfile=invitation.js
EOF
chmod +x build.sh
./build.sh
```

改 `index.html`：移除 Babel CDN、React 改 production UMD、改用 `invitation.js`：

```html
<!-- 移除：babel.min.js 這行 -->
<!-- 改成：react.production.min.js / react-dom.production.min.js -->
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin></script>
<!-- body 底部：所有 text/babel scripts 換成這一行 -->
<script src="invitation.js"></script>

<!-- favicon 加這兩行（可選）-->
<link rel="icon" type="image/png" href="assets/app-icon.png" />
<link rel="apple-touch-icon" href="assets/app-icon.png" />
```

## 3. 部署 + 設定

```bash
# 第一次部署 — 會問一串，project name 輸入 kol 名字
bunx vercel@latest --prod
# 照答：y → 自己帳號 → n (link existing) → 取個名 → ./ → n (modify settings)

# ⚠️ 關鍵：關掉 Deployment Protection（預設開，訪客要登入 Vercel）
TOK=$(cat ~/Library/Application\ Support/com.vercel.cli/auth.json | grep -oE 'vca_[a-zA-Z0-9]+' | head -1)
PROJ=$(cat .vercel/project.json | grep -oE '"projectId":"prj_[^"]+"' | cut -d'"' -f4)
TEAM=$(cat .vercel/project.json | grep -oE '"orgId":"team_[^"]+"' | cut -d'"' -f4)
curl -sS -X PATCH "https://api.vercel.com/v9/projects/$PROJ?teamId=$TEAM" \
  -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
  -d '{"ssoProtection":null}' > /dev/null
echo "protection off ✓"

# 綁短網址（例如 kevinwu-vibe.vercel.app）
bunx vercel@latest alias set <deployment-url> kevinwu-vibe.vercel.app
```

測試（**必須用無痕視窗**，普通視窗會有你自己 Vercel 登入狀態的假象）：

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://kevinwu-vibe.vercel.app
# 要看到 200，不能 401
```

## 4. 迭代設計

```bash
# 1) 改檔案（components/*.jsx 或 styles/*.css）
# 2) 如果改的是 JSX 才需要這行：
./build.sh
# 3) 部署
bunx vercel@latest --prod
# 4) 短網址自動指向新版（project 自動 alias），custom alias 需要重綁：
bunx vercel@latest alias set invitation-eosin-phi.vercel.app kevinwu-vibe.vercel.app
# 5) git 存檔
git add -A && git commit -m "..." && git push
```

## 5. 複製給下一個 KOL

```bash
cp -r ~/vibe-reader-invitation ~/vibe-reader-invitation-joanne
cd ~/vibe-reader-invitation-joanne
rm -rf .vercel          # 解除舊專案連結
```

改兩處，都在 `components/App.jsx`：

```jsx
// 1) 網紅名字
"influencer": "Joanne｜設計觀察日記"

// 2) 邀請碼
{ label: "Unlimited · Monthly · First month 50% off", code: "JOANNEUM50" },
{ label: "Plus · Yearly · First year 50% off",        code: "JOANNEPY50" },
```

```bash
./build.sh
bunx vercel@latest --prod    # 第一次 → 輸入新 project name 如 joanne-vibe
# 關 protection（同第 3 步的 curl）
# 綁 joanne-vibe.vercel.app
```

## 常見地雷

| 症狀 | 原因 | 解法 |
|---|---|---|
| 手機載入 3-5 秒 | Babel standalone 在瀏覽器即時編譯 JSX（2.8 MB） | 一定要跑 `./build.sh` 預編譯 |
| 朋友打開要求登入 Vercel | 新 project 預設開 Deployment Protection | 第 3 步的 curl PATCH 關掉 |
| `raw.githack.com` 有「One more step」攔截頁 | 故意防 phishing | 改用 `rawcdn.githack.com` production 子網域 |
| `bunx vercel` 報 `smol-toml` missing | bunx cache 壞 | 改用 `bunx vercel@latest`（鎖版本避 cache） |
| 新建的 GitHub repo Actions 被 block | GitHub 對新帳號 / 額度超標限制 | Vercel 部署不經過 GitHub Actions，不受影響 |
| `git push` 後 Vercel 沒自動 deploy | 這流程沒接 Git integration | 每次手動 `bunx vercel@latest --prod`；或去 Vercel dashboard 綁 repo |

## Git 組織建議

一個 KOL 一個 repo，命名 `vibe-reader-invitation-<kol>`。想搬歷史：

```bash
# 從 monorepo 抽子資料夾 + 保留 commit 歷史
git subtree split --prefix=path/to/folder -b invitation-only
git push -f git@github.com:user/new-repo.git invitation-only:main
```

## 目錄結構（標準）

```
vibe-reader-invitation/
├── index.html           # 掛 React + invitation.js
├── invitation.js        # build.sh 產出，~24 KB
├── build.sh             # JSX 編譯腳本
├── components/          # JSX 原始檔
│   ├── App.jsx          # ← 只改這個：influencer + codes
│   ├── Ticket.jsx       # 主設計（ticket 飛進來）
│   └── ...（其他 variants）
├── styles/
│   ├── colors_and_type.css   # design tokens
│   └── invitation.css        # 邀請函專屬
├── assets/
│   ├── app-icon.png
│   └── sparkle.svg
└── .vercel/             # Vercel project 連結（gitignore）
```
