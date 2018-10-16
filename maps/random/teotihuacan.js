/*
 Teotihuacan (work in progress).
 05/10/18 (DD/MM/YY)
 This map is a mix of 3 maps.
*/

/*
  Map Idea:
   A Plain whit ruins in the center of the map like the Teotihuacan ruins
   In Wonder Victory the wonder is disamble in this map, you need capture the Pyramid of the sun for win in this type of game
*/

//Libs
Engine.LoadLibrary("rmgen");
Engine.LoadLibrary("rmgen-common");
Engine.LoadLibrary("rmbiome");


TILE_CENTERED_HEIGHT_MAP = true;


setSelectedBiome();

//Textures
const tMainTerrain = g_Terrains.mainTerrain;
const tForestFloor1 = g_Terrains.forestFloor1;
const tForestFloor2 = g_Terrains.forestFloor2;
const tCliff = g_Terrains.cliff;
const tTier1Terrain = g_Terrains.tier1Terrain;
const tTier2Terrain = g_Terrains.tier2Terrain;
const tTier3Terrain = g_Terrains.tier3Terrain;
const tHill = g_Terrains.hill;
const tRoad = g_Terrains.road;
const tRoadWild = g_Terrains.roadWild;
const tTier4Terrain = g_Terrains.tier4Terrain;
const tDirt = g_Terrains.shore;
const tWater = g_Terrains.water;

//Objects
const oTree1 = g_Gaia.tree1;
const oTree2 = g_Gaia.tree2;
const oTree3 = g_Gaia.tree3;
const oTree4 = g_Gaia.tree4;
const oTree5 = g_Gaia.tree5;
const oFruitBush = g_Gaia.fruitBush;
const oMainHuntableAnimal = g_Gaia.mainHuntableAnimal;
const oSecondaryHuntableAnimal = g_Gaia.secondaryHuntableAnimal;
const oStoneLarge = g_Gaia.stoneLarge;
const oStoneSmall = g_Gaia.stoneSmall;
const oMetalLarge = g_Gaia.metalLarge;


//Gaia Objecs


//Teotihuacan buildings
const BigPyramid = "gaia/teotihuacan_wonder"
const templeA = "structures/tolt_temple"
const templeCenter = "structures/mex_special_temple"


//Decorations
const aBush1 = "actor|props/flora/bush_medit_sm.xml";
const aGrass = g_Decoratives.grass;

//Forest
const pForest1 = [tForestFloor2 + TERRAIN_SEPARATOR + oTree1, tForestFloor2 + TERRAIN_SEPARATOR + oTree2, tForestFloor2];
const pForest2 = [tForestFloor1 + TERRAIN_SEPARATOR + oTree4, tForestFloor1 + TERRAIN_SEPARATOR + oTree5, tForestFloor1];

//Map Base
var g_Map = new RandomMap(0, tMainTerrain);

const numPlayers = getNumPlayers();
const mapCenter = g_Map.getCenter();
const mapBounds = g_Map.getBounds();

//Classes
var clPlayer = g_Map.createTileClass();
var clBaseResource = g_Map.createTileClass();
var clForest = g_Map.createTileClass();
var clWonder = g_Map.createTileClass();
var clMetal = g_Map.createTileClass();
var clStone = g_Map.createTileClass();
var clDirt = g_Map.createTileClass();

// Variables
var startAngle = randomAngle();

//Player Placement
placePlayerBases({
	"PlayerPlacement": playerPlacementRiver(startAngle , fractionToTiles(0.6)),
	"PlayerTileClass": clPlayer,
	"BaseResourceClass": clBaseResource,
	"CityPatch": {
		"outerTerrain": tMainTerrain,
		"innerTerrain":  tTier4Terrain
	},
	"Chicken": {
	},
	"Berries": {
		"template": oFruitBush
	},
	"Mines": {
		"types": [
			{ "template": oStoneLarge },
			{ "template": oStoneLarge }
		]
	},
	"Trees": {
		"template": oTree1,
		"count": 10
	},
	"Decoratives": {
		"template": aGrass
	}
});

g_Map.log("Creating animals");
createObjectGroupsDeprecated(
	new SimpleGroup(
		[
			new SimpleObject(oMainHuntableAnimal, 5, 6, 0, 4),
			new SimpleObject(oMainHuntableAnimal,15,4,5,0)
		],
		true, clDirt
	),
	0,
	avoidClasses(clWonder, 1, clPlayer, 20, clDirt, 11),
	scaleByMapSize(4, 12), 50
);



Engine.SetProgress(30);

//I dont know how the areas works
g_Map.log("Creating Wonder area");

createAreas(
    new ChainPlacer(1, Math.floor(scaleByMapSize(3, 5)),scaleByMapSize(1, 5), 0),
    [
        new TileClassPainter(clWonder)
    ],
    avoidClasses(clPlayer, 5, clBaseResource, 3, clForest, 5),
    num
);

createLayeredPatches(
    [scaleByMapSize(3, 6), scaleByMapSize(5, 10), scaleByMapSize(8, 21)],
    [[tTier1Terrain,tTier2Terrain],[tMainTerrain,tTier3Terrain], [tTier4Terrain,tDirt]],
    [1,1],
    avoidClasses(clWonder, 1,clDirt, 5, clPlayer, 1),
    scaleByMapSize(15, 45),
    clWonder
); 

Engine.SetProgress(35);

g_Map.log("Creating dirt patches");
createLayeredPatches(
 [scaleByMapSize(3, 6), scaleByMapSize(5, 10), scaleByMapSize(8, 21)],
 [[tTier1Terrain,tTier2Terrain],[tMainTerrain,tTier3Terrain], [tTier4Terrain,tDirt]],
 [1,1],
 avoidClasses(clWonder, 1,clDirt, 5, clPlayer, 1),
 scaleByMapSize(15, 45),
 clDirt);
Engine.SetProgress(40);

g_Map.log("Creating forests");


var [forestTrees, stragglerTrees] = getTreeCounts(...rBiomeTreeCount(1));
var types = [
	[[tForestFloor2, tMainTerrain, pForest1], [tForestFloor2, pForest1]],
	[[tForestFloor1, tMainTerrain, pForest2], [tForestFloor1, pForest2]]
];


var size = forestTrees / (scaleByMapSize(3,6) * numPlayers);
var num = Math.floor(size / types.length);
for (let type of types)
{
	createAreas(
		new ChainPlacer(1, Math.floor(scaleByMapSize(3, 5)), forestTrees / (num * Math.floor(scaleByMapSize(2, 5))), 0.5),
		[
			new LayeredPainter(type, [2]),
			new TileClassPainter(clForest)
		],
		avoidClasses(clPlayer, 5, clForest, 15, clWonder, 5),
        num);
};

Engine.SetProgress(60);

g_Map.log("Creating stone mines");

createMines(
    [
        [new SimpleObject(oStoneSmall, 0, 2, 0, 4, 0, 2 * Math.PI, 1), new SimpleObject(oStoneLarge, 1, 1, 0, 4, 0, 2 * Math.PI, 2)],
        [new SimpleObject(oStoneSmall, 2,5, 1,3)]
    ],
    avoidClasses(clWonder, 0, clForest, 1, clPlayer, 5, clMetal, 10, clBaseResource, 1),
    clStone
);

Engine.SetProgress(65);

g_Map.log("Creating metal mines");

createMines(
    [
        [new SimpleObject(oMetalLarge, 2,5, 1,3)]
    ],
    avoidClasses(clWonder, 0, clForest, 1, clPlayer, 5, clStone, 10, clBaseResource, 1),
    clStone
);

Engine.SetProgress(70);

//Encontrar una mejor forma de hacer esto
g_Map.log("Placing Pyramid of the sun");

g_Map.placeEntityPassable(BigPyramid,0,mapCenter,mapCenter);

Engine.SetProgress(80);

g_Map.log("Creating animals");
createObjectGroupsDeprecated(
	new SimpleGroup(
		[
			new SimpleObject(oMainHuntableAnimal, 5, 6, 0, 4),
			new SimpleObject(oMainHuntableAnimal,5,4,0,4)
		],
		true, clDirt
	),
	0,
	avoidClasses(clWonder, 1, clPlayer, 20, clDirt, 11),
	scaleByMapSize(4, 12), 50
);


placePlayersNomad(clPlayer, avoidClasses(clForest, 1, clMetal, 4, clStone, 4, clWonder, 4));

g_Map.ExportMap();