/*
n-dimensional discrete vector analysis functionality
*/

/*
getScalarField
Generate an n-dimensional discrete hypercubic scalar field of the given size.
Arguments:
	dimension: The dimension of the field
	size: The "width" of the hypercube containing the field
	defaultValue: The value all scalars in the field (so it's always flat and don't contain undefined values)
*/
function getScalarField(dimension, size, defaultValue)
{
	dimension = (dimension || 2);
	size = (size || getMapSize() + 1); // Default for heightmaps
	defaultValue = (defaultValue || 0);
	var scalarField = defaultValue;
	for (var d = 0; d < dimension; d++)
	{
		var newScalarField = [];
		for (var s = 0; s < size; s++)
			newScalarField.push(scalarField)
		scalarField = deepcopy(newScalarField);
	}
	return scalarField;
}

/*
getVectorField
Generate an n-dimensional discrete hypercubic vetor field of the given size.
Arguments:
	dimension: int, The dimension of the field
	size: int, The "width" of the hypercube containing the field (So float coordinates are not supported!)
	defaultValue: float, The value all vectors components in the field (So div and curl of this vector field is always 0 and vectors are colinear to (1, 1, 1, ...) or the 0-vector)
*/
function getVectorField(dimension, size, defaultValue)
{
	dimension = (dimension || 2);
	size = (size || mapSize + 1); // Default for heightmaps
	defaultValue = (defaultValue || 0);
	var vector = [];
	for (var d = 0; d < dimension; d++)
		vector.push(defaultValue);
	var vectorField = vector;
	for (var d = 0; d < dimension; d++)
	{
		var newVectorField = [];
		for (var s = 0; s < size; s++)
			newVectorField.push(vectorField)
		vectorField = deepcopy(newVectorField);
	}
	return vectorField;
}

/*
getDimensionOfField
Takes an discrete  hypercubic scalar or vector field and returns it's dimension.
*/
function getDimensionOfField(field)
{
	var nextDepthObject = deepcopy(field);
	var size = field.length;
	var dimension = 0;
	while (typeof(nextDepthObject) == "object")
	{
		if (nextDepthObject.length == size)
		{
			dimension++;
			nextDepthObject = nextDepthObject[0];
		}
		else
			break;
	}
	return dimension;
}

function getAllCoordinatesInHypercube(dimension, size)
{
	var coordinates = [];
	for (var i = 0; i < Math.pow(size, dimension); i++)
	{
		var vector = [];
		var sum = 0
		for (var d = 0; d < dimension; d++)
		{
			vector.push(((i - sum) % (Math.pow(size, d + 1))) / Math.pow(size, d));
			sum += vector[d]*Math.pow(size, d);
		}
		coordinates.push(vector);
	}
	return coordinates;
}

function getVectorLength(vector)
{
	var squareSum = 0;
	for (var d = 0; d < vector.length; d++)
		squareSum += vector[d] * vector[d];
	return Math.pow(squareSum, 1/2);
}

function getFieldValueByCoordinate_SLOW(field, vector)
{
	var dimension = vector.length;
	var size = field.length;
	var value = deepcopy(field);
	for (var d = 0; d < dimension; d++)
		value = value[vector[d]];
	return value;
}

function getFieldValueByCoordinate(field, vector)
{
	var vectorToWorkWith = deepcopy(vector); // Why does that to be no problem in setFieldValueByCoordinate???
	var component = vectorToWorkWith.shift();
	if (vectorToWorkWith.length == 0)
		return field[component];
	return getFieldValueByCoordinate(field[component], vectorToWorkWith);
}

function setFieldValueByCoordinate(field, vector, value)
{
	var component = vector.shift();
	if (vector.length == 0)
		field[component] = value;
	else
		setFieldValueByCoordinate(field[component], vector, value);
}

function getFieldsMaxAbsValue(field, isVectorField)
{
	var dimension = getDimensionOfField(field);
	var size = field.length;
	var coordinates = getAllCoordinatesInHypercube(dimension, size);
	isVectorField = (isVectorField || typeof(getFieldValueByCoordinate(field, coordinates[0])) == "object");
	var maxValue = 0;
	for (var i = 0; i < coordinates.length; i++)
	{
		if (isVectorField)
			var length = getVectorLength(getFieldValueByCoordinate(field, coordinates[i]));
		else
			var length = abs(getFieldValueByCoordinate(field, coordinates[i]));
		if (length > maxValue)
			maxValue = length;
	}
	return maxValue;
}

function getNormalizedField(field, scaleToLength, isVectorField)
{
	scaleToLength = (scaleToLength || 1);
	var dimension = getDimensionOfField(field);
	var size = field.length;
	var coordinates = getAllCoordinatesInHypercube(dimension, size);
	isVectorField = (isVectorField || typeof(getFieldValueByCoordinate(field, coordinates[0])) == "object");
	var maxValue = getFieldsMaxAbsValue(field, isVectorField);
	var newField = deepcopy(field);
	for (var i = 0; i < coordinates.length; i++)
	{
		if (isVectorField)
		{
			var newValue = [];
			for (var d = 0; d < dimension; d++)
				newValue.push(getFieldValueByCoordinate(field, coordinates[i])[d] / maxValue * scaleToLength);
		}
		else
			var newValue = getFieldValueByCoordinate(field, coordinates[i]) / maxValue * scaleToLength;
		setFieldValueByCoordinate(newField, coordinates[i], newValue);
	}
	return newField;
}

/*
getGrad
Returns the gradient of a given discrete hypercuibic scalar field, a discrete hypercubic vector field (gradient field). Dimension might depend on method: scalar fields width or the same - 1.
Problems:
	The calculated vectorfield would be of size sizeOfScalarField - 1. To avoid this the left is wrapped to the right and the bottom to the top.
	Using 2 appending fields results in a shift of shiftVector = 1/2*(1, 1, 1, ... , 1), abs(shiftVector) = 1/2*sqareroot(dimension) between the given scalar and the resulting vector field.
	Using the 2 fiels appending the given tile avoids the shift but results in 2 areas independent of each other (like the black and white fields of a chess bord).
	To couple those two areas the diagonal appending cells have to be used for calculation as well. To check if working properly!!!
*/
function getGrad(scalarField, dimension, size, diagonalCalculation, diagonalScale)
{
	dimension = (dimension || getDimensionOfField(scalarField));
	diagonalScale = (diagonalScale || 1); // Should be 1 / Math.pow(2, 1/2) otherwise
	size = (size || scalarField.length);
	var vectorField = getVectorField(dimension, size);
	var coordinates = getAllCoordinatesInHypercube(dimension, size);
	for (var i = 0; i < coordinates.length; i++)
	{
		var vector = [];
		for (var d = 0; d < dimension; d++)
		{
			var addCoordinate = deepcopy(coordinates[i]);
			addCoordinate[d] = (addCoordinate[d] + 1) % size;
			var subCoordinate = deepcopy(coordinates[i]);
			subCoordinate[d] = (subCoordinate[d] - 1 + size) % size;
			vector.push(getFieldValueByCoordinate(scalarField, addCoordinate) - getFieldValueByCoordinate(scalarField, subCoordinate));
		}
		if (diagonalCalculation) // Only 1st order diagonals!
		{
			for (var d1 = 0; d1 < dimension - 1; d1++)
			{
				for (var d2 = d1 + 1; d2 < dimension; d2++)
				{
					var coordinate1 = deepcopy(coordinates[i]);
					coordinate1[d1] = (coordinate1[d1] + 1) % size;
					coordinate1[d2] = (coordinate1[d2] + 1) % size;
					var value1 = getFieldValueByCoordinate(scalarField, coordinate1);
					
					var coordinate2 = deepcopy(coordinates[i]);
					coordinate2[d1] = (coordinate2[d1] - 1 + size) % size;
					coordinate2[d2] = (coordinate2[d2] - 1 + size) % size;
					var value2 = getFieldValueByCoordinate(scalarField, coordinate2);
					
					var coordinate3 = deepcopy(coordinates[i]);
					coordinate3[d1] = (coordinate3[d1] + 1) % size;
					coordinate3[d2] = (coordinate3[d2] - 1 + size) % size;
					var value3 = getFieldValueByCoordinate(scalarField, coordinate3);
					
					var coordinate4 = deepcopy(coordinates[i]);
					coordinate4[d1] = (coordinate4[d1] - 1 + size) % size;
					coordinate4[d2] = (coordinate4[d2] + 1) % size;
					var value4 = getFieldValueByCoordinate(scalarField, coordinate4);
					
					vector[d1] += diagonalScale * (value1 - value2 + value3 - value4);
					vector[d2] += diagonalScale * (value1 - value2 - value3 + value4);
				}
			}
		}
		setFieldValueByCoordinate(vectorField, coordinates[i], vector);
	}
	return vectorField;
}

// Same as the unshifted version???
function getShiftedGrad(scalarField, dimension, size)
{
	dimension = (dimension || getDimensionOfField(scalarField));
	size = (size || scalarField.length);
	var vectorField = getVectorField(dimension, size);
	var coordinates = getAllCoordinatesInHypercube(dimension, size);
	for (var i = 0; i < coordinates.length; i++)
	{
		var vector = [];
		for (var d = 0; d < dimension; d++)
		{
			var addCoordinate = deepcopy(coordinates[i]);
			addCoordinate[d] = (addCoordinate[d] + 1) % size;
			var subCoordinate = deepcopy(coordinates[i]);
			subCoordinate[d] = (subCoordinate[d] - 1 + size) % size;
			vector.push(getFieldValueByCoordinate(scalarField, addCoordinate) - getFieldValueByCoordinate(scalarField, subCoordinate));
		}
		setFieldValueByCoordinate(vectorField, coordinates[i], vector);
	}
	return vectorField;
}

// Same problems like in getGrad so all dimensions wrapped and the actual coordinates value ignored
function getDiv(vectorField, dimension, size)
{
	dimension = (dimension || getDimensionOfField(vectorField));
	size = (size || vectorField.length);
	var scalarField = getVectorField(dimension, size);
	var coordinates = getAllCoordinatesInHypercube(dimension, size);
	for (var i = 0; i < coordinates.length; i++)
	{
		var actualCoordinate = coordinates[i];
		var value = 0;
		for (var d = 0; d < dimension; d++)
		{
			var addCoordinate = deepcopy(actualCoordinate);
			addCoordinate[d] = (addCoordinate[d] - 1 + size) % size;
			var addVector = getFieldValueByCoordinate(vectorField, addCoordinate);
			value += addVector[d];
			var subCoordinate = deepcopy(actualCoordinate);
			subCoordinate[d] = (subCoordinate[d] + 1) % size;
			value -= getFieldValueByCoordinate(vectorField, subCoordinate)[d];
		}
		setFieldValueByCoordinate(scalarField, actualCoordinate, value);
	}
	return scalarField;
}



////////////////////////////////
//
//  Faster 2D discrete vector analysis
//
////////////////////////////////


/*
getGrad2d

Takes a scalar field and return it's gradient (a vector field).

Armuments:
	scalarField:	An array of x arrays of y floats (usually a hightmap with x = y = getMapSize() + 1).
	wrap:			Bulean value. Default is false. If the right of the scalar field should be wrapped to the left and the top to the bottom.
Returns an array of x arrays of y associative arrays with "x" and "y" as keys (a vector field).
	NOTE: This vector field is somehow "shifted" compared to the original scalar field. x and y are shifted +0.5 in their corresponding direction (separately!). Other operations like div shifts them back (so no need to worry).
	Unclear: Does the shift indeed link all cells or are there 2 unlinked parts distributed like black and white fields in chess?
*/
function getGrad2d(scalarField, wrap)
{
	var vectorField = [];
	for (var x = 0; x < scalarField.length; x++)
	{
		vectorField.push([]);
		for (var y = 0; y < scalarField[x].length; y++)
		{
			if (wrap)
			{
				vectorField[x].push(
					{"x": scalarField[(x + 1) % scalarField.length][y] - scalarField[x][y],
					"y": scalarField[x][(y + 1) % scalarField.length] - scalarField[x][y]}
				);
			}
			else
			{
				vectorField[x].push({"x": 0, "y": 0});
				if (x + 1 < scalarField.length)
					vectorField[x][y].x = scalarField[x + 1][y] - scalarField[x][y];
				if (y + 1 < scalarField[x].length)
					vectorField[x][y].y = scalarField[x][y + 1] - scalarField[x][y];
			}
		}
	}
	return vectorField;
}

/*
getDiv2d

Takes a vector field and return it's divergence (a scalar field).

Armuments:
	vectorField:	An array of x arrays of y associative arrays with "x" and "y" as keys.
	wrap:			Bulean value. Default is false. If the right of the scalar field should be wrapped to the left and the top to the bottom.
Returns an array of x arrays of y floats (a scalar field).
	NOTE: This scalar field is somehow "shifted" compared to the original vector field (for the reason see getGrad2d).
	NOTE: The scaling with 4 is needed to give the same values as a Div in continoous space would (Quite sure but not entirely).
		Unclear: Still this is a bit (~1.2 times) to strong causing resonance if e.g. -div(grad(hightmap)) is applied to each tile of that hightmap.
*/
function getDiv2d(vectorField, wrap)
{
	var scalarField = [];
	for (var x = 0; x < vectorField.length; x++)
	{
		scalarField.push([]);
		for (var y = 0; y < vectorField[x].length; y++)
		{
			if (wrap)
			{
				scalarField[x].push(
					(vectorField[(x - 1 + vectorField.length) % vectorField.length][y].x - vectorField[x][y].x
					+ vectorField[x][(y - 1 + vectorField[x].length) % vectorField.length].y - vectorField[x][y].y) / 4
				);
			}
			else
			{
				scalarField[x].push(- vectorField[x][y].x / 4 - vectorField[x][y].y / 4);
				if (x > 0)
					scalarField[x][y] += vectorField[x - 1][y].x / 4;
				if (y > 0)
					scalarField[x][y] += vectorField[x][y - 1].y / 4;
			}
		}
	}
	return scalarField;
}

function getFieldsMaxAbsValue2d(field, isVectorField)
{
	if (isVectorField === undefined)
		isVectorField = (typeof(field[0][0]) == "object");
	var maxValue = 0;
	for (var x = 0; x < field.length; x++)
	{
		for (var y = 0; y < field[x].length; y++)
		{
			if (isVectorField)
				var actualValue = Math.pow(field[x][y].x * field[x][y].x + field[x][y].y * field[x][y].y, 1/2);
			else
				var actualValue = abs(field[x][y]);
			if (actualValue > maxValue)
				maxValue = actualValue;
		}
	}
	return maxValue;
}

function getRescaledField2D(field, scaleToLength, isVectorField)
{
	scaleToLength = (scaleToLength || 1);
	isVectorField = (isVectorField || typeof(field[0][0]) == "object");
	var maxValue = getFieldsMaxAbsValue2d(field, isVectorField);
	var newField = deepcopy(field);
	for (var x = 0; x < field.length; x++)
	{
		for (var y = 0; y < field[x].length; y++)
		{
			if (isVectorField)
				newField[x][y] = {"x" : field[x][y].x / maxValue * scaleToLength, "y" : field[x][y].y / maxValue * scaleToLength};
			else
				newField[x][y] = field[x][y] / maxValue * scaleToLength;
		}
	}
	return newField;
}

function getSumOfFields2D(field1, field2, isVectorField1, isVectorField2)
{
	isVectorField1 = (isVectorField1 || typeof(field1[0][0]) == "object");
	isVectorField2 = (isVectorField2 || typeof(field2[0][0]) == "object");
	if (isVectorField1 != isVectorField2)
		raise("getSumOfFields2D: One field is a vectorfield while the other is a scalar field! (I don't know a definition of adding such fields)");
	if (field1.length != field2.length || field1[0].length != field2[0].length)
		warn("getSumOfFields2D: field1 and field2 are of different size! (using minimum x/y size)");
	var newField = deepcopy(field1);
	for (var x = 0; x < min(field1.length, field2.length); x++)
	{
		for (var y = 0; y < min(field1[x].length, field2[x].length); y++)
		{
			if (isVectorField1 && isVectorField2)
			{
				newField[x][y].x += field2[x][y].x;
				newField[x][y].y += field2[x][y].y;
			}
			else
				newField[x][y] += field2[x][y];
		}
	}
	return newField;
}

function getDifferenceOfFields2D(field1, field2, isVectorField1, isVectorField2)
{
	isVectorField1 = (isVectorField1 || typeof(field1[0][0]) == "object");
	isVectorField2 = (isVectorField2 || typeof(field2[0][0]) == "object");
	if (isVectorField1 != isVectorField2)
		raise("getSumOfFields2D: One field is a vectorfield while the other is a scalar field! (I don't know a definition of adding such fields)");
	if (field1.length != field2.length || field1[0].length != field2[0].length)
		warn("getSumOfFields2D: field1 and field2 are of different size! (using minimum x/y size)");
	var newField = deepcopy(field1);
	for (var x = 0; x < min(field1.length, field2.length); x++)
	{
		for (var y = 0; y < min(field1[x].length, field2[x].length); y++)
		{
			if (isVectorField1 && isVectorField2)
			{
				newField[x][y].x -= field2[x][y].x;
				newField[x][y].y -= field2[x][y].y;
			}
			else
				newField[x][y] -= field2[x][y];
		}
	}
	return newField;
}

function getProductOfFields2D(field1, field2, isVectorField1, isVectorField2)
{
	isVectorField1 = (isVectorField1 || typeof(field1[0][0]) == "object");
	isVectorField2 = (isVectorField2 || typeof(field2[0][0]) == "object");
	if (field1.length != field2.length || field1[0].length != field2[0].length)
		warn("getProductOfFields2D: field1 and field2 are of different size! (using minimum x/y)");
	var newField = [];
	for (var x = 0; x < min(field1.length, field2.length); x++)
	{
		newField.push([]);
		for (var y = 0; y < min(field1[x].length, field2[x].length); y++)
		{
			if (isVectorField1 && isVectorField2)
				newField[x].push(field1[x][y].x * field2[x][y].x + field1[x][y].y * field2[x][y].y);
			else if (isVectorField1)
			{
				if (x+1 < field2.length && y+1 < field2[x].length)
					newField[x].push({"x": field1[x][y].x * (field2[x][y] + field2[x+1][y] + field2[x][y+1] + field2[x+1][y+1])/4, "y": field1[x][y].y * (field2[x][y] + field2[x+1][y] + field2[x][y+1] + field2[x+1][y+1])/4});
				else if (x+1 < field2.length)
					newField[x].push({"x": field1[x][y].x * (field2[x][y] + field2[x+1][y])/2, "y": field1[x][y].y * (field2[x][y] + field2[x+1][y])/2});
				else if (y+1 < field2[x].length)
					newField[x].push({"x": field1[x][y].x * (field2[x][y] + field2[x][y+1])/2, "y": field1[x][y].y * (field2[x][y] + field2[x][y+1])/2});
				else
					newField[x].push({"x": field1[x][y].x * field2[x][y], "y": field1[x][y].y * field2[x][y]});
			}
			else if (isVectorField2)
			{
				if (x+1 < field1.length && y+1 < field1[x].length)
					newField[x].push({"x": (field1[x][y] + field1[x+1][y] + field1[x][y+1] + field1[x+1][y+1])/4 * field2[x][y].x, "y": (field1[x][y] + field1[x+1][y] + field1[x][y+1] + field1[x+1][y+1])/4 * field2[x][y].y});
				else if (x+1 < field1.length)
					newField[x].push({"x": (field1[x][y] + field1[x+1][y])/2 * field2[x][y].x, "y": (field1[x][y] + field1[x+1][y])/2 * field2[x][y].y});
				else if (y+1 < field1[x].length)
					newField[x].push({"x": (field1[x][y] + field1[x][y+1])/2 * field2[x][y].x, "y": (field1[x][y] + field1[x][y+1])/2 * field2[x][y].y});
				else
					newField[x].push({"x": field1[x][y] * field2[x][y].x, "y": field1[x][y] * field2[x][y].y});
			}
			else
				newField[x].push(field1[x][y] * field2[x][y]);
		}
	}
	return newField;
}


////////////////
//
//  2DTC implementation: 2 Dimensional Tile Centered with vector fields values centered on tiles and div and grad taking into account the diagonal appendednt tiles as well (four way)
//
////////////////
