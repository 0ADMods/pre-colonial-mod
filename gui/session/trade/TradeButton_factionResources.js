
function TradeButton_FactionResource(tradeButtonManager, resourceCode, i)
{
	this.tradeButtonManager = tradeButtonManager;
	this.resourceCode = resourceCode;

	let id = "[" + i + "]";

	this.tradeArrowUp = Engine.GetGUIObjectByName("tradeArrowUp" + id);
	this.tradeArrowDn = Engine.GetGUIObjectByName("tradeArrowDn" + id);
	this.tradeResource = Engine.GetGUIObjectByName("tradeResource" + id);
	this.tradeResourceText = Engine.GetGUIObjectByName("tradeResourceText" + id);
	this.tradeResourceButton = Engine.GetGUIObjectByName("tradeResourceButton" + id);
	this.tradeResourceSelection = Engine.GetGUIObjectByName("tradeResourceSelection" + id);

	Engine.GetGUIObjectByName("tradeResourceIcon" + id).sprite =
		"stretched:" + this.ResourceIconPath + resourceCode + ".png";

	this.tradeResource.hidden = false;

	this.tradeResourceButton.onPress = () => { tradeButtonManager.selectResource(resourceCode); };

	this.tradeArrowUp.onPress = () => {
		tradeButtonManager.changeResourceAmount(resourceCode, +Math.min(this.AmountStep, tradeButtonManager.tradingGoods[tradeButtonManager.selectedResource]));
	};

	this.tradeArrowDn.onPress = () => {
		tradeButtonManager.changeResourceAmount(resourceCode, -Math.min(this.AmountStep, tradeButtonManager.tradingGoods[resourceCode]));
	};

	setPanelObjectPosition(this.tradeResource, i, i + 1);
}

TradeButton_FactionResource.prototype = TradeButton.prototype;
TradeButton_FactionResource.getWidth = TradeButton.getWidth;
TradeButton = TradeButton_FactionResource;
