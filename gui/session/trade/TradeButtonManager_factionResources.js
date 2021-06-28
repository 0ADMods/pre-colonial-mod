function TradeButtonManager_FactionResource()
{
	if (!TradeButtonManager.IsAvailable())
		throw "TradeButtonManager instantiated with no tradeable resources or too few buttons!";

	this.tradingGoods = [];

	this.selectedResource = null;
	this.buttons = [];

	this.tradeHelp = Engine.GetGUIObjectByName("tradeHelp");
	this.tradeHelp.hidden = false;

	g_PlayerViewControl.registerViewedPlayerChangeHandler(this.setup.bind(this));
}

TradeButtonManager.prototype.setup = function()
{
	// For players assume that the simulation state will always follow the GUI of this player.
	this.tradingGoods = Engine.GuiInterfaceCall("GetTradingGoods");

	let resourceCodes = g_ResourceData.GetTradableCodes((g_Players[g_ViewedPlayer] || { "civ": null }).civ);
	this.selectedResource = resourceCodes[0];
	this.buttons = resourceCodes.map((resCode, i) => new TradeButton(this, resCode, i));

	hideRemaining("tradeResources", resourceCodes.length);
}

TradeButtonManager_FactionResource.prototype = TradeButtonManager.prototype;
TradeButtonManager_FactionResource.IsAvailable = TradeButtonManager.IsAvailable;
TradeButtonManager = TradeButtonManager_FactionResource;
