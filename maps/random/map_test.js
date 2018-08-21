Engine.LoadLibrary("rmgen");
Engine.LoadLibrary("rmgen-common");

var g_Map = new RandomMap(0, "grass1");

var mapSize = g_Map.getSize();

var position = new Vector2D(distToMapBorder, distToMapBorder);
var playerID = 0;


g_Map.ExportMap();