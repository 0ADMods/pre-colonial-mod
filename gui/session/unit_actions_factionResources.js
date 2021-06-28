g_UnitActions.gather.getActionInfo = function(entState, targetState)
{
	if (!entState.resourceGatherRates ||
		!targetState || !targetState.resourceSupply)
		return false;

	let supply = targetState.resourceSupply;
	if (!g_ResourceData.CanUse(
			g_Players[entState.player].civ,
			supply.type.generic == "treasure" ? supply.type.specific : supply.type.generic
		))
		return false;

	let resource;
	if (entState.resourceGatherRates[targetState.resourceSupply.type.generic + "." + targetState.resourceSupply.type.specific])
		resource = targetState.resourceSupply.type.specific;
	else if (entState.resourceGatherRates[targetState.resourceSupply.type.generic])
		resource = targetState.resourceSupply.type.generic;
	if (!resource)
		return false;

	return {
		"possible": true,
		"cursor": "action-gather-" + resource
	};
}
