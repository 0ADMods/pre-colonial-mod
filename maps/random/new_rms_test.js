Engine.LoadLibrary("rmgen");
Engine.LoadLibrary("rmgen-common");
Engine.LoadLibrary("rmbiome");



var g_Map = new RandomMap(0, "temperate_grass_mud_01");

var height = 2;

var numPlayers = getNumPlayers();
var mapCenter = g_Map.getCenter();

const tCliff = ["alpine_cliff_c", "alpine_cliff_c", "temperate_cliff_01"];

const tGrassPatch = ["alpine_grass_d"];
const tGrass = "medit_grass_field";
const tGrassSand50 = "medit_grass_field_a";
const tGrassSand25 = "medit_grass_field_b";
const tCity = ["new_alpine_citytile", "new_alpine_grass_dirt_a"];

const oBoar = "gaia/fauna_boar";
const oDeer = "gaia/fauna_deer";
const oBear = "gaia/fauna_bear_brown";
const oPig = "gaia/fauna_pig";
const oBerryBush = "gaia/fruit/berry_01";
const oMetalSmall = "gaia/ore/alpine_small";
const oMetalLarge = "gaia/ore/temperate_large";
const oStoneSmall = "gaia/rock/alpine_small";
const oStoneLarge = "gaia/rock/temperate_large";

const oOak = "gaia/tree/oak";
const oOakLarge = "gaia/tree/oak_large";
const oPine = "gaia/tree/pine";
const oAleppoPine = "gaia/tree/fir";

const oCivCentreSocket = "structures/civic_centre_socket_b";

const aTreeA = "actor|flora/trees/oak.xml";
const aTreeB = "actor|flora/trees/oak_large.xml";
const aTreeC = "actor|flora/trees/pine.xml";
const aTreeD = "actor|flora/trees/fir_tree.xml";

var clPlayer = g_Map.createTileClass();
var clHill = g_Map.createTileClass();
var clTower = g_Map.createTileClass();
var clSettlement = g_Map.createTileClass();
var clBaseResource = g_Map.createTileClass();
var clForest = g_Map.createTileClass();
var clMetal = g_Map.createTileClass();
var clRock  = g_Map.createTileClass();

var [playerIDs, playerPosition] = playerPlacementCircle(fractionToTiles(0.3));


new TerrainPainter(tGrassPatch);

placePlayerBases({
	"PlayerPlacement": [playerIDs, playerPosition],
	"BaseResourceClass": clBaseResource,
	// Playerclass marked below
	"CityPatch": {
		"outerTerrain": tCity,
		"innerTerrain": tCity,
		"radius": scaleByMapSize(5, 6),
		"smoothness": 0.05
	},
	"StartingAnimal": {
		"template": oPig
	},
	"Berries": {
		"template": oBerryBush,
		"minCount": 3,
		"maxCount": 3
	},
	"Mines": {
		"types": [
			{ "template": oMetalLarge },
			{ "template": oStoneLarge }
		],
		"distance": 16
	},
	"Trees": {
		"template": oOak,
		"count": 2
	}
	// No decoratives
});

placePlayersNomad(g_Map.createTileClass());

createArea(
	new ClumpPlacer(diskArea(fractionToTiles(0.22)), 0.94, 0.05, 0.1, mapCenter),
	[
		new LayeredPainter([tCliff, tGrass], [3]),
		new SmoothElevationPainter(ELEVATION_SET, height, 6)
	]);

createAreas(
	new ChainPlacer(1, 3, Math.floor(scaleByMapSize(10, 14)), 0.3),
	[
		new LayeredPainter([tGrassSand25, tGrass, tGrassSand50], [1, 1]),
		new SmoothElevationPainter(ELEVATION_SET, height, 3),
		new TileClassPainter(clSettlement)
	],
	avoidClasses(clPlayer, 0, clHill, 2, clSettlement, 12),
	Math.round(scaleByMapSize(6, 12)));

createAreas(
	new ChainPlacer(1, 3, Math.floor(scaleByMapSize(10, 14)), 0.3),
	[
		new LayeredPainter([tGrassSand25, tGrass, tGrassSand50], [1, 1]),
		new SmoothElevationPainter(ELEVATION_SET, height, 3),
		new TileClassPainter(clSettlement)
	],
	avoidClasses(clPlayer, 0, clHill, 2, clSettlement, 12),
	Math.round(scaleByMapSize(6, 12)));


	{
		var placeRoaming = function(name, objs)
		{
			g_Map.log("Creating roaming " + name);
			const group = new SimpleGroup(objs, true, clFood);
			createObjectGroups(group, 0,
				avoidClasses(clWater, 3, clPlayer, 20, clFood, 11, clHill, 4),
				scaleByMapSize(3, 9), 50
			);
		};
	
		placeRoaming("giraffes", [new SimpleObject(oGiraffe, 2, 4, 0, 4), new SimpleObject(oGiraffe2, 0, 2, 0, 4)]);
		placeRoaming("elephants", [new SimpleObject(oElephant, 2, 4, 0, 4), new SimpleObject(oElephant2, 0, 2, 0, 4)]);
		placeRoaming("lions", [new SimpleObject(oLion, 0, 1, 0, 4), new SimpleObject(oLioness, 2, 3, 0, 4)]);
	
		// Other roaming animals
		createFood(
			[
				[new SimpleObject(oHawk, 1, 1, 0, 3)],
				[new SimpleObject(oGazelle, 3, 5, 0, 3)],
				[new SimpleObject(oZebra, 3, 5, 0, 3)],
				[new SimpleObject(oWildebeest, 4, 6, 0, 3)],
				[new SimpleObject(oRhino, 1, 1, 0, 3)]
			],
			[
				3 * numPlayers,
				3 * numPlayers,
				3 * numPlayers,
				3 * numPlayers,
				3 * numPlayers,
			],
			avoidClasses(clFood, 20, clWater, 5, clHill, 2, clPlayer, 16),
			clFood);
	}

createObjectGroupsDeprecated(
	new SimpleGroup([new SimpleObject(oMetalLarge, 1, 1, 0, 4)], true, clMetal),
	0,
	avoidClasses(clPlayer, 20, clMetal, 10, clRock, 8, clSettlement, 4),
	scaleByMapSize(2, 12), 100
);

createStragglerTrees(
	oOak,
	avoidClasses(clForest, 5, clSettlement, 3, clPlayer, 12, clMetal, 6, clHill, 1),
	clForest,
	24
);



g_Map.ExportMap();
