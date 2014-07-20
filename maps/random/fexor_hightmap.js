RMS.LoadLibrary("rmgen");

const BUILDING_ANGlE = -PI/4;

// initialize map

log("Initializing map...");

InitMap();

var numPlayers = getNumPlayers();
var mapSize = getMapSize();

// create tile classes

// var clPlayer = createTileClass();
// var clPath = createTileClass();
// var clHill = createTileClass();
// var clForest = createTileClass();
// var clWater = createTileClass();
// var clRock = createTileClass();
// var clFood = createTileClass();
// var clBaseResource = createTileClass();

// // randomize player order
// var playerIDs = [];
// for (var i = 0; i < numPlayers; i++)
// {
	// playerIDs.push(i+1);
// }
// playerIDs = sortPlayers(playerIDs);

// // place players

// var playerX = new Array(numPlayers);
// var playerZ = new Array(numPlayers);
// var playerAngle = new Array(numPlayers);

// var startAngle = randFloat() * 2 * PI;
// for (var i=0; i < numPlayers; i++)
// {
	// playerAngle[i] = startAngle + i*2*PI/numPlayers;
	// playerX[i] = 0.5 + 0.39*cos(playerAngle[i]);
	// playerZ[i] = 0.5 + 0.39*sin(playerAngle[i]);
// }

// for (var i=0; i < numPlayers; i++)
// {
	// var id = playerIDs[i];
	// log("Creating base for player " + id + "...");
	
	// // get the x and z in tiles
	// var fx = fractionToTiles(playerX[i]);
	// var fz = fractionToTiles(playerZ[i]);
	// var ix = round(fx);
	// var iz = round(fz);

	// create starting units
	// placeCivDefaultEntities(fx, fz, id, BUILDING_ANGlE);
// }


//////////
// Test discrete vector analysis functionality
//////////
// var testScalarField = getScalarField(2, 5); // Get an "empty" scalar field (all values = 0)
// var testCoordinates = getAllCoordinatesInHypercube(2, 5); // Get all valid (integer) coordinates of the area the field is defined in
// for (var i = 0; i < testCoordinates.length; i++)
	// setFieldValueByCoordinate(testScalarField, testCoordinates[i], randInt(-9, 9)); // Ranomize the scalar fields values
// var gradField = getGrad(testScalarField); // Get the gradient field (a vector field) determining the slope in each coordinated direction (or the direction water would flow)
// var divGradField = getDiv(gradField); // Get the divergence of the gradient field (Would be something like how much water will leave this coordinate more then gathered from other coordinates)
// var normalizedTestScalarField = getNormalizedField(testScalarField); // Normalized version, needed for non-linear effects e.g. roughtly considering friction
// var normalizedGradField = getNormalizedField(gradField); // Normalized version, needed for non-linear effects e.g. roughtly considering friction
// var normalizedDivGradField = getNormalizedField(divGradField); // Normalized version, needed for non-linear effects e.g. roughtly considering friction
// log("uneval(testScalarField) = " + uneval(testScalarField));
// log("uneval(normalizedTestScalarField) = " + uneval(normalizedTestScalarField));
// log("uneval(gradField) = " + uneval(gradField));
// log("uneval(normalizedGradField) = " + uneval(normalizedGradField));
// log("uneval(divGradField) = " + uneval(divGradField));
// log("uneval(normalizedDivGradField) = " + uneval(normalizedDivGradField));


////////////////
//
//  Heightmap functionality
//
////////////////

// Some heightmap variables
const MIN_HEIGHT = - SEA_LEVEL; // 20
const MAX_HEIGHT = 0xFFFF/HEIGHT_UNITS_PER_METRE - SEA_LEVEL; // A bit smaler than 90

// Random heightmap generation
function getRandomReliefmap(minHeight, maxHeight)
{
	minHeight = (minHeight || MIN_HEIGHT);
	maxHeight = (maxHeight || MAX_HEIGHT);
	if (minHeight < MIN_HEIGHT)
		warn("getRandomReliefmap: Argument minHeight is smaler then the supported minimum height of " + MIN_HEIGHT + " (const MIN_HEIGHT): " + minHeight)
	if (maxHeight > MAX_HEIGHT)
		warn("getRandomReliefmap: Argument maxHeight is smaler then the supported maximum height of " + MAX_HEIGHT + " (const MAX_HEIGHT): " + maxHeight)
	var reliefmap = [];
	for (var x = 0; x <= mapSize; x++)
	{
		reliefmap.push([]);
		for (var y = 0; y <= mapSize; y++)
		{
			reliefmap[x].push(randFloat(minHeight, maxHeight));
		}
	}
	return reliefmap;
}

// Apply a heightmap
function setReliefmap(reliefmap)
{
	// g_Map.height = reliefmap;
	for (var x = 0; x <= mapSize; x++)
	{
		for (var y = 0; y <= mapSize; y++)
		{
			setHeight(x, y, reliefmap[x][y]);
		}
	}
}

// Get the diferrence between minimum and maxumum height
function getMinAndMaxHeight(reliefmap)
{
	var height = {};
	height.min = Infinity;
	height.max = -Infinity;
	for (var x = 0; x <= mapSize; x++)
	{
		for (var y = 0; y <= mapSize; y++)
		{
			if (reliefmap[x][y] < height.min)
				height.min = reliefmap[x][y];
			else if (reliefmap[x][y] > height.max)
				height.max = reliefmap[x][y];
		}
	}
	return height;
}

// Normalizing the heightmap
function getRescaledReliefmap(reliefmap, minHeight, maxHeight)
{
	var newReliefmap = deepcopy(reliefmap);
	minHeight = (minHeight || MIN_HEIGHT);
	maxHeight = (maxHeight || MAX_HEIGHT);
	if (minHeight < MIN_HEIGHT)
		warn("getRescaledReliefmap: Argument minHeight is smaler then the supported minimum height of " + MIN_HEIGHT + " (const MIN_HEIGHT): " + minHeight)
	if (maxHeight > MAX_HEIGHT)
		warn("getRescaledReliefmap: Argument maxHeight is smaler then the supported maximum height of " + MAX_HEIGHT + " (const MAX_HEIGHT): " + maxHeight)
	var oldHeightRange = getMinAndMaxHeight(reliefmap);
	for (var x = 0; x <= mapSize; x++)
	{
		for (var y = 0; y <= mapSize; y++)
		{
			newReliefmap[x][y] = minHeight + (reliefmap[x][y] - oldHeightRange.min) / (oldHeightRange.max - oldHeightRange.min) * (maxHeight - minHeight);
		}
	}
	return newReliefmap
}

function getInvertedHeightmap(heightmap)
{
	var newHeightmap = [];
	for (var x = 0; x < heightmap.length; x++)
	{
		newHeightmap.push([]);
		for (var y = 0; y < heightmap[x].length; y++)
			newHeightmap[x].push(-heightmap[x][y]);
	}
	
	return newHeightmap;
}

function drawFieldAbsOnTiles(field, isVectorField)
{
	if (isVectorField === undefined)
		isVectorField = (typeof(field[0][0]) == "object");
	var fieldMaxValue = getFieldsMaxAbsValue2d(field, isVectorField);
	for (var x = 0; x < mapSize; x++)
	{
		for (var y = 0; y < mapSize; y++)
		{
			if (isVectorField)
				var fieldActualValue = Math.pow(field[x][y].x * field[x][y].x + field[x][y].y * field[x][y].y, 1/2);
			else
				var fieldActualValue = abs(field[x][y]);
			if (fieldActualValue > 7/8 * fieldMaxValue)
				g_Map.setTexture(x, y, "red");
			else if (fieldActualValue > 6/8 * fieldMaxValue)
				g_Map.setTexture(x, y, "purple");
			else if (fieldActualValue > 5/8 * fieldMaxValue)
				g_Map.setTexture(x, y, "blue");
			else if (fieldActualValue > 4/8 * fieldMaxValue)
				g_Map.setTexture(x, y, "light blue");
			else if (fieldActualValue > 3/8 * fieldMaxValue)
				g_Map.setTexture(x, y, "green");
			else if (fieldActualValue > 2/8 * fieldMaxValue)
				g_Map.setTexture(x, y, "neon green");
			else if (fieldActualValue > 1/8 * fieldMaxValue)
				g_Map.setTexture(x, y, "yellow");
		}
	}
}


////////////////
//
//  Base terrain generation functionality
//
////////////////

function getBaseTerrainDiamondSquare(width, minHeight, maxHeight, smoothness, initialHeightmap)
{
	// Make some arguments optional
	width = (width || getMapSize() + 1); // Might fail by one
	minHeight = (minHeight || 0);
	maxHeight = (maxHeight || 1);
	var heightRange = maxHeight - minHeight;
	if (heightRange <= 0)
		warn("getBaseTerrainDiamondSquare: heightRange < 0");
	smoothness = (smoothness || 1);
	var offset = heightRange / 2;
	var heightmap = [[randFloat(minHeight / 2, maxHeight / 2), randFloat(minHeight / 2, maxHeight / 2)], [randFloat(minHeight / 2, maxHeight / 2), randFloat(minHeight / 2, maxHeight / 2)]];
	if (initialHeightmap)
		heightmap = initialHeightmap;
	
	// Double heightmap width untill target width is reached (diamond square method)
	while (heightmap.length < width)
	{
		var newHeightmap = [];
		var oldWidth = heightmap.length;
		// Square
		for (var x = 0; x < 2 * oldWidth - 1; x++)
		{
			newHeightmap.push([]);
			for (var y = 0; y < 2 * oldWidth - 1; y++)
			{
				if (x % 2 == 0 && y % 2 == 0) // Old tile
					newHeightmap[x].push(heightmap[x/2][y/2]);
				else if (x % 2 == 1 && y % 2 == 1) // New tile with diagonal old tile neighbors
				{
					newHeightmap[x].push((heightmap[(x-1)/2][(y-1)/2] + heightmap[(x+1)/2][(y-1)/2] + heightmap[(x-1)/2][(y+1)/2] + heightmap[(x+1)/2][(y+1)/2]) / 4);
					newHeightmap[x][y] += (newHeightmap[x][y] - minHeight) / heightRange * randFloat(-offset, offset)
				}
				else // New tile with straight old tile neighbors
					newHeightmap[x].push(undefined); // Define later
			}
		}
		// Diamond
		for (var x = 0; x < 2 * oldWidth - 1; x++)
		{
			for (var y = 0; y < 2 * oldWidth - 1; y++)
			{
				if (newHeightmap[x][y] === undefined)
				{
					if (x > 0 && x + 1 < newHeightmap.length - 1 && y > 0 && y + 1 < newHeightmap.length - 1) // Not a border tile
					{
						newHeightmap[x][y] = (newHeightmap[x+1][y] + newHeightmap[x][y+1] + newHeightmap[x-1][y] + newHeightmap[x][y-1]) / 4;
						newHeightmap[x][y] += (newHeightmap[x][y] - minHeight) / heightRange * randFloat(-offset, offset)
					}
					else if (x < newHeightmap.length - 1 && y > 0 && y < newHeightmap.length - 1) // Left border
					{
						newHeightmap[x][y] = (newHeightmap[x+1][y] + newHeightmap[x][y+1] + newHeightmap[x][y-1]) / 3;
						newHeightmap[x][y] += (newHeightmap[x][y] - minHeight) / heightRange * randFloat(-offset, offset)
					}
					else if (x > 0 && y > 0 && y < newHeightmap.length - 1) // Right border
					{
						newHeightmap[x][y] = (newHeightmap[x][y+1] + newHeightmap[x-1][y] + newHeightmap[x][y-1]) / 3;
						newHeightmap[x][y] += (newHeightmap[x][y] - minHeight) / heightRange * randFloat(-offset, offset)
					}
					else if (x > 0 && x < newHeightmap.length - 1 && y < newHeightmap.length - 1) // Bottom border
					{
						newHeightmap[x][y] = (newHeightmap[x+1][y] + newHeightmap[x][y+1] + newHeightmap[x-1][y]) / 3;
						newHeightmap[x][y] += (newHeightmap[x][y] - minHeight) / heightRange * randFloat(-offset, offset)
					}
					else if (x > 0 && x < newHeightmap.length - 1 && y > 0) // Top border
					{
						newHeightmap[x][y] = (newHeightmap[x+1][y] + newHeightmap[x-1][y] + newHeightmap[x][y-1]) / 3;
						newHeightmap[x][y] += (newHeightmap[x][y] - minHeight) / heightRange * randFloat(-offset, offset)
					}
				}
			}
		}
		heightmap = deepcopy(newHeightmap);
		offset /= Math.pow(2, smoothness);
	}
	
	// Cut heightmap to fit target width
	newHeightmap = [];
	for (var x = 0; x < width; x++)
	{
		newHeightmap.push([]);
		for (var y = 0; y < width; y++)
			newHeightmap[x].push(heightmap[x][y]);
	}
	
	return newHeightmap;
}


////////////////
//
//  Apply standalone erosion functions
//
////////////////

// Applying decay erosion (terrain independent)
function getHeightErrosionedReliefmap(reliefmap, strength)
{
	var newReliefmap = deepcopy(reliefmap);
	strength = (strength || 1.0); // Values much higher then 1 (1.32+ for an 8 tile map, 1.45+ for a 12 tile map, 1.62+ @ 20 tile map, 0.99 @ 4 tiles) will result in a resonance disaster/self interference
	// var map = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	var map = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]; // Default
	// var map = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [2, 0], [0, 2], [-2, 0], [0, -2]];
	// var map = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [2, 0], [2, 1], [1, 2], [0, 2], [-1, 2], [-2, 1], [-2, 0], [-2, -1], [-1, -2], [0, -2], [1, -2], [2, -1]];
	// var map = [[1, 0], [1, 1], [0, 1], [0, -1], [1, -1]]; // Directed, only effected from right
	for (var x = 0; x <= mapSize; x++)
	{
		for (var y = 0; y <= mapSize; y++)
		{
			var div = 0;
			for (var i = 0; i < map.length; i++)
				newReliefmap[x][y] += strength / map.length * (reliefmap[(x + map[i][0] + mapSize + 1) % (mapSize + 1)][(y + map[i][1] + mapSize + 1) % (mapSize + 1)] - reliefmap[x][y]); // Not entirely sure if scaling with map.length is perfect but tested values seam to indicate it is
		}
	}
	return newReliefmap;
}

// Applying additive directed erosion (terrain independent, carries material left) NOTE: The average height will grow so it has to be rescaled after applying this!
// Results in round high ground structures
function getAdditiveWindErrosionedReliefmap(reliefmap, strength)
{
	var newReliefmap = deepcopy(reliefmap);
	strength = (strength || 1.0); // Values much higher then 1 will result in a resonance disaster/self interference
	// var map = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	// var map = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]; // Default
	// var map = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [2, 0], [0, 2], [-2, 0], [0, -2]];
	// var map = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [2, 0], [2, 1], [1, 2], [0, 2], [-1, 2], [-2, 1], [-2, 0], [-2, -1], [-1, -2], [0, -2], [1, -2], [2, -1]];
	var map = [[1, 0], [1, 1], [0, 1], [0, -1], [1, -1]]; // Directed, only effected from right
	// var map = [[0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]]; // Directed, only effected from left
	for (var x = 0; x <= mapSize; x++)
	{
		for (var y = 0; y <= mapSize; y++)
		{
			for (var i = 0; i < map.length; i++)
			{
				var add = strength / map.length * (reliefmap[(x + map[i][0] + mapSize + 1) % (mapSize + 1)][(y + map[i][1] + mapSize + 1) % (mapSize + 1)] - reliefmap[x][y]);
				if (add > 0)
					newReliefmap[x][y] += add;
			}
		}
	}
	return newReliefmap;
}

// Applying substractive directed erosion (terrain independent, carries material left) NOTE: The average height will shrink so it has to be rescaled after applying this!
// Results in round low ground structures
function getSubstractiveWindErrosionedReliefmap(reliefmap, strength)
{
	var newReliefmap = deepcopy(reliefmap);
	strength = (strength || 1.0); // Values much higher then 1 will result in a resonance disaster/self interference
	// var map = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	// var map = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]; // Default
	// var map = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [2, 0], [0, 2], [-2, 0], [0, -2]];
	// var map = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [2, 0], [2, 1], [1, 2], [0, 2], [-1, 2], [-2, 1], [-2, 0], [-2, -1], [-1, -2], [0, -2], [1, -2], [2, -1]];
	// var map = [[1, 0], [1, 1], [0, 1], [0, -1], [1, -1]]; // Directed, only effected from right
	var map = [[0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]]; // Directed, only effected from left
	for (var x = 0; x <= mapSize; x++)
	{
		for (var y = 0; y <= mapSize; y++)
		{
			for (var i = 0; i < map.length; i++)
			{
				var add = strength / map.length * (reliefmap[(x + map[i][0] + mapSize + 1) % (mapSize + 1)][(y + map[i][1] + mapSize + 1) % (mapSize + 1)] - reliefmap[x][y]);
				if (add < 0)
					newReliefmap[x][y] += add;
			}
		}
	}
	return newReliefmap;
}


//////////
// Heightmap functionality based on discrete vector analysis
//////////

function getErosionHeightmapDVA(heightmap, strength)
{
	strength = (strength || 1);
	var size = heightmap.length;
	var newHeightmap = deepcopy(heightmap);
	var divGradMap = getGrad(newHeightmap);
	divGradMap = getDiv(divGradMap);
	for (var x = 0; x < size; x++)
	{
		for (var y = 0; y < size; y++)
		{
			newHeightmap[x][y] -= strength / 4/* 2 * dimension*/  * divGradMap[x][y];
		}
	}
	return newHeightmap;
}
// Test
// var dimension = 2;
// var size = 3
// var testScalarField = getScalarField(dimension, size); // Get an "empty" scalar field (all values = 0)
// var testCoordinates = getAllCoordinatesInHypercube(dimension, size); // Get all valid (integer) coordinates of the area the field is defined in
// for (var i = 0; i < testCoordinates.length; i++)
	// setFieldValueByCoordinate(testScalarField, testCoordinates[i], randInt(-9, 9)); // Ranomize the scalar fields values
// var gradField = getGrad(testScalarField); // Get the gradient field (a vector field) determining the slope in each coordinated direction (or the direction water would flow)
// var divGradField = getDiv(gradField); // Get the divergence of the gradient field (Would be something like how much water will leave this coordinate more then gathered from other coordinates)
// var normalizedTestScalarField = getNormalizedField(testScalarField); // Normalized version, needed for non-linear effects e.g. roughtly considering friction
// var normalizedGradField = getNormalizedField(gradField); // Normalized version, needed for non-linear effects e.g. roughtly considering friction
// var normalizedDivGradField = getNormalizedField(divGradField); // Normalized version, needed for non-linear effects e.g. roughtly considering friction
// log("uneval(testScalarField) = " + uneval(testScalarField));
// log("uneval(normalizedTestScalarField) = " + uneval(normalizedTestScalarField));
// log("uneval(gradField) = " + uneval(gradField));
// // log("uneval(normalizedGradField) = " + uneval(normalizedGradField));
// log("uneval(divGradField) = " + uneval(divGradField));
// // log("uneval(normalizedDivGradField) = " + uneval(normalizedDivGradField));
// var erosionedTestScalarField = getErosionHeightmapDVA(testScalarField);
// log("uneval(erosionedTestScalarField) = " + uneval(erosionedTestScalarField));
// var normalizedErosionedField = getNormalizedField(erosionedTestScalarField);
// log("uneval(normalizedErosionedField) = " + uneval(normalizedErosionedField));

function getFloatingWaterErosionHeightmapDVA(heightmap, strength)
{
	strength = (strength || 1);
	var size = heightmap.length;
	var newHeightmap = deepcopy(heightmap);
	var divGradMap = getGrad(newHeightmap);
	divGradMap = getDiv(divGradMap);
	var maxValue = getFieldsMaxAbsValue(divGradMap, false);
	divGradMap = getNormalizedField(divGradMap, 1, false);
	for (var x = 0; x < size; x++)
	{
		for (var y = 0; y < size; y++)
			newHeightmap[x][y] -= strength / 4/* 2 * dimension */  * maxValue * Math.pow(divGradMap[x][y], 2);
	}
	return newHeightmap;
}

/*
...2D
*/

/*
getDecayErosionedHeightmapDVA2d

Arguments:
	heightmap:	An array of x arrays of y floats. A discrete scalar field with "width" x and "height" y (usually a hightmap).
	strength:	A float value between 0 and 1. Higher values than 1 may cause self interference when applied multiple times.
*/
function getDecayErosionedHeightmapDVA2d(heightmap, strength, wrap)
{
	strength = (strength || 0.8); // For some reason 1 is to high causing resonance.
	if (wrap === undefined)
		wrap = false;
	var newHeightmap = deepcopy(heightmap);
	var divGrad = getDiv2d(getGrad2d(heightmap, wrap), wrap);
	for (var x = 0; x < heightmap.length; x++)
	{
		for (var y = 0; y < heightmap[x].length; y++)
			newHeightmap[x][y] = heightmap[x][y] - strength * divGrad[x][y];
	}
	return newHeightmap;
}

function getWindErosionedHeightmapDVA2d(heightmap, windVektor, strength, wrap)
{
	windVektor = (windVektor || {"x": 0, "y": 0});
	strength = (strength || 1);
	if (wrap === undefined)
		wrap = true;
	var newHMap = deepcopy(heightmap);
	var gradHMap = getGrad2d(heightmap, wrap);
	for (var x = 0; x < gradHMap.length; x++)
	{
		for (var y = 0; y < gradHMap[x].length; y++)
		{
			gradHMap[x][y].x += 1000 * windVektor.x;
			gradHMap[x][y].y += 1000 * windVektor.y;
		}
	}
	var divGradHMap = getDiv2d(gradHMap, wrap);
	for (var x = 0; x < heightmap.length; x++)
	{
		for (var y = 0; y < heightmap[x].length; y++)
			newHMap[x][y] = heightmap[x][y] + strength * divGradHMap[x][y] / 5; // Divisor has to be higher than 4.1 otherwise self interference/resonance desaster, not sure why this value
	}
	return newHMap;
}


////////////////
//
//  The many tries to get riverbeds...
//
////////////////

// Not working as planned...
function getFloatingWaterErosionedHeightmapDVA2d(heightmap, strength)
{
	strength = (strength || 1);
	var newHeightmap = deepcopy(heightmap);
	var floatField = getGrad2d(heightmap);
	var maxValue = 0;
	for (var x = 0; x < floatField.length; x++)
	{
		for (var y = 0; y < floatField[x].length; y++)
		{
			var length = Math.pow(floatField[x][y].x * floatField[x][y].x + floatField[x][y].y * floatField[x][y].y, 1/2);
			if (length > maxValue)
				maxValue = length;
		}
	}
	var nonLinearGrad = deepcopy(floatField);
	for (var x = 0; x < floatField.length; x++)
	{
		for (var y = 0; y < floatField[x].length; y++)
		{
			// nonLinearGrad[x][y].x = floatField[x][y].x * abs(floatField[x][y].x) / maxValue;
			// nonLinearGrad[x][y].y = floatField[x][y].y * abs(floatField[x][y].y) / maxValue;
			nonLinearGrad[x][y].x = Math.pow(abs(floatField[x][y].x), 1/2) * floatField[x][y].x / abs(floatField[x][y].x) / maxValue;
			nonLinearGrad[x][y].y = Math.pow(abs(floatField[x][y].y), 1/2) * floatField[x][y].y / abs(floatField[x][y].y) / maxValue;
		}
	}
	var deltaHeightmap = getDiv2d(nonLinearGrad);
	for (var x = 0; x < heightmap.length; x++)
	{
		for (var y = 0; y < heightmap[x].length; y++)
			newHeightmap[x][y] = heightmap[x][y] + strength * deltaHeightmap[x][y] / 100; // CHECK DIVISOR!!!
	}
	return newHeightmap;
}

/*
Visualize water drain to get the water erosion right
*/
function paintTilesWithWaterDrain(heightmap, addedWater, accuracy, wrap)
{
	addedWater = (addedWater || 1);
	wrap = (wrap || false);
	accuracy = (accuracy || 1/2);
	var waterHightMap = getRandomReliefmap(addedWater, addedWater);
	
	// Calculate water drain loop
	var minWaterHight = addedWater; // Break condition
	var waterDrainTotalField = getGrad2d(getRandomReliefmap(0, 0), wrap);
	var loop = 0;
	log("Entering while loop...");
	while (minWaterHight > accuracy)
	{
		loop++;
		if (loop % 100 == 0)
			log("minWaterHight = " + minWaterHight + " after " + loop + " loops...");
		
		// Calculate waterSurfaceMap
		var waterSurfaceMap = heightmap;
		for (var x = 0; x < waterSurfaceMap.length; x++)
		{
			for (var y = 0; y < waterSurfaceMap[x].length; y++)
			{
				waterSurfaceMap[x][y] += waterHightMap[x][y];
			}
		}
		
		// Calculate theoretical water drain
		var waterDrainField = getGrad2d(waterSurfaceMap, wrap);
		
		// Add waterDrainField to waterDrainTotalField
		for (var x = 0; x < waterDrainTotalField.length; x++)
		{
			for (var y = 0; y < waterDrainTotalField[x].length; y++)
			{
				waterDrainTotalField[x][y].x += waterDrainField[x][y].x;
				waterDrainTotalField[x][y].y += waterDrainField[x][y].y;
			}
		}
		
		// Calculate and rescale Scale waterDrainMap to fit accuracy
		var waterDrainMap = getDiv2d(waterDrainField, wrap);
		waterDrainMap = getRescaledField2D(waterDrainMap, accuracy);
		
		// Recalculate waterHightMap for break condition and next loop
		for (var x = 0; x < waterHightMap.length; x++)
		{
			for (var y = 0; y < waterHightMap[x].length; y++)
			{
				waterHightMap[x][y] -= 0.8 * min(waterDrainMap[x][y], waterHightMap[x][y]);
				if (waterHightMap[x][y] < 0)
					warn("Negative water hight!");
			}
		}
		
		// Recalculate minWaterHight for break condition
		minWaterHight = addedWater;
		for (var x = 0; x < waterHightMap.length; x++)
		{
			for (var y = 0; y < waterHightMap[x].length; y++)
			{
				if (waterHightMap[x][y] < minWaterHight)
					minWaterHight = waterHightMap[x][y];
			}
		}
		
	}
	log("Number of loops needed: " + loop);
	
	// Paint tiles
	drawFieldAbsOnTiles(waterDrainTotalField);
}

/*
Try rain driven erosion another time...
Has to be changed to be more tidy with added DVA(2D) functions (e.g. getRandomScalarField2D, getRandomVectorField2D, getSumOfFields2D, ...)
(ATM functions from this map are mixed with DVA(2D) functions - which is bad!)
Is it really needed to scale things to water plane (slow!) or could the water just be "small" compared to the hight and only take into account the hight?
NOTE: This got some resonance! Check all used functions und extend library - then continue...
*/
function getRainErosionedHeightmapDVA2D(heightmap, rainfall, cycles, strength, wraped)
{
	rainfall = (rainfall || 1); // Should correspond to water level/average water coverage! How?
	cycles = (cycles || 10);
	strength = (strength || 1);
	wraped = (wraped || false);
	var waterMap = getRandomReliefmap(rainfall, rainfall); // Randomize? Changed each cycle!
	var waterDrainFieldTotal = getGrad2d(waterMap, wraped); // Wrapped OK? If changed erosionFloatField needs to be changed as well!
	// Water drain simulation cycles
	var waterMapMin = rainfall;
	var waterMapMinLast = rainfall;
	var loop = 0
	while (waterMapMin > 1 / cycles)
	// for (var i = 0; i < cycles; i++)
	{
		loop++;
		if (loop % 1000 == 0)
			log("loop = " + loop);
		// Calculate water surface height
		var waterSurfaceMap = heightmap;
		for (var x = 0; x < waterSurfaceMap.length; x++)
		{
			for (var y = 0; y < waterSurfaceMap[x].length; y++)
			{
				waterSurfaceMap[x][y] += waterMap[x][y];
			}
		}
		// Calculate water drain and rescale it to avoid resonance
		var waterDrainField = getGrad2d(waterSurfaceMap, wraped); // Wrapped OK? If changed erosionFloatField needs to be changed as well!
		var maxSteppness = getFieldsMaxAbsValue2d(waterDrainField); // To avoid resonance, sane? OK to ignore water hight changes (so calculate only once befor loop)?
		waterDrainField = getRescaledField2D(waterDrainField, rainfall / cycles); // Better to rescale the waterHightChangeMap!!!
		// Add water drain to waterDrainFieldTotal
		for (var x = 0; x < waterDrainField.length; x++)
		{
			for (var y = 0; y < waterDrainField[x].length; y++)
			{
				waterDrainFieldTotal[x][y].x += waterDrainField[x][y].x;
				waterDrainFieldTotal[x][y].y += waterDrainField[x][y].y;
			}
		}
		// Apply calculated water drain to the water map for next loop and set break condition
		var waterHightChangeMap = getDiv2d(waterDrainField, wraped);
		waterMapMinLast = deepcopy(waterMapMin);
		waterMapMin = rainfall;
		for (var x = 0; x < waterMap.length; x++)
		{
			for (var y = 0; y < waterMap[x].length; y++)
			{
				waterMap[x][y] += waterHightChangeMap[x][y];
				if (waterMap[x][y] < waterMapMin)
					waterMapMin = waterMap[x][y];
				// DEBUG Start
				if (waterMap[x][y] < 0)
					warn("waterMap include negative values!");
				// DEBUG End
			}
		}
		if (loop % 1000 == 0)
			log("waterMapMin = " + waterMapMin);
		if (waterMapMin > waterMapMinLast)
			warn("waterMapMin raised from " + waterMapMinLast + " to " + waterMapMin);
	}
	// DEBUG Start: Check waterMap
	var waterMapMin = 1000000;
	var waterMapMax = -1000000;
	for (var x = 0; x < waterMap.length; x++)
	{
		for (var y = 0; y < waterMap[x].length; y++)
		{
			if (waterMap[x][y] < waterMapMin)
				waterMapMin = waterMap[x][y];
			if (waterMap[x][y] > waterMapMax)
				waterMapMax = waterMap[x][y];
		}
	}
	log("waterMapMin = " + waterMapMin);
	log("waterMapMax = " + waterMapMax);
	// DEBUG End: Check waterMap
	// Apply errosion to hightmap
	var newHeightmap = deepcopy(heightmap);
	var hightChangeMap = getDiv2d(waterDrainFieldTotal, wraped);
	// var originalSteppness = getFieldsMaxAbsValue2d(heightmap);
	// var maxHightChange = getFieldsMaxAbsValue2d(hightChangeMap);
	// hightChangeMap = getRescaledField2D(hightChangeMap, strength); // Not very sane! Rethink if dependent on water hight/coverage!
	for (var x = 0; x < newHeightmap.length; x++)
	{
		for (var y = 0; y < newHeightmap[x].length; y++)
		{
			newHeightmap[x][y] -= hightChangeMap[x][y]; // WHY - ???
		}
	}
	
	return newHeightmap;
}

function getWaterMaps(heightmap, strength, rain, waterFade, watermap, getWaterSpeedMap, getWaterDrainMap)
{
	strength = (strength || 0.5);
	if (rain === undefined)
		rain = 0.1;
	if (waterFade === undefined)
		waterFade = 0.1;
	if (!watermap)
	{
		watermap = [];
		for (var x = 0; x < heightmap.length; x++)
		{
			watermap.push([]);
			for (var y = 0; y < heightmap[x].length; y++)
			{
				watermap[x].push(1);
			}
		}
	}
	
	for (var x = 0; x < watermap.length; x++)
		for (var y = 0; y < watermap[x].length; y++)
			watermap[x][y] = (1 - waterFade) * (watermap[x][y] + rain);
	
	var waterDrainMap = [];
	var waterSpeedMap = [];
	for (var x = 0; x < watermap.length; x++)
	{
		waterDrainMap.push([]);
		waterSpeedMap.push([]);
		for (var y = 0; y < watermap[x].length; y++)
		{
			waterSpeedMap[x].push({"x" : 0, "y" : 0});
			var actualHeight = heightmap[x][y] + watermap[x][y];
			
			var heightDifferenceX = 0;
			if (x + 1 < watermap.length)
				heightDifferenceX = actualHeight - heightmap[x+1][y] - watermap[x+1][y];
			var heightDifferenceY = 0;
			if (y + 1 < watermap[x].length)
				heightDifferenceY = actualHeight - heightmap[x][y+1] - watermap[x][y+1];
			
			var waterFlowX = 0;
			if (heightDifferenceX > 0)
			{
				waterFlowX += strength * min(watermap[x][y] / 4, heightDifferenceX / 4);
				waterSpeedMap[x][y].x = 1 / watermap[x][y];
			}
			else if (heightDifferenceX < 0)
			{
				waterFlowX -= strength * min(watermap[x+1][y] / 4, -heightDifferenceX / 4);
				waterSpeedMap[x][y].x = 1 / watermap[x+1][y];
			}
			var waterFlowY = 0;
			if (heightDifferenceY > 0)
			{
				waterFlowY += strength * min(watermap[x][y] / 4, heightDifferenceY / 4);
				waterSpeedMap[x][y].y = 1 / watermap[x][y];
			}
			else if (heightDifferenceY < 0)
			{
				waterFlowY -= strength * min(watermap[x][y+1] / 4, -heightDifferenceY / 4);
				waterSpeedMap[x][y].y = 1 / watermap[x][y+1];
			}
			
			waterDrainMap[x].push({"x" : waterFlowX, "y" : waterFlowY});
			waterSpeedMap[x][y].x *= waterFlowX;
			waterSpeedMap[x][y].y *= waterFlowY;
		}
	}
	
	for (var x = 0; x < watermap.length; x++)
	{
		for (var y = 0; y < watermap[x].length; y++)
		{
			if (waterDrainMap[x][y].x)
			{
				watermap[x][y] -= waterDrainMap[x][y].x;
				watermap[x+1][y] += waterDrainMap[x][y].x;
			}
			if (waterDrainMap[x][y].y)
			{
				watermap[x][y] -= waterDrainMap[x][y].y;
				watermap[x][y+1] += waterDrainMap[x][y].y;
			}
		}
	}
	
	if (getWaterSpeedMap && getWaterDrainMap)
		return {"height" : watermap, "speed" : waterSpeedMap, "drain" : waterDrainMap};
	if (getWaterSpeedMap && !getWaterDrainMap)
		return {"height" : watermap, "speed" : waterSpeedMap};
	if (!getWaterSpeedMap && getWaterDrainMap)
		return {"height" : watermap, "drain" : waterDrainMap};
	return watermap;
}

function applyWaterErosionTEST(heightmap, watermap, returnWatermap)
{
	// Scalar and vector fields that might be usefull
	var heightSF = deepcopy(heightmap);
	
	var slopeVF = getGrad2d(heightSF);
	var decaySF = getDiv2d(slopeVF);
	
	var waterHeightSF = watermap;
	var waterSpeedVF = undefined;
	var waterDrainVF = undefined;
	var waterMaps = getWaterMaps(heightmap, 0.5, 0.1, 0.1, waterHeightSF, true, true);
	waterHeightSF = waterMaps.height;
	waterSpeedVF = waterMaps.speed;
	waterDrainVF = waterMaps.drain;
	
	// More experimental fields
	var expWaterSpeedSquareSF = getProductOfFields2D(waterSpeedVF, waterSpeedVF); // Looses direction
	var expDivWaterSpeedSF2 = getDiv2d(waterSpeedVF);
	var expDivWaterDrainSF = getDiv2d(waterDrainVF);
	var expWaterDrainSF = getWaterDrainMap(heightSF, 0, waterHeightSF);
	
	var expWaterSpeedVF = [];
	for (var x = 0; x < heightSF.length; x++)
	{
		expWaterSpeedVF.push([]);
		for (var y = 0; y < heightSF[x].length; y++)
		{
			expWaterSpeedVF[x].push({"x" : Math.pow(abs(slopeVF[x][y].x), 1/2), "y" : Math.pow(abs(slopeVF[x][y].y), 1/2)});
			if (slopeVF[x][y].x > 0)
				expWaterSpeedVF[x][y].x *= -1;
			if (slopeVF[x][y].y > 0)
				expWaterSpeedVF[x][y].y *= -1;
		}
	}
	var expDivWaterSpeedSF = getDiv2d(expWaterSpeedVF);
	
	var maxSlope = getFieldsMaxAbsValue2d(slopeVF);
	var maxWaterSpeed = getFieldsMaxAbsValue2d(waterSpeedVF);
	var expEnergeticErosionVF = [];
	for (var x = 0; x < heightSF.length; x++)
	{
		expEnergeticErosionVF.push([]);
		for (var y = 0; y < heightSF[x].length; y++)
		{
			expEnergeticErosionVF[x].push({"x" : waterSpeedVF[x][y].x * waterSpeedVF[x][y].x * slopeVF[x][y].x / maxWaterSpeed, "y" : waterSpeedVF[x][y].y * waterSpeedVF[x][y].y * slopeVF[x][y].y / maxWaterSpeed});
		}
	}
	var expEnergeticErosionSF = getDiv2d(expEnergeticErosionVF);
	
	// Apply hieghtmap manipulation
	for (var x = 0; x < heightSF.length; x++)
	{
		for (var y = 0; y < heightSF[x].length; y++)
		{
			heightSF[x][y] -= 16 * expEnergeticErosionSF[x][y]; // To check further
			// heightSF[x][y] -= expDivWaterDrainSF[x][y] / 5000;
			// heightSF[x][y] -= 4 * decaySF[x][y] * Math.pow(waterSpeedVF[x][y].x * waterSpeedVF[x][y].x + waterSpeedVF[x][y].y * waterSpeedVF[x][y].y, 1/2);
			// heightSF[x][y] += expDivWaterSpeedSF[x][y];
			// heightSF[x][y] += 10 * expDivWaterSpeedSF2[x][y];
			// heightSF[x][y] -= 32 * decaySF[x][y] * expWaterSpeedSquareSF[x][y];
		}
	}
	
	// Return
	if (returnWatermap)
		return {"height" : heightSF, "water" : waterHeightSF};
	return heightSF;
}

function getWaterDrainMap(heightmap, seepage, waterMap)
{
	// Setting optional parameters
	seepage = (seepage || 0)
	if (!waterMap)
	{
		waterMap = deepcopy(heightmap);
		for (var x = 0; x < heightmap.length; x++)
			for (var y = 0; y < heightmap[x].length; y++)
					waterMap[x][y] = 1;
	}
	
	// Reorganize tiles in list and sort by height
	var tilesByHeight = [];
	for (var x = 0; x < heightmap.length; x++)
		for (var y = 0; y < heightmap[x].length; y++)
			tilesByHeight.push({"height" : heightmap[x][y], "x" : x, "y" : y});
	
	function sortByHeight(heightCoordinatePair1, heightCoordinatePair2)
	{
		return heightCoordinatePair2.height - heightCoordinatePair1.height;
	}
	
	tilesByHeight.sort(sortByHeight);
	
	// Generate waterDrainMap
	var waterDrainMap = deepcopy(heightmap); // This is just the amount of water draining through this field and includes no information about the direction it flows!
	for (var x = 0; x < heightmap.length; x++)
		for (var y = 0; y < heightmap[x].length; y++)
			waterDrainMap[x][y] = 0;
	
	// Simulate water drain (ignoring water height)
	// var fields = [{"x" : 1, "y" : 0}, {"x" : 0, "y" : 1}, {"x" : -1, "y" : 0}, {"x" : 0, "y" : -1}]; // 4 way map
	var fields = [{"x" : 1, "y" : 0}, {"x" : 1, "y" : 1}, {"x" : 0, "y" : 1}, {"x" : -1, "y" : 1}, {"x" : -1, "y" : 0}, {"x" : -1, "y" : -1}, {"x" : 0, "y" : -1}, {"x" : 1, "y" : -1}]; // 8 way map
	for (var tile = 0; tile < tilesByHeight.length; tile++)
	{
		var actualX = tilesByHeight[tile].x;
		var actualY = tilesByHeight[tile].y;
		var actualWater = (1 - seepage) * waterMap[actualX][actualY];
		
		// Get total height difference to lower fields
		var sumHeightDiff = 0;
		for (var i = 0; i < fields.length; i++)
		{
			var compareX = actualX + fields[i].x;
			var compareY = actualY + fields[i].y;
			if (compareX >= 0 && compareX < heightmap.length && compareY >= 0 && compareY < heightmap[0].length)
			{
				var actualHeight = heightmap[actualX][actualY];
				var compareHeight = heightmap[compareX][compareY];
				if (compareHeight < actualHeight)
					sumHeightDiff += actualHeight - compareHeight;
			}
		}
		
		// Distribute water (drain) according to hight difference (assuming linearity)
		if (sumHeightDiff)
		{
			for (var i = 0; i < fields.length; i++)
			{
				var compareX = actualX + fields[i].x;
				var compareY = actualY + fields[i].y;
				if (compareX >= 0 && compareX < heightmap.length && compareY >= 0 && compareY < heightmap[0].length)
				{
					var actualHeight = heightmap[actualX][actualY];
					var compareHeight = heightmap[compareX][compareY];
					if (compareHeight < actualHeight)
					{
						// if (i % 2 == 1)
							// var waterDrain = actualWater / Math.pow(2, 1/2) * (actualHeight - compareHeight) / sumHeightDiff;
						// else
							var waterDrain = actualWater * (actualHeight - compareHeight) / sumHeightDiff;
						// waterMap[actualX][actualY] -= waterDrain; // Unneeded
						waterMap[compareX][compareY] += waterDrain;
						waterDrainMap[compareX][compareY] += waterDrain;
						waterDrainMap[actualX][actualY] += waterDrain; // Is this wanted?
					}
				}
			}
		}
	}
	
	return waterDrainMap;
}

function getWaterErodedHeightmapStandalone(heightmap, strength, rain, seepage, diagonalFlow, waterMap, returnWaterMap)
{
	// Setting optional parameters
	strength = (strength || 1);
	seepage = (seepage || 0); // Not sure where to apply it! Water flow calculation or water transportation?
	if (diagonalFlow === undefined)
		diagonalFlow = false; // If true interferance appear for some reason I don't know
	var diagonalScale = 1; //1 / Math.pow(2, 1/2); // Not entirely sure about this. Should be 2**(1/2) / 2 = 1 / (2**(1/2))
	if (!waterMap)
	{
		waterMap = [];
		for (var x = 0; x < heightmap.length; x++)
		{
			waterMap.push([]);
			for (var y = 0; y < heightmap[x].length; y++)
					waterMap[x].push(1);
		}
	}
	else
	{
		for (var x = 0; x < heightmap.length; x++)
		{
			for (var y = 0; y < heightmap[x].length; y++)
					waterMap[x][y] += rain;;
		}
	}
	
	if (returnWaterMap === undefined)
		returnWaterMap = true;
	
	// Create a copy of the heightmap to be manipulatet and returned
	var newHeightmap = deepcopy(heightmap);
	
	// Reorganize tiles in list and sort by height
	var tilesByHeight = [];
	for (var x = 0; x < heightmap.length; x++)
		for (var y = 0; y < heightmap[x].length; y++)
			tilesByHeight.push({"height" : heightmap[x][y], "x" : x, "y" : y});
	
	function sortByHeight(tile1, tile2)
	{
		return tile2.height - tile1.height;
	}
	
	tilesByHeight.sort(sortByHeight);
	
	// Choose the fields to be checked for material movement
	if (diagonalFlow)
		var compareFields = [{"x" : 1, "y" : 0}, {"x" : 1, "y" : 1}, {"x" : 0, "y" : 1}, {"x" : -1, "y" : 1}, {"x" : -1, "y" : 0}, {"x" : -1, "y" : -1}, {"x" : 0, "y" : -1}, {"x" : 1, "y" : -1}];
	else
		var compareFields = [{"x" : 1, "y" : 0}, {"x" : 0, "y" : 1}, {"x" : -1, "y" : 0}, {"x" : 0, "y" : -1}];
	
	// Calculate drain distribution and carry the material
	var maxWaterFlow = 0; // DEBUG
	for (var tile = 0; tile < tilesByHeight.length; tile++)
	{
		// Setting up some variables
		var actualX = tilesByHeight[tile].x;
		var actualY = tilesByHeight[tile].y;
		var actualHeight = heightmap[actualX][actualY];
		var actualWater = waterMap[actualX][actualY]; // Needs to be set here because it changes in the process
		
		// Get sum of height difference to appending lower fields
		var sumHeightDiff = 0; // The influence of each field might need to be scaled if diogonal
		for (var i = 0; i < compareFields.length; i++)
		{
			var compareX = actualX + compareFields[i].x;
			var compareY = actualY + compareFields[i].y;
			if (compareX >= 0 && compareX < heightmap.length && compareY >= 0 && compareY < heightmap[0].length)
			{
				var compareHeight = heightmap[compareX][compareY];
				if (compareHeight < actualHeight)
				{
					if (abs(compareFields[i].x) == 1 && abs(compareFields[i].y) == 1) // If diagonal
						sumHeightDiff += diagonalScale * (actualHeight - compareHeight);
					else
						sumHeightDiff += actualHeight - compareHeight;
				}
			}
		}
		
		// Distribute water flow and material movement according to hight difference
		if (sumHeightDiff)
		{
			for (var i = 0; i < compareFields.length; i++)
			{
				var compareX = actualX + compareFields[i].x;
				var compareY = actualY + compareFields[i].y;
				if (compareX >= 0 && compareX < heightmap.length && compareY >= 0 && compareY < heightmap[0].length)
				{
					var compareHeight = heightmap[compareX][compareY];
					if (compareHeight < actualHeight)
					{
						var waterFlow = (1 - seepage) * actualWater * (actualHeight - compareHeight) / sumHeightDiff;
						if (abs(compareFields[i].x) == 1 && abs(compareFields[i].y) == 1) // If diagonal
							waterFlow *= diagonalScale;
						waterMap[actualX][actualY] -= waterFlow;
						waterMap[compareX][compareY] += waterFlow;
						var carriedMaterial = strength * waterFlow * abs(actualHeight - compareHeight); // Add any non-linear scaling that might be needed here
						newHeightmap[actualX][actualY] -= carriedMaterial;
						newHeightmap[compareX][compareY] += carriedMaterial;
						waterMap[compareX][compareY] *= (1 - seepage);
						if (waterFlow > maxWaterFlow) //DEBUG
							maxWaterFlow = waterFlow;
					}
				}
			}
		}
	}
	log("maxWaterFlow = " + maxWaterFlow);
	
	if (returnWaterMap)
		return {"height" : newHeightmap, "water" : waterMap};
	else
		return newHeightmap;
}

// This is to week and requires an amount of loops not supported by the javascript engine
function getDropletErosion(heightmap)
{
	var newHeightmap = deepcopy(heightmap);

	var diagonalFlow = false;
	if (diagonalFlow)
		var compareFields = [{"x" : 1, "y" : 0}, {"x" : 1, "y" : 1}, {"x" : 0, "y" : 1}, {"x" : -1, "y" : 1}, {"x" : -1, "y" : 0}, {"x" : -1, "y" : -1}, {"x" : 0, "y" : -1}, {"x" : 1, "y" : -1}];
	else
		var compareFields = [{"x" : 1, "y" : 0}, {"x" : 0, "y" : 1}, {"x" : -1, "y" : 0}, {"x" : 0, "y" : -1}];
	
	var water = 1;
	var waterLoss = 0.1;
	var soilPortion = 0.1;
	var soilCarried = 0;
	
	var pos = {"x" : randInt(heightmap.length), "y" : randInt(heightmap[0].length)};
	while (water > 0.1)
	{
		newHeightmap[pos.x][pos.y] -= water * soilPortion;
		soilCarried = water * soilPortion;
		
		var maxHeightDiff = 0;
		var fieldToMove = undefined;
		for (var i = 0; i < compareFields.length; i++)
		{
			var actualX = pos.x + compareFields[i].x;
			var actualY = pos.y + compareFields[i].y;
			if (actualX >= 0 && actualY >= 0 && actualX < heightmap.length && actualX < heightmap[0].length)
			{
				var actualHeightDiff = newHeightmap[pos.x][pos.y] - newHeightmap[actualX][actualY];
				if (actualHeightDiff > maxHeightDiff)
				{
					maxHeightDiff = actualHeightDiff;
					fieldToMove = i;
				}
			}
		}
		
		// Drop soilCarried higher than maxHeightDiff NEEDED
		
		if (fieldToMove === undefined)
			break
		
		pos = {"x": pos.x + compareFields[fieldToMove].x, "y" : pos.y + compareFields[fieldToMove].y};
		newHeightmap[pos.x][pos.y] += soilCarried;
		soilCarried = 0;
	}
	
	return newHeightmap;
}

// Not working as planned
// If it would work quite effective though (simulates the water going all the way down without further calculations but one sort)
function getHydraulicErosionedHeightAndWatermap(heightmap, waterMap, rain, evaporation, saturation, diagonalFlow)
{
	// Make some arguments optional
	if (rain === undefined)
		rain = 0.3;
	if (evaporation === undefined)
		evaporation = 0.4;
	if (!saturation)
		saturation = 0.3;
	if (diagonalFlow === undefined)
		diagonalFlow = false;
	
	// Copy the heightmap to manipulate and return
	var newHeightmap = deepcopy(heightmap);
	
	// Global manipulation to the water map
	if (!waterMap) // Generate new water map with rain
	{
		waterMap = [];
		for (var x = 0; x < heightmap.length; x++)
		{
			waterMap.push([]);
			for (var y = 0; y < heightmap[x].length; y++)
				waterMap[x].push(rain);
		}
	}
	else // Evaporate and add rain
	{
		for (var x = 0; x < heightmap.length; x++)
			for (var y = 0; y < heightmap[x].length; y++)
				waterMap[x][y] = (1 - evaporation) * waterMap[x][y] + rain;
	}
	// TEST Start
	// waterMap[round(waterMap.length / 2)][round(waterMap[0].length / 2)] += 10;
	// TEST End
	
	// Setup fields to check as neighbors
	if (diagonalFlow)
		var compareFields = [{"x" : 1, "y" : 0}, {"x" : 1, "y" : 1}, {"x" : 0, "y" : 1}, {"x" : -1, "y" : 1}, {"x" : -1, "y" : 0}, {"x" : -1, "y" : -1}, {"x" : 0, "y" : -1}, {"x" : 1, "y" : -1}];
	else
		var compareFields = [{"x" : 1, "y" : 0}, {"x" : 0, "y" : 1}, {"x" : -1, "y" : 0}, {"x" : 0, "y" : -1}];

	// Reorganize tiles in a list and sort it by water surface height
	// NOTE: The waterSurface is ONLY to sort the list! It is not changed in the process and thus not accurate!
	var tileList = [];
	for (var x = 0; x < newHeightmap.length; x++)
		for (var y = 0; y < newHeightmap[x].length; y++)
			tileList.push({"waterSurface" : newHeightmap[x][y] + waterMap[x][y], "x" : x, "y": y});
	function sortListByHeight(tile1, tile2)
	{
		return tile2.waterSurface - tile1.waterSurface;
	}
	tileList.sort(sortListByHeight);
	// log("Highest: " + tileList[0].waterSurface + ", Lowest: " + tileList[tileList.length - 1].waterSurface); // DEBUG
	
	// Go through the list and calculate water drainage and soil transportation
	for (var tile = 0; tile < tileList.length; tile++)
	{
		var actualX = tileList[tile].x;
		var actualY = tileList[tile].y;
		var actualHeight = newHeightmap[actualX][actualY] + waterMap[actualX][actualY];
		// Get the sum of the height difference of lower tiles to compare and reduced local compare map containing the height difference
		var sumHeightDiff = 0;
		var neighborInfo = [];
		for (var i = 0; i < compareFields.length; i++)
		{
			var compareX = actualX + compareFields[i].x;
			var compareY = actualY + compareFields[i].y;
			if (compareX >= 0 && compareX < heightmap.length && compareY >= 0 && compareY < heightmap[0].length) // If tile in map
			{
				var compareHeight = newHeightmap[compareX][compareY] + waterMap[compareX][compareY];
				if (actualHeight > compareHeight)
				{
					var heightDiff = actualHeight - compareHeight;
					neighborInfo.push({"heightDiff" : heightDiff, "x" : compareX, "y" : compareY});
					sumHeightDiff += heightDiff;
				}
			}
		}
		// Calculate local water drainage
		// Not perfect: Example (all water)
		// f0 = 3, f1 = 2, f2 = 1 -> d1 = 3/2 * 1/3 = 1/2, d2 = 3/2 * 2/3 = 1 -> f0 = 1.5, f1 = 2.5, f2 = 2
		// f0 = 3, f1 = 2, f2 = 1, f3 = 0 -> d1 = 6/2 * 1/6 = 1/2, d2 = 6/2 * 2/6 = 1, d3 = 6/2 * 3/6 = 3/2 -> f0 = 0, f1 = 2,5, f2 = 2, f3 = 1,5
		var neighborDrain = [];
		for (var i = 0; i < neighborInfo.length; i++)
			neighborDrain.push(min(sumHeightDiff / 2, waterMap[actualX][actualY]) * neighborInfo[i].heightDiff / sumHeightDiff);
		// Actually move water and ground
		for (var i = 0; i < neighborInfo.length; i++)
		{
			var neighborX = neighborInfo[i].x;
			var neighborY = neighborInfo[i].y;
			waterMap[actualX][actualY] -= neighborDrain[i];
			waterMap[neighborX][neighborY] += neighborDrain[i];
			var transportedGround = saturation * neighborDrain[i];
			newHeightmap[actualX][actualY] -= transportedGround;
			newHeightmap[neighborX][neighborY] += transportedGround;
		}
	}
	
	return {"height" : newHeightmap, "water" : waterMap};
}

// Somehow working but cheated!
function giveMeSomeRiversNOW(heightmap)
{
	var seepage = 0;
	var strength = 1/4;
	var loops = 200; // 200 always works but is quite strong and slow
	
	// var fields = [{"x" : 1, "y" : 0}, {"x" : 0, "y" : 1}, {"x" : -1, "y" : 0}, {"x" : 0, "y" : -1}]; // 4 way map
	var fields = [{"x" : 1, "y" : 0}, {"x" : 1, "y" : 1}, {"x" : 0, "y" : 1}, {"x" : -1, "y" : 1}, {"x" : -1, "y" : 0}, {"x" : -1, "y" : -1}, {"x" : 0, "y" : -1}, {"x" : 1, "y" : -1}]; // 8 way map
	
	function sortByHeight(heightCoordinatePair1, heightCoordinatePair2)
	{
		return heightCoordinatePair1.height - heightCoordinatePair2.height;
	}
	
	var heightmapToWork = deepcopy(heightmap);
	for (var c = 0; c < loops; c++)
	{
		var waterMap = [];
		for (var x = 0; x < heightmapToWork.length; x++)
		{
			waterMap.push([]);
			for (var y = 0; y < heightmapToWork[x].length; y++)
				waterMap[x].push(1);
		}
		
		// Reorganize tiles in list and sort by height
		var tilesByHeight = [];
		for (var x = 0; x < heightmapToWork.length; x++)
			for (var y = 0; y < heightmapToWork[x].length; y++)
				tilesByHeight.push({"height" : heightmapToWork[x][y], "x" : x, "y" : y});
		
		tilesByHeight.sort(sortByHeight);
		
		// Generate waterDrainMap
		var waterDrainMap = [];
		for (var x = 0; x < heightmapToWork.length; x++)
		{
			waterDrainMap.push([]);
			for (var y = 0; y < heightmapToWork[x].length; y++)
				waterDrainMap[x].push(0);
		}
		
		// Simulate water drain (ignoring water height)
		for (var tile = 0; tile < tilesByHeight.length; tile++)
		{
			var actualX = tilesByHeight[tile].x;
			var actualY = tilesByHeight[tile].y;
			var actualWater = (1 - seepage) * waterMap[actualX][actualY];
			
			// Get total height difference to lower fields
			var sumHeightDiff = 0;
			for (var i = 0; i < fields.length; i++)
			{
				var compareX = actualX + fields[i].x;
				var compareY = actualY + fields[i].y;
				if (compareX >= 0 && compareX < heightmapToWork.length && compareY >= 0 && compareY < heightmapToWork[0].length)
				{
					var actualHeight = heightmapToWork[actualX][actualY];
					var compareHeight = heightmapToWork[compareX][compareY];
					if (compareHeight < actualHeight)
						sumHeightDiff += actualHeight - compareHeight;
				}
			}
			
			// Distribute water (drain) according to hight difference (assuming linearity)
			if (sumHeightDiff)
			{
				for (var i = 0; i < fields.length; i++)
				{
					var compareX = actualX + fields[i].x;
					var compareY = actualY + fields[i].y;
					if (compareX >= 0 && compareX < heightmapToWork.length && compareY >= 0 && compareY < heightmapToWork[0].length)
					{
						var actualHeight = heightmapToWork[actualX][actualY];
						var compareHeight = heightmapToWork[compareX][compareY];
						if (compareHeight < actualHeight)
						{
							// if (i % 2 == 1)
								// var waterDrain = actualWater / Math.pow(2, 1/2) * (actualHeight - compareHeight) / sumHeightDiff;
							// else
								var waterDrain = actualWater * (actualHeight - compareHeight) / sumHeightDiff;
							// waterMap[actualX][actualY] -= waterDrain; // Unneeded
							waterMap[compareX][compareY] += waterDrain;
							waterDrainMap[compareX][compareY] += waterDrain;
							waterDrainMap[actualX][actualY] += waterDrain; // Is this wanted?
						}
					}
				}
			}
		}
		
		var newHeightmap = deepcopy(heightmapToWork);
		for (var x = 0; x < heightmapToWork.length; x++)
		{
			for (var y = 0; y < heightmapToWork[x].length; y++)
			{
				if (x + 1 < heightmapToWork.length)
				{
					var carriedMaterialX = strength * (heightmapToWork[x][y] - heightmapToWork[x+1][y]);
					if (carriedMaterialX > 0)
						carriedMaterialX *= waterDrainMap[x][y];
					else
						carriedMaterialX *= waterDrainMap[x+1][y];
					newHeightmap[x][y] -= carriedMaterialX;
					newHeightmap[x+1][y] += carriedMaterialX;
				}
				if (y + 1 < heightmapToWork[x].length)
				{
					var carriedMaterialY = strength * (heightmapToWork[x][y] - heightmapToWork[x][y+1]);
					if (carriedMaterialY > 0)
						carriedMaterialY *= waterDrainMap[x][y];
					else
						carriedMaterialY *= waterDrainMap[x][y+1];
					newHeightmap[x][y] -= carriedMaterialY;
					newHeightmap[x][y+1] += carriedMaterialY;
				}
			}
		}
		heightmapToWork = deepcopy(newHeightmap);
	}
	
	// myReliefmap = getRescaledReliefmap(myReliefmap, -1, 1)
	var evenHeightmap = deepcopy(newHeightmap);
	var unevenHeightmap = deepcopy(newHeightmap);
	for (var x = 0; x < newHeightmap.length; x++)
	{
		for (var y = 0; y < newHeightmap[x].length; y++)
		{
			if ((x+y)%2 == 0 && x+1 < newHeightmap.length)
				evenHeightmap[x][y] = evenHeightmap[x+1][y];
			else if ((x+y)%2 == 1 && x+1 < newHeightmap.length)
				unevenHeightmap[x][y] = unevenHeightmap[x+1][y];
			evenHeightmap[x][y] = Math.pow(evenHeightmap[x][y], 3);
			unevenHeightmap[x][y] = Math.pow(unevenHeightmap[x][y], 3);
		}
	}
	newHeightmap = getSumOfFields2D(evenHeightmap, unevenHeightmap);
	
	return newHeightmap;
}

// THE BETTER GUESSES!!!

function getWaterErodedHeightmap(heightmap, strength)
{
	strength = (strength || 1/4);
	var newHeightmap = deepcopy(heightmap);
	var waterAmountMap = getWaterDrainMap(heightmap, 0, undefined);
	for (var x = 0; x < heightmap.length; x++)
	{
		for (var y = 0; y < heightmap[x].length; y++)
		{
			if (x + 1 < heightmap.length)
			{
				var carriedMaterialX = strength * (heightmap[x][y] - heightmap[x+1][y]);
				if (carriedMaterialX > 0)
					carriedMaterialX *= waterAmountMap[x][y];
				else
					carriedMaterialX *= waterAmountMap[x+1][y];
				newHeightmap[x][y] -= carriedMaterialX;
				newHeightmap[x+1][y] += carriedMaterialX;
			}
			// if (x > 0)
			// {
				// var carriedMaterialX = strength * (heightmap[x][y] - heightmap[x-1][y]);
				// if (carriedMaterialX > 0)
					// carriedMaterialX *= waterAmountMap[x][y];
				// else
					// carriedMaterialX *= waterAmountMap[x-1][y];
				// newHeightmap[x][y] -= carriedMaterialX;
				// newHeightmap[x-1][y] += carriedMaterialX;
			// }
			if (y + 1 < heightmap[x].length)
			{
				var carriedMaterialY = strength * (heightmap[x][y] - heightmap[x][y+1]);
				if (carriedMaterialY > 0)
					carriedMaterialY *= waterAmountMap[x][y];
				else
					carriedMaterialY *= waterAmountMap[x][y+1];
				newHeightmap[x][y] -= carriedMaterialY;
				newHeightmap[x][y+1] += carriedMaterialY;
			}
			// if (y > 0)
			// {
				// var carriedMaterialY = strength * (heightmap[x][y] - heightmap[x][y-1]);
				// if (carriedMaterialY > 0)
					// carriedMaterialY *= waterAmountMap[x][y];
				// else
					// carriedMaterialY *= waterAmountMap[x][y-1];
				// newHeightmap[x][y] -= carriedMaterialY;
				// newHeightmap[x][y-1] += carriedMaterialY;
			// }
			// if (x + 1 < heightmap.length && y + 1 < heightmap[x].length)
			// {
				// var carriedMaterialX = strength / Math.pow(2, 1/2) * (heightmap[x][y] - heightmap[x+1][y+1]);
				// if (carriedMaterialX > 0)
					// carriedMaterialX *= waterAmountMap[x][y];
				// else
					// carriedMaterialX *= waterAmountMap[x+1][y+1];
				// newHeightmap[x][y] -= carriedMaterialX;
				// newHeightmap[x+1][y+1] += carriedMaterialX;
			// }
			// if (x > 0 && y > 0)
			// {
				// var carriedMaterialX = strength / Math.pow(2, 1/2) * (heightmap[x][y] - heightmap[x-1][y-1]);
				// if (carriedMaterialX > 0)
					// carriedMaterialX *= waterAmountMap[x][y];
				// else
					// carriedMaterialX *= waterAmountMap[x-1][y-1];
				// newHeightmap[x][y] -= carriedMaterialX;
				// newHeightmap[x-1][y-1] += carriedMaterialX;
			// }
			// if (x + 1 < heightmap.length && y > 0)
			// {
				// var carriedMaterialX = strength / Math.pow(2, 1/2) * (heightmap[x][y] - heightmap[x+1][y-1]);
				// if (carriedMaterialX > 0)
					// carriedMaterialX *= waterAmountMap[x][y];
				// else
					// carriedMaterialX *= waterAmountMap[x+1][y-1];
				// newHeightmap[x][y] -= carriedMaterialX;
				// newHeightmap[x+1][y-1] += carriedMaterialX;
			// }
			// if (x > 0 && y + 1 < heightmap[x].length)
			// {
				// var carriedMaterialX = strength / Math.pow(2, 1/2) * (heightmap[x][y] - heightmap[x-1][y+1]);
				// if (carriedMaterialX > 0)
					// carriedMaterialX *= waterAmountMap[x][y];
				// else
					// carriedMaterialX *= waterAmountMap[x-1][y+1];
				// newHeightmap[x][y] -= carriedMaterialX;
				// newHeightmap[x-1][y+1] += carriedMaterialX;
			// }
		}
	}
	
	return newHeightmap;
}

// Good chance to be best
function getHydraulicErodedHeightmap(heightmap, strength, rain, waterFade, soilPortion, watermap, returnWatermap, returnDrainmap)
{
	strength = (strength || 1);
	if (rain === undefined)
		rain = 0.02;
	if (waterFade === undefined)
		waterFade = 0.05;
	if (soilPortion === undefined)
		soilPortion = 0.3;
	var threshold = 0;
	
	if (!watermap)
	{
		watermap = [];
		for (var x = 0; x < heightmap.length; x++)
		{
			watermap.push([]);
			for (var y = 0; y < heightmap[x].length; y++)
				watermap[x].push(10 * rain);
		}
	}
	else
	{
		for (var x = 0; x < watermap.length; x++)
			for (var y = 0; y < watermap[x].length; y++)
				watermap[x][y] = (1 - waterFade) * watermap[x][y] + rain;
	}
	// TEST
	// watermap[round(watermap.length / 2)][round(watermap[0].length / 2)] += 1;
	
	var waterDrainMap = [];
	for (var x = 0; x < watermap.length; x++)
	{
		waterDrainMap.push([]);
		for (var y = 0; y < watermap[x].length; y++)
		{
			// DEBUG
			if (watermap[x][y] < 0)
				warn("Watermap contains negative values: watermap[" + x + "][" + y + "] = " + watermap[x][y]);
			
			var actualHeight = heightmap[x][y] + watermap[x][y];
			
			var heightDifferenceX = 0;
			if (x + 1 < watermap.length)
				heightDifferenceX = actualHeight - heightmap[x+1][y] - watermap[x+1][y];
			var heightDifferenceY = 0;
			if (y + 1 < watermap[x].length)
				heightDifferenceY = actualHeight - heightmap[x][y+1] - watermap[x][y+1];
			
			// This is not good! It's quite possible that all directions get the same amount of water though they got very different slope!
			var waterFlowX = 0;
			if (heightDifferenceX > threshold/* && watermap[x][y] > threshold*/)
				waterFlowX = min(watermap[x][y] / 4, strength * heightDifferenceX / 2);
			else if (heightDifferenceX < - threshold/* &&  watermap[x+1][y] > threshold*/)
				waterFlowX = - min(watermap[x+1][y] / 4, - strength * heightDifferenceX / 2);
			var waterFlowY = 0;
			if (heightDifferenceY > threshold/* && watermap[x][y] > threshold*/)
				waterFlowY = min(watermap[x][y] / 4, strength * heightDifferenceY / 2);
			else if (heightDifferenceY < - threshold/* && watermap[x][y+1] > threshold*/)
				waterFlowY = - min(watermap[x][y+1] / 4, - strength *  heightDifferenceY / 2);
			
			waterDrainMap[x].push({"x" : waterFlowX, "y" : waterFlowY});
		}
	}
	
	var newHeightmap = deepcopy(heightmap);
	
	for (var x = 0; x < watermap.length; x++)
	{
		for (var y = 0; y < watermap[x].length; y++)
		{
			if (waterDrainMap[x][y].x)
			{
				watermap[x][y] -= waterDrainMap[x][y].x;
				watermap[x+1][y] += waterDrainMap[x][y].x;
				newHeightmap[x][y] -= soilPortion * waterDrainMap[x][y].x;
				newHeightmap[x+1][y] += soilPortion * waterDrainMap[x][y].x;
			}
			if (waterDrainMap[x][y].y)
			{
				watermap[x][y] -= waterDrainMap[x][y].y;
				watermap[x][y+1] += waterDrainMap[x][y].y;
				newHeightmap[x][y] -= soilPortion * waterDrainMap[x][y].y;
				newHeightmap[x][y+1] += soilPortion * waterDrainMap[x][y].y;
			}
		}
	}
	
	if (returnWatermap && returnDrainmap)
		return {"height" : newHeightmap, "water" : watermap, "drain" : waterDrainMap};
	else if (returnWatermap)
		return {"height" : newHeightmap, "water" : watermap};
	else if (returnDrainmap)
		return {"height" : newHeightmap, "drain" : waterDrainMap};
	else
		return newHeightmap;
}

function waterTry1(heightMap, waterMap, rain, waterFade, soilPortion, drainPortion)
{
	if (rain === undefined)
		rain = 0.1;
	if (waterFade === undefined)
		waterFade = 0.1;
	soilPortion = (soilPortion || 0.1);
	drainPortion = (drainPortion || 0.1); // Depends on the roughness of the terrain. If smooth 1 is OK, else lower values.
	
	if (!waterMap)
	{
		waterMap = [];
		for (var x = 0; x < heightMap.length; x++)
		{
			waterMap.push([]);
			for (var y = 0; y < heightMap[x].length; y++)
				waterMap[x].push(rain);
		}
	}
	else
		for (var x = 0; x < heightMap.length; x++)
			for (var y = 0; y < heightMap[x].length; y++)
				waterMap[x][y] = (1 - waterFade) * waterMap[x][y] + rain;
	
	function grad1(scalarField)
	{
		var vectorField = [];
		for (var x = 0; x < scalarField.length; x++)
		{
			vectorField.push([]);
			for (var y = 0; y < scalarField[x].length; y++)
			{
				vectorField[x].push({"x" : 0, "y" : 0});
				if (x+1 < scalarField.length)
					vectorField[x][y].x = scalarField[x][y] - scalarField[x+1][y];
				if (y+1 < scalarField[x].length)
					vectorField[x][y].y = scalarField[x][y] - scalarField[x][y+1];
			}
		}
		return vectorField;
	}
	
	function div1(vectorField)
	{
		var scalarField = [];
		for (var x = 0; x < vectorField.length; x++)
		{
			scalarField.push([]);
			for (var y = 0; y < vectorField[x].length; y++)
			{
				scalarField[x].push(-vectorField[x][y].x - vectorField[x][y].y);
				if (x-1 >= 0)
					scalarField[x][y] += vectorField[x-1][y].x;
				if (y-1 >= 0)
					scalarField[x][y] += vectorField[x][y-1].y;
			}
		}
		return scalarField;
	}
	
	function invertField1(field)
	{
		var newField = deepcopy(field);
		if (typeof(field[0][0]) == "object")
		{
			for (var x = 0; x < field.length; x++)
			{
				newField.push([]);
				for (var y = 0; y < field[x].length; y++)
					newField.push({"x" : -field[x][y].x, "y" : -field[x][y].y});
			}
		}
		else
		{
			for (var x = 0; x < field.length; x++)
			{
				newField.push([]);
				for (var y = 0; y < field[x].length; y++)
					newField.push(-field[x][y]);
			}
		}
		return newField;
	}
	
	function getSumOfFields(field1, field2)
	{
		var sumField = [];
		for (var x = 0; x < field1.length; x++)
		{
			sumField.push([]);
			for (var y = 0; y < field1[x].length; y++)
				sumField[x].push(field1[x][y] + field2[x][y]);
		}
		return sumField;
	}
	
	function lengthOf(vector)
	{
		return Math.pow(vector.x * vextor.x + vector.y * vector.y, 1/2);
	}
	
	var waterSpeedMap = invertField1(grad1(getSumOfFields(heightMap, waterMap))); // Might drain more water than available!
	
	var newHeightMap = deepcopy(heightMap);
	var newWaterMap = deepcopy(waterMap);
	
	// Transport water and soil
	for (var x = 0; x < heightMap.length; x++)
	{
		for (var y = 0; y < heightMap[x].length; y++)
		{
			if (x+1 < heightMap.length)
			{
				if (waterSpeedMap[x][y].x > 0)
					var waterDrain = min(drainPortion * waterSpeedMap[x][y].x * waterMap[x][y], waterMap[x][y] / 5);
				else
					var waterDrain = -min(-drainPortion * waterSpeedMap[x][y].x * waterMap[x+1][y], waterMap[x+1][y] / 5);
				newWaterMap[x][y] -= waterDrain;
				newWaterMap[x+1][y] += waterDrain;
				var soilCarried = soilPortion * waterDrain * abs(waterSpeedMap[x][y].x);
				newHeightMap[x][y] -= soilCarried;
				newHeightMap[x+1][y] += soilCarried;
			}
			
			if (y+1 < heightMap[0].length)
			{
				if (waterSpeedMap[x][y].y > 0)
					var waterDrain = min(drainPortion * waterSpeedMap[x][y].y * waterMap[x][y], waterMap[x][y] / 5);
				else
					var waterDrain = -min(-drainPortion * waterSpeedMap[x][y].y * waterMap[x][y+1], waterMap[x][y+1] / 5);
				newWaterMap[x][y] -= waterDrain;
				newWaterMap[x][y+1] += waterDrain;
				var soilCarried = soilPortion * waterDrain * abs(waterSpeedMap[x][y].y);
				newHeightMap[x][y] -= soilCarried;
				newHeightMap[x][y+1] += soilCarried;
			}
			if (newWaterMap[x][y] < 0)
				warn("newWaterMap[x][y] = " + newWaterMap[x][y]);
		}
	}
	
	return {"height" : newHeightMap, "water" : newWaterMap};
}

function waterTry2(heightMap, waterMap, rain, waterFade, soilPortion, drainStrength)
{
	if (rain === undefined)
		rain = 1; // Should be about 0.2, 1 is quite strong
		// Square speed parameters: 2
	if (waterFade === undefined)
		waterFade = 0.2; // Should be about 0.1, 0.2 is quite strong
		// Square speed parameters: 0.2
	if (soilPortion === undefined)
		soilPortion = 2; // Should be about 0.05, 1 is quite strong, depends on maxWaterSpeed
		// Square speed parameters: 2
	if (drainStrength === undefined)
		drainStrength = 0.9; // For some reason 1 leads to negative water heights sometimes (float inacuracy?) so a bit smaller
	
	if (!waterMap)
	{
		waterMap = [];
		for (var x = 0; x < heightMap.length; x++)
		{
			waterMap.push([]);
			for (var y = 0; y < heightMap[x].length; y++)
				waterMap[x].push(rain); // rain or rain / waterFade ?
		}
	}
	else
		for (var x = 0; x < heightMap.length; x++)
			for (var y = 0; y < heightMap[x].length; y++)
				waterMap[x][y] = (1 - waterFade) * waterMap[x][y] + rain;
	
	// Calculate water drain and speed
	var newWaterMap = deepcopy(waterMap);
	var newHeightMap = deepcopy(heightMap);
	var newWaterDrainMap = [];
	var newWaterSpeedMap = [];
	var maxWaterSpeed = 0; // DEBUG Seams to be 2 at max
	for (var x = 0; x < heightMap.length; x++)
	{
		newWaterDrainMap.push([]);
		newWaterSpeedMap.push([]);
		for (var y = 0; y < heightMap[x].length; y++)
		{
			newWaterDrainMap[x].push({"x" : 0, "y" : 0});
			newWaterSpeedMap[x].push({"x" : 0, "y" : 0});
			var actualHeight = heightMap[x][y] + waterMap[x][y];
			if (x+1 < heightMap.length)
			{
				newWaterDrainMap[x][y].x = drainStrength * max(min((actualHeight - heightMap[x+1][y] - waterMap[x+1][y]) / 4, waterMap[x][y] / 4), -waterMap[x+1][y] / 4);
				// Test
				if (newWaterDrainMap[x][y].x > 0)
					newWaterSpeedMap[x][y].x = abs(newWaterDrainMap[x][y].x) / waterMap[x][y];
				else
					newWaterSpeedMap[x][y].x = abs(newWaterDrainMap[x][y].x) / waterMap[x+1][y];
				//newWaterSpeedMap[x][y].x = abs(newWaterDrainMap[x][y].x) / (waterMap[x+1][y] + waterMap[x][y]) * 2;
				newWaterMap[x][y] -= newWaterDrainMap[x][y].x;
				newWaterMap[x+1][y] += newWaterDrainMap[x][y].x;
				var groundMoved = soilPortion * newWaterSpeedMap[x][y].x * newWaterDrainMap[x][y].x;
				newHeightMap[x][y] -= groundMoved;
				newHeightMap[x+1][y] += groundMoved;
			}
			if (y+1 < heightMap.length)
			{
				newWaterDrainMap[x][y].y = drainStrength * max(min((actualHeight - heightMap[x][y+1] - waterMap[x][y+1]) / 4, waterMap[x][y] / 4), -waterMap[x][y+1] / 4);
				// Test
				if (newWaterDrainMap[x][y].y > 0)
					newWaterSpeedMap[x][y].y = abs(newWaterDrainMap[x][y].y) / waterMap[x][y];
				else
					newWaterSpeedMap[x][y].y = abs(newWaterDrainMap[x][y].y) / waterMap[x][y+1];
				// newWaterSpeedMap[x][y].y = abs(newWaterDrainMap[x][y].y) / (waterMap[x][y+1] + waterMap[x][y]) * 2;
				newWaterMap[x][y] -= newWaterDrainMap[x][y].y;
				newWaterMap[x][y+1] += newWaterDrainMap[x][y].y;
				var groundMoved = soilPortion * newWaterSpeedMap[x][y].y * newWaterSpeedMap[x][y].y * newWaterDrainMap[x][y].y; // Here the magic happens
				newHeightMap[x][y] -= groundMoved;
				newHeightMap[x][y+1] += groundMoved;
			}
			// DEBUG
			if (newWaterMap[x][y] < 0)
				warn("newWaterMap[" + x + "][" + y + "] = " + newWaterMap[x][y]);
			if (newWaterSpeedMap[x][y].x > maxWaterSpeed)
				maxWaterSpeed = newWaterSpeedMap[x][y].x;
			if (newWaterSpeedMap[x][y].y > maxWaterSpeed)
				maxWaterSpeed = newWaterSpeedMap[x][y].y;
		}
	}
	// log("maxWaterSpeed = " + maxWaterSpeed); // DEBUG
	
	return {"height" : newHeightMap, "water" : newWaterMap, "drain" : newWaterDrainMap, "speed" : newWaterSpeedMap, /* DEBUG */ "maxSpeed" : maxWaterSpeed};
}

function accelleratedWaterErosion(heightMap, waterMap, waterSpeedMap, rain, waterFade, soilPortion, gravity, flowResist)
{
	if (heightMap === undefined)
		raise("accelleratedWaterErosion: heightMap is undefined");
	
	if (rain === undefined)
		rain = 1;
	if (waterFade === undefined)
		waterFade = 0.2;
	if (soilPortion === undefined)
		soilPortion = 0.5;
	if (gravity === undefined)
		gravity = 0.01;
	if (flowResist === undefined)
		flowResist = 1;
	
	if (!waterMap)
	{
		waterMap = [];
		for (var x = 0; x < heightMap.length; x++)
		{
			waterMap.push([]);
			for (var y = 0; y < heightMap[x].length; y++)
				waterMap[x].push(rain); // rain or rain / waterFade ?
		}
	}
	else
		for (var x = 0; x < heightMap.length; x++)
			for (var y = 0; y < heightMap[x].length; y++)
				waterMap[x][y] = (1 - waterFade) * waterMap[x][y] + rain;
	
	if (!waterSpeedMap)
	{
		waterSpeedMap = [];
		for (var x = 0; x < heightMap.length; x++)
		{
			waterSpeedMap.push([]);
			for (var y = 0; y < heightMap[x].length; y++)
				waterSpeedMap[x].push({"x":0, "y":0});
		}
	}
	else // Adjust water speed by rain (ESSENTIAL at low water hight!) and waterFade (Not sure if needed)
	{
		for (var x = 0; x < waterSpeedMap.length; x++)
		{
			for (var y = 0; y < waterSpeedMap[x].length; y++)
			{
				waterSpeedMap[x][y].x *= (1 - waterFade) * (waterMap[x][y] - rain) / waterMap[x][y];
				waterSpeedMap[x][y].y *= (1 - waterFade) * (waterMap[x][y] - rain) / waterMap[x][y];
			}
		}
	}
	
	// var compareMap = [{"x":1, "y":0}, {"x":0, "y":1}, {"x":-1, "y":0}, {"x":0, "y":-1}]; // 4 way
	var compareMap = [{"x":1, "y":0}, {"x":1, "y":1}, {"x":0, "y":1}, {"x":-1, "y":1}, {"x":-1, "y":0}, {"x":-1, "y":-1}, {"x":0, "y":-1}, {"x":1, "y":-1}]; // 8 way
	
	// Calculate water accelleration
	var newWaterMap = deepcopy(waterMap);
	var newWaterSpeedMap = deepcopy(waterSpeedMap);
	var newHeightMap = deepcopy(heightMap);
	var maxWaterHeight = 0; // DEBUG
	var maxWaterSpeed = 0; // DEBUG
	var maxSoilMoved = 0; // DEBUG
	var maxSoilPortion = 0; // DEBUG
	for (var x = 0; x < heightMap.length; x++)
	{
		for (var y = 0; y < heightMap[x].length; y++)
		{
			var actualWaterSurfaceHeight = heightMap[x][y] + waterMap[x][y];
			var waterSpeedSquare = waterSpeedMap[x][y].x * waterSpeedMap[x][y].x + waterSpeedMap[x][y].y * waterSpeedMap[x][y].y;
			var accelleration = {"x":0, "y":0};
			for (var i = 0; i < compareMap.length; i++)
			{
				var compareX = x + compareMap[i].x;
				var compareY = y + compareMap[i].y;
				// Maybe better wrap this?
				if (compareX >= 0 && compareX < heightMap.length && compareY >= 0 && compareY < heightMap[x].length) // If compared tile is in map
					var compareWaterSurfaceHeight = heightMap[compareX][compareY] + waterMap[compareX][compareY];
					var heightDifference = actualWaterSurfaceHeight - compareWaterSurfaceHeight;
					var sinAlpha = heightDifference / Math.pow(heightDifference * heightDifference + 1, 0.5);
					accelleration.x += gravity * compareMap[i].x * sinAlpha;
					accelleration.y += gravity * compareMap[i].y * sinAlpha;
			}
			// Adjust accelleration with flowResist
			// I'm not sure about this!!!
			// I'm quite sure that:
			// 1.) resistantForce proportional speed^2 -> flowResist * waterSpeedMap[x][y].x * abs(waterSpeedMap[x][y].x)
			//		The abs() is to not loose it's direction
			// 2.) decelleration = - resistantForce / mass -> ... / waterMap[x][y]
			// 3.) flowResist is lower if waterDepth is higher -> ... / waterMap[x][y]
			//		Not sure if another "/ waterMap[x][y]" needed...
			var decelleration = {"x":0, "y":0}
			decelleration.x += flowResist * waterSpeedMap[x][y].x * abs(waterSpeedMap[x][y].x) / waterMap[x][y] / waterMap[x][y]; // I'm not sure about this!!!
			decelleration.y += flowResist * waterSpeedMap[x][y].y * abs(waterSpeedMap[x][y].y) / waterMap[x][y] / waterMap[x][y]; // I'm not sure about this!!!
			accelleration.x -= decelleration.x;
			accelleration.y -= decelleration.y;
			// DEBUG
			if (abs(decelleration.x) > abs(waterSpeedMap[x][y].x))
				warn("flowResist to strong: decelleration.x = " + decelleration.x + ", waterSpeedMap[" + x + "][" + y + "].x = " + waterSpeedMap[x][y].x);
			if (abs(decelleration.y) > abs(waterSpeedMap[x][y].y))
				warn("flowResist to strong: decelleration.y = " + decelleration.y + ", waterSpeedMap[" + x + "][" + y + "].y = " + waterSpeedMap[x][y].y);
			
			// Calculate newWaterSpeedMap
			newWaterSpeedMap[x][y].x += accelleration.x;
			newWaterSpeedMap[x][y].y += accelleration.y;
			// DEBUG
			if (newWaterSpeedMap[x][y].x > 1)
				warn("newWaterSpeedMap[" + x + "][" + y + "].x = " + newWaterSpeedMap[x][y].x);
			if (newWaterSpeedMap[x][y].y > 1)
				warn("newWaterSpeedMap[" + x + "][" + y + "].y = " + newWaterSpeedMap[x][y].y);
			
			// Calculate newWaterMap
			var waterDrain = {"x" : newWaterSpeedMap[x][y].x * waterMap[x][y], "y" : newWaterSpeedMap[x][y].y * waterMap[x][y]};
			// Maybe better wrap this?
			if (waterDrain.x > 0 && x+1 < heightMap.length)
			{
				newWaterMap[x][y] -= waterDrain.x;
				newWaterMap[x+1][y] += waterDrain.x;
			}
			if (waterDrain.x < 0 && x-1 >= 0)
			{
				newWaterMap[x][y] += waterDrain.x;
				newWaterMap[x-1][y] -= waterDrain.x;
			}
			if (waterDrain.y > 0 && y+1 < heightMap[x].length)
			{
				newWaterMap[x][y] -= waterDrain.y;
				newWaterMap[x][y+1] += waterDrain.y;
			}
			if (waterDrain.y < 0 && y-1 >= 0)
			{
				newWaterMap[x][y] += waterDrain.y;
				newWaterMap[x][y-1] -= waterDrain.y;
			}
			// DEBUG
			if (newWaterMap[x][y] < 0)
				warn("newWaterMap[" + x + "][" + y + "] = " + newWaterMap[x][y]);
			
			
			// Calculate terrain
			// ToDo: Has to be scaled with sinAlpha in each direction! (Hum, I forgot why. To simulate bedload?)
			//		actualSoilPortion = soilPortion * Math.pow(waterSpeedSquare, 0.5) * sinAlpha;
			var actualSoilPortion = soilPortion * Math.pow(waterSpeedSquare, 0.5);
			var soilMoved = {"x" : actualSoilPortion * waterDrain.x, "y" : actualSoilPortion * waterDrain.y};
			if (newWaterSpeedMap[x][y].x > 0)
			{
				newHeightMap[x][y] -= soilMoved.x;
				if (x+1 < heightMap.length)
					newHeightMap[x+1][y] += soilMoved.x;
			}
			if (newWaterSpeedMap[x][y].x < 0)
			{
				newHeightMap[x][y] += soilMoved.x;
				if (x-1 >= 0)
					newHeightMap[x-1][y] -= soilMoved.x;
			}
			if (newWaterSpeedMap[x][y].y > 0)
			{
				newHeightMap[x][y] -= soilMoved.y;
				if (y+1 < heightMap[x].length)
					newHeightMap[x][y+1] += soilMoved.y;
			}
			if (newWaterSpeedMap[x][y].y < 0)
			{
				newHeightMap[x][y] += soilMoved.y;
				if (y-1 >= 0)
					newHeightMap[x][y-1] -= soilMoved.y;
			}
			// DEBUG
			if (actualSoilPortion > 1)
				warn("actualSoilPortion = " + actualSoilPortion);
			
			// DEBUG
			if (newWaterMap[x][y] > maxWaterHeight)
				maxWaterHeight = newWaterMap[x][y];
			if (newWaterSpeedMap[x][y].x > maxWaterSpeed)
				maxWaterSpeed = newWaterSpeedMap[x][y].x;
			if (newWaterSpeedMap[x][y].y > maxWaterSpeed)
				maxWaterSpeed = newWaterSpeedMap[x][y].y;
			
			if (actualSoilPortion > maxSoilPortion)
				maxSoilPortion = actualSoilPortion;
			
			if (soilMoved.x > maxSoilMoved || soilMoved.y > maxSoilMoved)
				maxSoilMoved = max(soilMoved.x, soilMoved.x);
		}
	}
	// log("maxWaterSpeed = " + maxWaterSpeed); // DEBUG
	
	return {"height" : newHeightMap, "water" : newWaterMap, "speed" : newWaterSpeedMap, /* DEBUG */"maxWaterHeight" : maxWaterHeight, "maxSpeed" : maxWaterSpeed, "maxSoilPortion" : maxSoilPortion, "maxSoilMoved" : maxSoilMoved};
}


////////////////
//
//  Actually do stuff
//
////////////////

// Set target min and max height depending on map size to make average stepness the same on all map sizes
var heightRange = {"min": MIN_HEIGHT * mapSize / 512, "max": MAX_HEIGHT * mapSize / 512};
// Override hightRange to max range
var heightRange = {"min": MIN_HEIGHT, "max": MAX_HEIGHT};

// Set average water coverage
var averageWaterCoverage = 0/5; // NOTE: Since erosion is not pedictable actual water coverage might vary much with the same values
var waterHeight = -MIN_HEIGHT + heightRange.min + averageWaterCoverage * (heightRange.max - heightRange.min);
var waterHeightAdjusted = waterHeight + MIN_HEIGHT;
setWaterHeight(waterHeight);


////////////////
//
//  Generate initial reliefmap
//
////////////////

// Random heightmaps
// var myReliefmap = getRandomReliefmap(heightRange.min, heightRange.max);

var initialReliefmap = undefined;
// initialReliefmap = [[heightRange.min, (heightRange.min + heightRange.max) / 2, heightRange.min], [(heightRange.min + heightRange.max) / 2, heightRange.max, (heightRange.min + heightRange.max) / 2], [heightRange.min, (heightRange.min + heightRange.max) / 2, heightRange.min]];
var myReliefmap = getBaseTerrainDiamondSquare(getMapSize() + 1, heightRange.min, heightRange.max, 0.5, initialReliefmap);
myReliefmap = getRescaledReliefmap(myReliefmap, heightRange.min, heightRange.max);

// Flat ground at min height
// var myReliefmap = getRandomReliefmap(heightRange.min, heightRange.min);
// for (var x = 0; x < mapSize + 1; x++)
	// for (var y = 0; y < mapSize + 1; y++)
		// myReliefmap[x][y] = heightRange.min;
// Add small spike (right)
// myReliefmap[mapSize/2 + mapSize/4][mapSize/2] = heightRange.max; 

// Add brought spike (top)
// myReliefmap[mapSize/2][mapSize/2 + mapSize/4] = heightRange.min + (heightRange.max - heightRange.min) / 4;
// myReliefmap[mapSize/2][mapSize/2 + mapSize/4 + 1] = heightRange.min + (heightRange.max - heightRange.min) / 4;
// myReliefmap[mapSize/2 + 1][mapSize/2 + mapSize/4] = heightRange.min + (heightRange.max - heightRange.min) / 4;
// myReliefmap[mapSize/2 + 1][mapSize/2 + mapSize/4 + 1] = heightRange.min + (heightRange.max - heightRange.min) / 4;

// Smooth central hill
// for (var x = 0; x < mapSize + 1; x++)
// {
	// for (var y = 0; y < mapSize + 1; y++)
	// {
		// var radius = Math.pow((x - mapSize/2)*(x - mapSize/2) + (y - mapSize/2)*(y - mapSize/2), 1/2);
		// myReliefmap[x][y] = heightRange.max * cos(radius/(mapSize/2) * PI);
		// // Add noise
		// myReliefmap[x][y] += randFloat(-heightRange.max / 10, heightRange.max / 10);
	// }
// }
// myReliefmap = getRescaledReliefmap(myReliefmap, heightRange.min, heightRange.max);

// Central cylindric hill
// for (var x = 0; x < mapSize + 1; x++)
// {
	// for (var y = 0; y < mapSize + 1; y++)
	// {
		// var radius = Math.pow((x - mapSize/2)*(x - mapSize/2) + (y - mapSize/2)*(y - mapSize/2), 1/2);
		// if (radius > mapSize/4)
		// {
			// myReliefmap[x][y] = heightRange.min;
		// }
		// else
		// {
			// myReliefmap[x][y] = heightRange.max;
		// }
	// }
// }

// Side hills
// for (var x = 0; x < mapSize + 1; x++)
	// myReliefmap[x][0] = heightRange.max;
// for (var y = 0; y < mapSize + 1; y++)
	// myReliefmap[0][y] = heightRange.max;

// Ramps with slight irregularities
// for (var x = 0; x < mapSize + 1; x++)
// {
	// for (var y = 0; y < mapSize + 1; y++)
	// {
		// // Ramp x
		// myReliefmap[x][y] = x + randFloat(- mapSize / 100, mapSize / 100);
		// // Ramp y
		// // myReliefmap[x][y] = y + randFloat(- mapSize / 10, mapSize / 10);
		// // Ramp xy
		// // myReliefmap[x][y] = x + y + randFloat(- 2 * mapSize / 10, 2 * mapSize / 10);
		// // Pipe
		// // myReliefmap[x][y] = Math.pow(x*x + y*y, 1/2) + randFloat(- Math.pow(2, 1/2) * mapSize / 10, Math.pow(2, 1/2) * mapSize / 10);
		// // Hill
		// // myReliefmap[x][y] = x * y + randFloat(- mapSize * mapSize / 10, mapSize * mapSize / 10);
	// }
// }
// myReliefmap = getRescaledReliefmap(myReliefmap, heightRange.min, heightRange.max);

// Smooth the map a bit
for (var i = 0; i < 2; i++)
	myReliefmap = getHeightErrosionedReliefmap(myReliefmap, 0.5);

var myWatermap = undefined;
var mySpeedMap = undefined;
var myDrainMap = undefined;
var maxWaterHeight = 0;
var maxWaterSpeed = 0;
var maxSoilPortion = 0;
var maxSoilMoved = 0;
// ---- Manipulate the reliefmap ----
for (var i = 0; i < 50/*2*(32 + mapSize/8)*/; i++) // Cycles depend on used getHeightErrosionedReliefmap.map and mapSize so sould be put inside getHeightErrosionedReliefmap
{
	// log("Loop " + (i + 1));
	// if (i % 1 == 0)
	// {
		// for (var xy = 0; xy < mapSize + 1; xy++)
		// {
			// myReliefmap[xy][0] = heightRange.min;
			// myReliefmap[xy][mapSize] = heightRange.min;
			// myReliefmap[0][xy] = heightRange.min;
			// myReliefmap[mapSize][xy] = heightRange.min;
		// }
	// }
	// myReliefmap[0][0] = heightRange.min;
	// myReliefmap[mapSize][0] = heightRange.min;
	// myReliefmap[0][mapSize] = heightRange.min;
	// myReliefmap[mapSize][mapSize] = heightRange.min;
	
	// myReliefmap = getHeightErrosionedReliefmap(myReliefmap, 0.01);
	
	// myReliefmap = getAdditiveWindErrosionedReliefmap(myReliefmap, 1.5); // Strength = 1.6 makes both sides about equaly step
	// myReliefmap = getSubstractiveWindErrosionedReliefmap(myReliefmap, 1.5); // Strength = 1.6 makes both sides about equaly step
	
	// myReliefmap = getErosionHeightmapDVA(myReliefmap, 1);
	// myReliefmap = getFloatingWaterErosionHeightmapDVA(myReliefmap, 1);
	
	// myReliefmap = getDecayErosionedHeightmapDVA2d(myReliefmap, undefined, false);
	// myReliefmap = getWindErosionedHeightmapDVA2d(myReliefmap, {"x": 1, "y": 0}, 1, true); // Not working as it should
	// myReliefmap = getFloatingWaterErosionedHeightmapDVA2d(myReliefmap, 1); // Not working as it should
	
	// myReliefmap = getRainErosionedHeightmapDVA2D(myReliefmap, 1/*rainfall*/, 10/*cycles*/, 1/*strength*/);
	
	// getWaterDrainMap (scaled to me max 1) erosion ("seepage" does not seem to have any impact)
	// myReliefmap = getDifferenceOfFields2D(myReliefmap, getDiv2d(getProductOfFields2D(getRescaledField2D(getWaterDrainMap(myReliefmap, 0), 1), getGrad2d(myReliefmap, false))));
	// Unacaled getWaterDrainMap erosion (fails with to low "seepage" values)
	// myReliefmap = getDifferenceOfFields2D(myReliefmap, getDiv2d(getProductOfFields2D(getWaterDrainMap(myReliefmap, 0.5), getGrad2d(myReliefmap, false))));
	// "Square" getWaterDrainMap (acaled to me max 1) erosion
	// myReliefmap = getDifferenceOfFields2D(myReliefmap, getDiv2d(getProductOfFields2D(getRescaledField2D(getWaterDrainMap(myReliefmap, 0, getWaterDrainMap(myReliefmap, 0)), 1), getGrad2d(myReliefmap, false))));
	// getWaterDrainMap (acaled to me max 1) applied to "sqare" erosion
	
	// var heightAndWaterMap = getHydraulicErosionedHeightAndWatermap(myReliefmap, myWatermap, 0.3, 0.4, 0.3, true);
	// myReliefmap = heightAndWaterMap.height;
	// myWatermap = heightAndWaterMap.water;
	
	// Arguments: heightmap (scalar field), strength (float > 0, <= 1), rain (floar >= 0), seepage (float >= 0, < 1), diagonalFlow (boolean), waterMap (scalar field)
	// if (i % 7 == 0)
		// myWatermap = undefined;
	// var heightAndWaterMap = getWaterErodedHeightmapStandalone(myReliefmap, 1/3, 0, 0.1, true, myWatermap, true);
	// myReliefmap = heightAndWaterMap.height;
	// myWatermap = heightAndWaterMap.water;
	
	// myReliefmap = getDropletErosion(myReliefmap);
	
	// var myMaps = applyWaterErosionTEST(myReliefmap, myWatermap, true);
	// myReliefmap = myMaps.height;
	// myWatermap = myMaps.water;
	
	// BEST RESULTS SO FAR TO GET RIVRES!!!
	// This causes interferance between tiles with even and uneven values of x+y
	// NOTE: It seams that only a strength of 1/4 is sane!
	// myReliefmap = getWaterErodedHeightmap(myReliefmap, 0.25);
	
	// Problem with water derivation...
	// var heightAndWaterMap = getHydraulicErodedHeightmap(myReliefmap, 1/8, 0.02/*1/(i+1)*/, 0.05, 0.3, myWatermap, true, true);
	// myReliefmap = heightAndWaterMap.height;
	// myWatermap = heightAndWaterMap.water;
	// var myDrainmap = heightAndWaterMap.drain;
	
	// Working values
	// 1/4, 1/4, 1/4, 1/8
	// 1/8, 1/8, 1/8, 1/8
	// 1/4, 1/4, 1/8, 1/8
	// 1/4, 1/8, 1/8, 1/16
	// var myMaps = waterTry1(myReliefmap, myWatermap, 1/4, 1/4, 1/4, 1/8);
	// myReliefmap = myMaps.height;
	// myWatermap = myMaps.water;
	
	// Works quite well!
	// var myMaps = waterTry2(myReliefmap, myWatermap);
	// myReliefmap = myMaps.height;
	// myWatermap = myMaps.water;
	// myDrainMap = myMaps.drain;
	// mySpeedMap = myMaps.speed;
	// if (myMaps.maxSpeed > maxWaterSpeed)
		// maxWaterSpeed = myMaps.maxSpeed;
	
	// Best so far!!!
	// Good parameters:
	// 1.) 20 turns
	// var myMaps = accelleratedWaterErosion(myReliefmap, myWatermap, mySpeedMap, /*rain*/1, /*drain*/0.2, /*soil*/0.5, /*grav*/0.005, /*resist*/1);
	//		With:
	//		decelleration.x += flowResist * waterSpeedMap[x][y].x * abs(waterSpeedMap[x][y].x) / waterMap[x][y] / waterMap[x][y];
	//		Resulting in:
	//		maxWaterHeight = 18.88064487135358
	//		maxWaterSpeed = 0.375438729471221
	//		maxSoilPortion = 0.1259412129571284
	//		maxSoilMoved = 0.4254619919349697
	// myReliefmap = getHeightErrosionedReliefmap(myReliefmap, 0.01);
	var myMaps = accelleratedWaterErosion(myReliefmap, myWatermap, mySpeedMap, /*rain*/0.05, /*fade*/0.1, /*soil*/1, /*grav*/0.02, /*resist*/0.1);
	myReliefmap = myMaps.height;
	myWatermap = myMaps.water;
	mySpeedMap = myMaps.speed;
	if (myMaps.maxWaterHeight > maxWaterHeight)
		maxWaterHeight = myMaps.maxWaterHeight;
	if (myMaps.maxSpeed > maxWaterSpeed)
		maxWaterSpeed = myMaps.maxSpeed;
	if (myMaps.maxSoilPortion > maxSoilPortion)
		maxSoilPortion = myMaps.maxSoilPortion;
	if (myMaps.maxSoilMoved > maxSoilMoved)
		maxSoilMoved = myMaps.maxSoilMoved;
	
	// myReliefmap = getRescaledReliefmap(myReliefmap, heightRange.min, heightRange.max);
}
log("maxWaterHeight = " + maxWaterHeight + " (Should be ~1)"); // DEBUG
log("maxWaterSpeed = " + maxWaterSpeed + " (Must be < 1 but should be > 0.1)"); // DEBUG
log("maxSoilPortion = " + maxSoilPortion + " (Must be smaller than 1 but should be > 0.1)"); // DEBUG
log("maxSoilMoved = " + maxSoilMoved + " (Should be ~0.1-1)"); // DEBUG

// Interesting structures with getHydraulicErodedHeightmap strength 2.35
// for (var i = 0; i < 10; i++)
	// myReliefmap = getHeightErrosionedReliefmap(myReliefmap, 1);
// myReliefmap = getInvertedHeightmap(myReliefmap);
// myReliefmap = getRescaledReliefmap(myReliefmap, heightRange.min, heightRange.max);

// myReliefmap = giveMeSomeRiversNOW(myReliefmap);
// myReliefmap = getHeightErrosionedReliefmap(myReliefmap, 1);

// for (var i = 0; i < 100; i++)
// {
	// var heightAndWaterMap = getHydraulicErodedHeightmap(myReliefmap, 0.5, 0.02, 0.01, 0.1, myWatermap, true);
	// myReliefmap = heightAndWaterMap.height;
	// myWatermap = heightAndWaterMap.water;
// }

// myReliefmap = getDecayErosionedHeightmapDVA2d(myReliefmap, 0.25, false);
// myReliefmap = getHeightErrosionedReliefmap(myReliefmap, 1);

// for (var i = 0; i < 10; i++)
	// myReliefmap = getDifferenceOfFields2D(myReliefmap, getDiv2d(getProductOfFields2D(getWaterDrainMap(myReliefmap, 0.6), getGrad2d(myReliefmap, false))));
	// myReliefmap = getDifferenceOfFields2D(myReliefmap, getDiv2d(getProductOfFields2D(getWaterDrainMap(myReliefmap, 0.5, getWaterDrainMap(myReliefmap, 0.5)), getGrad2d(myReliefmap, false))));

// DEBUG Start
// for (var x = 0; x < 10; x++)
	// for (var y = 0; y < 10; y++)
		// log("myReliefmap[" + x + "][" + y + "] = " + myReliefmap[x][y]);
// for (var x = 0; x < myReliefmap.length; x++)
	// for (var y = 0; y < myReliefmap[x].length; y++)
		// if ((x+y)%2 == 0)
			// myReliefmap[x][y] = myReliefmap[(x+1)%myReliefmap.length][y];
// for (var x = 0; x < myReliefmap.length; x++)
	// for (var y = 0; y < myReliefmap[x].length; y++)
		// if ((x+y)%2 == 1)
			// myReliefmap[x][y] += myReliefmap[(x+1)%myReliefmap.length][y];
// for (var x = 0; x < myReliefmap.length; x++)
	// for (var y = 0; y < myReliefmap[x].length; y++)
		// if ((x+y)%2 == 1)
			// myReliefmap[x][y] += myReliefmap[(x+myReliefmap.length-1)%myReliefmap.length][y];
// for (var x = 0; x < myReliefmap.length; x++)
	// for (var y = 0; y < myReliefmap[x].length; y++)
		// if ((x+y)%2 == 1)
			// myReliefmap[x][y] += myReliefmap[x][(y+1)%myReliefmap[x].length];
// for (var x = 0; x < myReliefmap.length; x++)
	// for (var y = 0; y < myReliefmap[x].length; y++)
		// myReliefmap[x][y] += myReliefmap[(x+1)%myReliefmap.length][y];
// WHAT???!!!
// for (var x = 0; x < myReliefmap.length; x++)
	// for (var y = 0; y < myReliefmap[x].length; y++)
			// myReliefmap[x][y] += myReliefmap[x][((y+myReliefmap[x].length)-1)%myReliefmap[x].length];
// Now I try  cheating...
// // myReliefmap = getRescaledReliefmap(myReliefmap, -1, 1)
// var evenHeightmap = deepcopy(myReliefmap);
// var unevenHeightmap = deepcopy(myReliefmap);
// for (var x = 0; x < myReliefmap.length; x++)
// {
	// for (var y = 0; y < myReliefmap[x].length; y++)
	// {
		// if ((x+y)%2 == 0 && x+1 < myReliefmap.length)
			// evenHeightmap[x][y] = evenHeightmap[x+1][y];
		// else if ((x+y)%2 == 1 && x+1 < myReliefmap.length)
			// unevenHeightmap[x][y] = unevenHeightmap[x+1][y];
		// evenHeightmap[x][y] = Math.pow(evenHeightmap[x][y], 3);
		// unevenHeightmap[x][y] = Math.pow(unevenHeightmap[x][y], 3);
	// }
// }
// // for (var i = 0; i < 5; i++)
// // {
	// // evenHeightmap = getHeightErrosionedReliefmap(evenHeightmap);
	// // unevenHeightmap = getHeightErrosionedReliefmap(unevenHeightmap);
// // }
// myReliefmap = getSumOfFields2D(evenHeightmap, unevenHeightmap);
// // myReliefmap = getHeightErrosionedReliefmap(myReliefmap, 1);
// DEBUG End

// myReliefmap = getSumOfFields2D(myReliefmap, myWatermap);

// Normalize and apply reliefmap
myReliefmap = getRescaledReliefmap(myReliefmap, heightRange.min, heightRange.max);
setReliefmap(myReliefmap);


//////////
// Apply terrain texture by height
//////////

var textueByHeight = [];
if (myWatermap != undefined)
	maxWaterHeight = getFieldsMaxAbsValue2d(myWatermap);
if (mySpeedMap != undefined)
	maxWaterSpeed = getFieldsMaxAbsValue2d(mySpeedMap);
textueByHeight.push({"height": heightRange.min + 1/3 * (waterHeightAdjusted - heightRange.min), "texture": "ocean_rock_deep"});
textueByHeight.push({"height": heightRange.min + 2/3 * (waterHeightAdjusted - heightRange.min), "texture": "ocean_rock_b"});
textueByHeight.push({"height": heightRange.min + 3/3 * (waterHeightAdjusted - heightRange.min), "texture": "sand_wet_b"});
textueByHeight.push({"height": waterHeightAdjusted + 1/6 * (heightRange.max - waterHeightAdjusted), "texture": "beach_scrub_50_"});
textueByHeight.push({"height": waterHeightAdjusted + 2/6 * (heightRange.max - waterHeightAdjusted), "texture": "alpine_grass_a"});
textueByHeight.push({"height": waterHeightAdjusted + 3/6 * (heightRange.max - waterHeightAdjusted), "texture": "alpine_forrestfloor"});
textueByHeight.push({"height": waterHeightAdjusted + 4/6 * (heightRange.max - waterHeightAdjusted), "texture": "new_alpine_grass_dirt_a"});
textueByHeight.push({"height": waterHeightAdjusted + 5/6 * (heightRange.max - waterHeightAdjusted), "texture": "alpine_cliff_a"});
textueByHeight.push({"height": waterHeightAdjusted + 6/6 * (heightRange.max - waterHeightAdjusted), "texture": "alpine_snow_rocky"});
for(var x = 0; x < mapSize; x++)
{
	for (var y = 0; y < mapSize; y++)
	{
		var textureMinHeight = heightRange.min;
		for (var i = 0; i < textueByHeight.length; i++)
		{
			if (getHeight(x, y) >= textureMinHeight && getHeight(x, y) <= textueByHeight[i].height)
			{
				g_Map.setTexture(x, y, textueByHeight[i].texture);
				break;
			}
			else
			{
				textureMinHeight = textueByHeight[i].height;
			}
		}
		// Draw water
		if (myWatermap != undefined)
		{
			if (mySpeedMap != undefined)
			{
				if (myWatermap[x][y] > maxWaterHeight / 16)
				{
					var actualWaterSpeed = Math.pow(mySpeedMap[x][y].x * mySpeedMap[x][y].x + mySpeedMap[x][y].y * mySpeedMap[x][y].x, 1/2);
					if (actualWaterSpeed > maxWaterSpeed * 2 / 3)
						g_Map.setTexture(x, y, "water_1");
					else if (actualWaterSpeed > maxWaterSpeed / 3)
						g_Map.setTexture(x, y, "water_2");
					else
						g_Map.setTexture(x, y, "water_3");
				}
			}
			else
			{
				if (myWatermap[x][y] > maxWaterHeight / 2)
					g_Map.setTexture(x, y, "water_3");
				else if (myWatermap[x][y] > maxWaterHeight / 4)
					g_Map.setTexture(x, y, "water_2");
				else if (myWatermap[x][y] > maxWaterHeight / 8)
					g_Map.setTexture(x, y, "water_1");
			}
		}
	}
}

//////////
// Paint other Stuff
//////////

// Slope
// drawFieldAbsOnTiles(getGrad2d(myReliefmap, false));

// Slope multiplied with positive DivGrad values (else 0)
// var gradRel = getGrad2d(myReliefmap, false);
// var fieldToDraw = getDiv2d(gradRel, false);
// for (var x = 0; x < fieldToDraw.length; x++)
// {
	// for (var y = 0; y < fieldToDraw[x].length; y++)
	// {
		// if (fieldToDraw[x][y] < 0)
			// fieldToDraw[x][y] = fieldToDraw[x][y] * Math.pow(gradRel[x][y].x * gradRel[x][y].x + gradRel[x][y].y * gradRel[x][y].y, 1/2);
		// else
			// fieldToDraw[x][y] = 0;
	// }
// }
// drawFieldAbsOnTiles(fieldToDraw);

// Multi step water drain speed simulation
// paintTilesWithWaterDrain(myReliefmap);

// Draw getWaterDrainMap
// var waterDrainMap = getWaterDrainMap(myReliefmap, 0.5);
// for (var x = 0; x < myReliefmap.length; x++) // Scale by height
	// for (var y = 0; y < myReliefmap[x].length; y++)
		// waterDrainMap[x][y] *= (myReliefmap[x][y] - heightRange.min) / (heightRange.max - heightRange.min);
// drawFieldAbsOnTiles(waterDrainMap);

// drawFieldAbsOnTiles(myWatermap);
// drawFieldAbsOnTiles(mySpeedMap);
// drawFieldAbsOnTiles(myDrainmap);

// var myWatermaps = {"height" : undefined, "speed" : undefined, "drain" : undefined};
// for (var i = 0; i < 100; i++)
	// myWatermaps = getWaterMaps(myReliefmap, 0.5, 0.1, 0.1, myWatermaps.height, true, true);
// drawFieldAbsOnTiles(myWatermap);


// Export map data
ExportMap();
