g_BackgroundLayerData.push(
	[
		{
			"offset": (time, width) => 0.04 * width * Math.cos(0.05 * time),
			"sprite": "background-mexica1-1",
			"tiling": true,
		},
		{
			"offset": (time, width) => 0.01 * width * Math.cos(0.05 * time),
			"sprite": "background-mexica1-2",
			"tiling": false,
		},
	]);
