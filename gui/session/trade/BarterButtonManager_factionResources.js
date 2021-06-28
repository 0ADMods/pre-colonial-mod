
function BarterButtonManager_FactionResource (panel)
{
	if (!BarterButtonManager.IsAvailable(panel))
		throw "BarterButtonManager instantiated with no barterable resources or too few buttons!";

	// The player may be the owner of the selected market
	this.viewedPlayer = -1;

	this.selectedResource = null;
	this.buttons = [];
	this.panel = panel;

	panel.onPress = this.update.bind(this);
	panel.onRelease = this.update.bind(this);
}

BarterButtonManager.prototype.setup = function()
{
	let resourceCodes = g_ResourceData.GetBarterableCodes((g_Players[this.viewedPlayer] || { "civ": null }).civ);
	this.buttons = resourceCodes.map((resourceCode, i) =>
		new BarterButton(this, resourceCode, i, this.panel));

	hideRemaining("barterResources", resourceCodes.length); // Barter/Trade Dialog
	hideRemaining('unitBarterPanel', resourceCodes.length); // Barter Panel

	if (!resourceCodes.includes(this.selectedResource))
		this.selectedResource = resourceCodes[0];

	this.update();
}

BarterButtonManager.prototype.setViewedPlayer = function(viewedPlayer)
{
	this.viewedPlayer = viewedPlayer;
	this.setup();
}

BarterButtonManager.prototype.setSelectedResource = function(resourceCode)
{
	this.selectedResource = resourceCode;
}

BarterButtonManager_FactionResource.prototype = BarterButtonManager.prototype;
BarterButtonManager_FactionResource.IsAvailable = BarterButtonManager.IsAvailable;
BarterButtonManager = BarterButtonManager_FactionResource;
