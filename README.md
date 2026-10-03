# 欧陆改革宗 · 海德堡要理问答研读

静态 HTML 教学站：海德堡要理问答（Heidelbergse Catechismus / 《海德堡要理问答》）全部 **52 主日 · 129 问答**。以**三项联合信条**与**三大普世信经**为坐标，按愁苦、救赎、感激展开；先整本圣经红线与圣约总图，再逐主日详解。

信条与其他信经只标条款 / 问答号，不转载全文。问答解说为原创教学转述，非现代有版权中译全文复制。

## 线上地址

- GitHub Pages: https://07-je-grok-love-personal-20260928.github.io/heidelberg-catechism-study-continental-20261003/
- Netlify: https://heidelberg-catechism-study-continental-20261003.netlify.app/
- Surge: https://heidelberg-catechism-study-continental-20261003.surge.sh/

## 目录

```
heidelberg-catechism-study-continental-20261003/
├── index.html
├── assets/
│   ├── style.css
│   └── app.js
├── netlify.toml
├── _headers
├── package.json
└── README.md
```

## 本地预览

```bash
cd heidelberg-catechism-study-continental-20261003
npm start     # http://127.0.0.1:3457
```

## 重新部署

```bash
# GitHub Pages：推送到 main 即可
git push origin main

# Netlify（需已登录 CLI）
netlify deploy --prod --dir=.

# Surge（需已配置 ~/.netrc；CNAME 仅本机发布用，已 gitignore）
echo 'heidelberg-catechism-study-continental-20261003.surge.sh' > CNAME
surge ./ heidelberg-catechism-study-continental-20261003.surge.sh
rm -f CNAME
```

## 认信立场

唯独圣经、唯独恩典、唯独信心、唯独基督、唯独荣耀归于神。要理是牧养安慰的教理摘要，不是圣经之外的第二权威（比利时信条第 5、7 条）。

版本：v20261003-2 · Soli Deo Gloria
