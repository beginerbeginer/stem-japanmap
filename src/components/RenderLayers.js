import { GeoJsonLayer } from 'deck.gl';

const colorRange = [ null, [ 60, 255, 60 ], [ 60, 60, 255 ], [ 255, 255, 60 ], [ 255, 60, 60 ], [ 60, 60, 60 ] ];

export function renderLayers(props) {
	const { cityData, prefData, onClick } = props;

	if (!cityData) return [];


	const jsonStr = `
		{
			"status": "200 OK",
			"data": [
				{"jcode": "04100", "rate": 0.0, "colorFlg": 0},
				{"jcode": "11100", "rate": 0.2, "colorFlg": 1},
				{"jcode": "10525", "rate": 0.4, "colorFlg": 2},
				{"jcode": "43100", "rate": 0.6, "colorFlg": 3},
				{"jcode": "40100", "rate": 0.8, "colorFlg": 4},
				{"jcode": "33100", "rate": 1.0, "colorFlg": 5}
			]
		}
	`

	const rateData = JSON.parse(jsonStr)
	const getColorRange = (geoJson, colorRange) => {

		//　jsonStrのjcodeとpref.geojsonのJCODEが同じ値の場合matchesに値が入る
		const matches = rateData.data.find(d => d.jcode === geoJson.properties['JCODE'])
		console.log(matches); // 例{jcode: "33100", rate: 1, colorFlg: 5}
		console.log('↑matches終了');

		const idx = ((matches) => {
			if (matches) { //matchesに値がある場合
				return matches.colorFlg
			} else {       // undefinedの場合
				return 0
			}
		})(matches)
		console.log(idx);
		console.log('↑idx終了');
		console.log(colorRange[idx]);
		console.log('↑colorRange[idx]終了');
		return colorRange[idx]
	}

	const city = [
		new GeoJsonLayer({
			id: 'city-layer',
			data: cityData,
			pickable: true,
			stroked: true,
			filled: true,
			lineWidthScale: 20,
			lineWidthMinPixels: 0.5,
			//getFillColor: (d) => colorRange[d.properties['answer']],
			getFillColor: (d) => getColorRange(d, colorRange),
			getLineColor: [ 120, 120, 120 ],
			onClick: onClick
		})
	];

	const pref = [
		new GeoJsonLayer({
			id: 'pref-layer',
			data: prefData,
			pickable: false,
			stroked: true,
			filled: false,
			lineWidthScale: 20,
			lineWidthMinPixels: 1.5,
			getFillColor: [ 0, 0, 0 ],
			getLineColor: [ 20, 20, 20 ]
		})
	];

	return [ city, pref ];
}
