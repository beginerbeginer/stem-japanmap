# stem-japanmap

## 内容

- 各都道府県におけるプログラミングの教育環境についてのデータをグラフ化したアプリ
- [gif動画](https://gyazo.com/09b86392aa582b5970ae2460981dc6a9)

## 環境構築方法

1. yarn install
1. yarn start

## ディレクトリ構成（node_modulesを除く）


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


## コードリーディング(Macの場合)

- constをF12で定義へ移動しながら渡ってくる値を確認する

### 日本地図の表示についてのコードはApp.js

```javascript
// /projects/stem-japanmap/src/App.js

import React, { useEffect, useState } from 'react';
import DeckGL from 'deck.gl';
import { renderLayers } from './components/RenderLayers';
import Window from './components/Window.js';
import Leggend from './components/Leggend.js';

import { json, buffer } from 'd3-fetch';
import Pbf from 'pbf';
import Geobuf from 'geobuf';

const CITYDATA_URL = './data/city.geojson';
const PREFDATA_URL = './data/pref.geojson';

const MapWrapperStyle = {
	backgroundColor: '#444'
};

const HeaderStyle = {
	position: 'absolute',
	top: '0',
	zIndex: '9',
	width: '100%',
	height: '40px',
	whiteSpace: 'nowrap',
	overflowX: 'auto',
	backgroundColor: '#000'
};
const HeaderTitle = {
	color: 'white',
	textAlign: 'center',
	fontSize: '28px',
	lineHeight: 0
};

const FooterStyle = {
	position: 'absolute',
	bottom: '0',
	zIndex: '9',
	width: '100%',
	height: '40px',
	whiteSpace: 'nowrap',
	overflowX: 'auto',
	backgroundColor: '#000'
};

const FooterLink = {
	color: 'white',
	display: 'inline-block',
	marginLeft: '1em',
	marginTop: '16px',
	fontSize: '20px',
	lineHeight: 0
};

export default () => {
	const [ prefData, setPrefData ] = useState(null);
	const [ cityData, setCityData ] = useState(null);
	const [ detail, setDetail ] = useState();

	useEffect(() => {
		const fetchPrefBuff = async () => {
			const result = await buffer('./data/pref.pbf');
			const pd = new Pbf(new Uint8Array(result));
			const geo = Geobuf.decode(pd);
			setPrefData(geo);
		};
		fetchPrefBuff();

		const fetchCityBuff = async () => {
			const result = await buffer('./data/city.pbf');
			const pd = new Pbf(new Uint8Array(result));
			const geo = Geobuf.decode(pd);
			setCityData(geo);
		};
		fetchCityBuff();
	}, []);

	const [ viewport, setViewport ] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
		longitude: 136.8624917,
		latitude: 36.0880768,
		zoom: 6,
		maxZoom: 16,
		pitch: 0,
		bearing: 0
	});

	useEffect(() => {
		const handleResize = () => {
			setViewport((v) => {
				return {
					...v,
					width: window.innerWidth,
					height: window.innerHeight
				};
			});
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const onClick = (d) => {
		setDetail(d);
	};
	const windowClick = () => {
		setDetail(null);
	};

	return (
		<div>
			<div style={HeaderStyle}>
				<h1 style={HeaderTitle}>市町村教育委員会における小学校プログラミング教育に関する取組状況等調査</h1>
			</div>
			<Leggend />
			<DeckGL
				style={MapWrapperStyle}
				layers={renderLayers({
					cityData: cityData,
					prefData: prefData,
					onClick: onClick
				})}
				initialViewState={viewport}
				controller={true}
			/>
			<Window data={detail} onClick={windowClick} />
			<div style={FooterStyle}>
				<a style={FooterLink} href="https://shimz.me/blog">
					About
				</a>
			</div>
		</div>
	);
};
```

### 各都道府県についてのコードはWindow.js

```javascript
// /projects/stem-japanmap/src/components/Window.js  

import React from 'react';

const answerIndex = [
	null,
	'各校１人以上の教員が実施済みと把握',
	'各校１人以上の教員が年度末までに実施予定と把握',
	'一部の学校の教員が実施済み、あるいは年度末までに実施予定と把握',
	'行っていない、行わないと把握'
];

export default (props) => {
	const { data, onClick } = props;

	if (!data) return null;

	const p = data.object.properties;

	const address = [ p.KEN, p.SEIREI, p.GUN, p.SIKUCHOSON ].filter((d) => d).join('');
	const answer = answerIndex[p.answer];
	const style = {
		position: 'absolute',
		padding: '20px',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		color: 'white',
		fontSize: '12px',
		width: '300px',
		heigth: '150px',
		zIndex: '999',
		top: data.y,
		left: data.x
	};

	return (
		<div style={style} onClick={onClick}>
			<h1>{address}</h1>
			<p>{answer}</p>
		</div>
	);
};
```
