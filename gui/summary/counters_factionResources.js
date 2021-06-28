function formatSummaryValue(values)
{
	if (typeof values != "object")
		return values === Infinity ? g_InfinitySymbol : values;

	if (values[Object.keys(values)[0]] === false)
		return "-";

	let ret = "";
	for (let type in values)
		if (!g_SummaryTypes[type].hideInSummary)
			ret += (g_SummaryTypes[type].color ?
				coloredText(values[type], g_SummaryTypes[type].color) :
				values[type]) + g_SummaryTypes[type].postfix;
	return ret;
}

function calculateResources(playerState, index, type)
{
	let canUse = g_ResourceData.CanUse(playerState.civ, type);
	return {
		"count": canUse && playerState.sequences.resourcesCount[type][index],
		"gathered": canUse && playerState.sequences.resourcesGathered[type][index],
		"used": canUse && playerState.sequences.resourcesUsed[type][index] - playerState.sequences.resourcesSold[type][index]
	};
}

function calculateTotalResources(playerState, index)
{
	let totalGathered = 0;
	let totalUsed = 0;
	let totalCount = 0;

	for (let type of g_ResourceData.GetCodes(playerState.civ))
	{
		totalCount += playerState.sequences.resourcesCount[type][index];
		totalGathered += playerState.sequences.resourcesGathered[type][index];
		totalUsed += playerState.sequences.resourcesUsed[type][index] - playerState.sequences.resourcesSold[type][index];
	}

	return { "count": totalCount, "gathered": totalGathered, "used": totalUsed };
}

function calculateResourceExchanged(playerState, index, type)
{
	let canUse = g_ResourceData.CanUse(playerState.civ, type);
	return {
		"bought": canUse && playerState.sequences.resourcesBought[type][index],
		"sold": canUse && playerState.sequences.resourcesSold[type][index]
	};
}
