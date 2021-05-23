Engine.LoadLibrary("rmgen");
Engine.LoadLibrary("rmgen-common");

const tMainDirt = [
    "tropic_grass_c",
    "tropic_grass_c",
    "tropic_grass_c",
    "tropic_grass_c",
    "tropic_grass_plants",
    "tropic_plants",
    "tropic_plants_b"
];
const tForestFloor1 = "tropic_plants_c";
const tForestFloor2 = "tropic_plants_b";
const tGrassSands = "tropic_grass_plants";
const tGrass = "temp_mud_plants";
const tSecondaryDirt = "tropic_beach_dry_plants";
const tCliff = [
    "tropic_cliff_a",
    "tropic_cliff_a",
    "tropic_cliff_a",
    "tropic_cliff_a_plants"
];
const tHill = ["desert_dirt_rocks_1", "desert_dirt_rocks_2", "desert_dirt_rocks_3"];
const tDirt = ["tropic_citytile_a", "tropic_dirt_a"];
const tRoad = "tropic_beach_dry_plants";
const tRoadWild = "tropic_beach_dry";

const oTamarix = "gaia/tree/tropic_rainforest";
const oPalm = "gaia/tree/dead";
const oPine = "gaia/tree/pine_black";
const oBush = "gaia/flora_cactus";
const oCamel = "gaia/fauna_tapir";
const oGazelle = "gaia/fauna_deer_white_tailed";
const oLion = ["gaia/fauna_lion","gaia/fauna_jaguar","fauna_fox_gray"]
const oStoneLarge = "gaia/rock/desert_large";
const oStoneSmall = "gaia/rock/desert_small";
const oMetalLarge = "gaia/ore/desert_large";

const aRock = "actor|geology/stone_desert_med.xml";
const aBushA = "actor|props/flora/bush_desert_dry_a.xml";
const aBushB = "actor|props/flora/bush_desert_dry_a.xml";
const aBushes = [aBushA, aBushB];

const pForestP = [tForestFloor2 + TERRAIN_SEPARATOR + oPalm, tForestFloor2];
const pForestT = [tForestFloor1 + TERRAIN_SEPARATOR + oTamarix,tForestFloor2];

const heightLand = 1;
const heightHill = 22;
const heightOffsetBump = 2;

var g_Map = new RandomMap(heightLand, tMainDirt);

const mapCenter = g_Map.getCenter();
const numPlayers = getNumPlayers();

var clPlayer = g_Map.createTileClass();
var clHill = g_Map.createTileClass();
var clForest = g_Map.createTileClass();
var clRock = g_Map.createTileClass();
var clMetal = g_Map.createTileClass();
var clFood = g_Map.createTileClass();
var clBaseResource = g_Map.createTileClass();
var clGrass = g_Map.createTileClass();

var [playerIDs, playerPosition] = playerPlacementCircle(fractionToTiles(0.35));

g_Map.log("Creating big grass patches around the playerbases");
for (let i = 0; i < numPlayers; ++i)
{
	if (!isNomad())
		createArea(
			new ClumpPlacer(diskArea(defaultPlayerBaseRadius()), 0.9, 0.5, Infinity, playerPosition[i]),
			new TileClassPainter(clPlayer));

	createArea(
		new ChainPlacer(
			2,
			Math.floor(scaleByMapSize(5, 12)),
			Math.floor(scaleByMapSize(25, 60)) / (isNomad() ? 2 : 1),
			Infinity,
			playerPosition[i],
			0,
			[Math.floor(scaleByMapSize(16, 30))]),
		[
			new LayeredPainter([tGrassSands, tGrass], [3]),
			new TileClassPainter(clGrass)
		]);
}
Engine.SetProgress(10);

placePlayerBases({
	"PlayerPlacement": [playerIDs, playerPosition],
	// PlayerTileClass marked above
	"BaseResourceClass": clBaseResource,
	"CityPatch": {
		"outerTerrain": tRoadWild,
		"innerTerrain": tRoad,
		"radius": 10,
		"width": 3
	},
	"Chicken": {
        "template": "gaia/fauna_turkey"
	},
	"Berries": {
		"template": oBush
	},
	"Mines": {
		"types": [
			{ "template": oMetalLarge },
			{ "template": oStoneLarge }
		],
		"groupElements": [new RandomObject(aBushes, 2, 4, 2, 3)]
	},
	"Trees": {
		"template": pickRandom([oPalm, oTamarix]),
		"count": 3
	}
	// No decoratives
});
Engine.SetProgress(20);

g_Map.log("Creating bumps");
createAreas(
	new ClumpPlacer(scaleByMapSize(20, 50), 0.3, 0.06, Infinity),
	new SmoothElevationPainter(ELEVATION_MODIFY, heightOffsetBump, 2),
	avoidClasses(clPlayer, 13),
	scaleByMapSize(300, 800));

g_Map.log("Creating hills");
createAreas(
	new ChainPlacer(1, Math.floor(scaleByMapSize(4, 6)), Math.floor(scaleByMapSize(16, 40)), 0.5),
	[
		new LayeredPainter([tCliff, tHill], [2]),
		new SmoothElevationPainter(ELEVATION_SET, heightHill, 2),
		new TileClassPainter(clHill)
	],
	avoidClasses(clPlayer, 3, clGrass, 1, clHill, 10),
	scaleByMapSize(1, 3) * numPlayers * 3);

Engine.SetProgress(25);

g_Map.log("Creating forests");
var [forestTrees, stragglerTrees] = getTreeCounts(400, 2000, 0.7);
var types = [
	[[tMainDirt, tForestFloor2, pForestP], [tForestFloor2, pForestP]],
	[[tMainDirt, tForestFloor1, pForestT], [tForestFloor1, pForestT]]
];
var size = forestTrees / (scaleByMapSize(3,6) * numPlayers);
var num = Math.floor(size / types.length);
for (let type of types)
	createAreas(
		new ChainPlacer(
			1,
			Math.floor(scaleByMapSize(3, 5)),
			forestTrees / (num * Math.floor(scaleByMapSize(2, 4))),
			0.5),
		[
			new LayeredPainter(type, [2]),
			new TileClassPainter(clForest)
		],
		avoidClasses(clPlayer, 1, clGrass, 1, clForest, 10, clHill, 1),
		num);

Engine.SetProgress(40);

g_Map.log("Creating dirt patches");
for (let size of [scaleByMapSize(3, 6), scaleByMapSize(5, 10), scaleByMapSize(8, 21)])
	createAreas(
		new ChainPlacer(1, Math.floor(scaleByMapSize(3, 5)), size, 0.5),
		new LayeredPainter([tSecondaryDirt, tDirt], [1]),
		avoidClasses(clHill, 0, clForest, 0, clPlayer, 8, clGrass, 1),
		scaleByMapSize(50, 90));
Engine.SetProgress(60);

g_Map.log("Creating big patches");
for (let size of [scaleByMapSize(6, 30), scaleByMapSize(10, 50), scaleByMapSize(16, 70)])
	createAreas(
		new ChainPlacer(1, Math.floor(scaleByMapSize(3, 5)), size, 0.5),
		new LayeredPainter([tSecondaryDirt, tDirt], [1]),
		avoidClasses(clHill, 0, clForest, 0, clPlayer, 8, clGrass, 1),
		scaleByMapSize(30, 90));
Engine.SetProgress(70);

g_Map.log("Creating stone mines");
createObjectGroupsDeprecated(
	new SimpleGroup(
		[
			new SimpleObject(oStoneSmall, 0, 2, 0, 4, 0, 2 * Math.PI, 1),
			new SimpleObject(oStoneLarge, 1, 1, 0, 4, 0, 2 * Math.PI, 4),
			new RandomObject(aBushes, 2, 4, 0, 2)
		],
		true,
		clRock),
	0,
	[avoidClasses(clForest, 1, clPlayer, 10, clRock, 10, clHill, 1, clGrass, 1)],
	scaleByMapSize(2, 8),
	100);

g_Map.log("Creating small stone quarries");
var group = new SimpleGroup([new SimpleObject(oStoneSmall, 2,5, 1,3), new RandomObject(aBushes, 2,4, 0,2)], true, clRock);
createObjectGroupsDeprecated(group, 0,
	[avoidClasses(clForest, 1, clPlayer, 10, clRock, 10, clHill, 1, clGrass, 1)],
	scaleByMapSize(2,8), 100
);

g_Map.log("Creating metal mines");
group = new SimpleGroup([new SimpleObject(oMetalLarge, 1,1, 0,4), new RandomObject(aBushes, 2,4, 0,2)], true, clMetal);
createObjectGroupsDeprecated(group, 0,
	[avoidClasses(clForest, 1, clPlayer, 10, clMetal, 10, clRock, 5, clHill, 1, clGrass, 1)],
	scaleByMapSize(2,8), 100
);

g_Map.log("Creating small decorative rocks");
group = new SimpleGroup(
	[new SimpleObject(aRock, 1,3, 0,1)],
	true
);
createObjectGroupsDeprecated(
	group, 0,
	avoidClasses(clForest, 0, clPlayer, 0, clHill, 0),
	scaleByMapSize(16, 262), 50
);

g_Map.log("Creating bushes");
group = new SimpleGroup(
	[new SimpleObject(aBushB, 1,2, 0,1), new SimpleObject(aBushA, 1,3, 0,2)],
	true
);
createObjectGroupsDeprecated(
	group, 0,
	avoidClasses(clForest, 0, clPlayer, 0, clHill, 0),
	scaleByMapSize(50, 500), 50
);
Engine.SetProgress(80);

g_Map.log("Creating gazelle");
group = new SimpleGroup(
	[new SimpleObject(oGazelle, 5,7, 0,4)],
	true, clFood
);
createObjectGroupsDeprecated(group, 0,
	avoidClasses(clForest, 0, clPlayer, 1, clHill, 1, clFood, 20, clGrass, 2),
	3 * numPlayers, 50
);

g_Map.log("Creating lions");
group = new SimpleGroup(
	[new SimpleObject(oLion, 2,3, 0,2)],
	true, clFood
);
createObjectGroupsDeprecated(group, 0,
	avoidClasses(clForest, 0, clPlayer, 1, clHill, 1, clFood, 20, clGrass, 2),
	3 * numPlayers, 50
);

g_Map.log("Creating camels");
group = new SimpleGroup(
	[new SimpleObject(oCamel, 2,3, 0,2)],
	true, clFood
);
createObjectGroupsDeprecated(group, 0,
	avoidClasses(clForest, 0, clPlayer, 1, clHill, 1, clFood, 20, clGrass, 2),
	3 * numPlayers, 50
);
Engine.SetProgress(85);

createStragglerTrees(
	[oPalm, oTamarix, oPine],
	avoidClasses(clForest, 1, clHill, 1, clPlayer, 1, clMetal, 6, clRock, 6),
	clForest,
	stragglerTrees);

createStragglerTrees(
	[oPalm, oTamarix, oPine],
	[avoidClasses(clForest, 1, clHill, 1, clPlayer, 1, clMetal, 6, clRock, 6), stayClasses(clGrass, 3)],
	clForest,
	stragglerTrees * (isNomad() ? 3 : 1));

placePlayersNomad(clPlayer, avoidClasses(clForest, 1, clMetal, 4, clRock, 4, clHill, 4, clFood, 2));

setSkySet("sunny");
setSunElevation(Math.PI / 4);
setSunRotation(randomAngle());
setSunColor(0.255, 0.128, 0.255);
setWaterColor(0.255, 0.128, 0.255);
setWaterTint(0.255, 0.128, 0.255);
setWaterMurkiness(0.83);

setFogColor(0.255, 0.128, 0.255);
setFogThickness(0.2);
setFogFactor(0.4);

setPPEffect("hdr");
setPPContrast(0.45);
/*setPPSaturation(0);*/
setPPBloom(0.100);

g_Map.ExportMap();
