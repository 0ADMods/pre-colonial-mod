g_SelectionPanels.Barter.getItems = function(unitEntStates)
{
	let civ = (g_Players[g_ViewedPlayer] || { "civ": null }).civ;
	// If more than `rowLength` resources, don't display icons.
	if (unitEntStates.every(state => !state.isBarterMarket) || g_ResourceData.GetBarterableCodes(civ).length > this.rowLength)
		return [];
	return g_ResourceData.GetBarterableCodes(civ);
};

g_SelectionPanels.Barter.setupButton = function(data)
{
	if (g_SelectionPanelBarterButtonManager)
		g_SelectionPanelBarterButtonManager.setViewedPlayer(data.player);
	return true;
}

// Hiding of barter buttons is controlled by BarterButtonManager
//
// This method exists only to prevent an error being raised that a
// gui element with a name following the pattern `unitBarterButton[n]`
// cannot be found
g_SelectionPanels.Barter.hideItem = function(i, rowLength) {};
