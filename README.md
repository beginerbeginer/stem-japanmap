# stem-japanmap

## 内容

- 各都道府県におけるプログラミングの教育環境についてのデータをグラフ化したアプリ
- [gif動画](https://gyazo.com/09b86392aa582b5970ae2460981dc6a9)

## 環境構築方法

1. yarn install
1. yarn start

## ディレクトリ構成


```
.
├── org_data
│   ├── 20200107-mxt_jogai02-000003715_002.pdf
│   ├── 20200107-mxt_jogai02-000003715_002.xlsx
│   └── link.webloc
├── package.json
├── public
│   ├── data
│   │   ├── city.geojson
│   │   ├── city.pbf
│   │   ├── pref.geojson
│   │   └── pref.pbf
│   └── index.html
├── src
│   ├── App.js
│   ├── components
│   │   ├── Leggend.js
│   │   ├── RenderLayers.js
│   │   └── Window.js
│   ├── index.js
│   └── styles.css
└── yarn.lock
```
