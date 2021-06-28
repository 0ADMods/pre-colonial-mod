function BarterButton_FactionResource (barterButtonManager, resourceCode, i, panel)
{
	this.barterButtonManager = barterButtonManager;
	this.resourceCode = resourceCode;
	this.amountToSell = 0;

	this.sellButton = panel.children[i].children[0].children[0];
	this.sellIcon = this.sellButton.children[0];
	this.sellAmount = this.sellButton.children[1];
	this.sellSelection = this.sellButton.children[2];

	this.buyButton = panel.children[i].children[0].children[1];
	this.buyIcon= this.buyButton.children[0];
	this.buyAmount = this.buyButton.children[1];

	let resourceName = { "resource": resourceNameWithinSentence(resourceCode) };

	this.sellButton.tooltip = sprintf(this.SellTooltip, resourceName);
	this.sellButton.onPress = () => { barterButtonManager.setSelectedResource(this.resourceCode); };
	this.sellButton.hidden = false;

	this.buyButton.tooltip = sprintf(this.BuyTooltip, resourceName);
	this.buyButton.onPress = () => { this.buy(); };

	this.iconPath = this.ResourceIconPath + resourceCode + ".png";

	panel.children[i].hidden = false;
	setPanelObjectPosition(panel.children[i], i, Infinity);
}

BarterButton.prototype.update = function(viewedPlayer)
{
	this.amountToSell = this.BarterResourceSellQuantity;

	if (Engine.HotkeyIsPressed("session.massbarter"))
		this.amountToSell *= this.Multiplier;

	let neededResourcesSell = Engine.GuiInterfaceCall("GetNeededResources", {
		"cost": {
			[this.resourceCode]: this.amountToSell
		},
		"player": viewedPlayer
	});

	let neededResourcesBuy = Engine.GuiInterfaceCall("GetNeededResources", {
		"cost": {
			[this.barterButtonManager.selectedResource]: this.amountToSell
		},
		"player": viewedPlayer
	});

	let isSelected = this.resourceCode == this.barterButtonManager.selectedResource;
	let icon = "stretched:" +  (isSelected ? this.SelectedModifier : "") + this.iconPath;
	this.sellIcon.sprite = (neededResourcesSell ? this.DisabledModifier : "") + icon;
	this.buyIcon.sprite = (neededResourcesBuy ? this.DisabledModifier : "") + icon;

	this.sellAmount.caption = sprintf(translateWithContext("sell action", this.SellCaption), {
		"amount": this.amountToSell
	});

	let prices = GetSimState().players[viewedPlayer].barterPrices;

	this.buyAmount.caption = sprintf(translateWithContext("buy action", this.BuyCaption), {
		"amount": Math.round(
			prices.sell[this.barterButtonManager.selectedResource] /
			prices.buy[this.resourceCode] * this.amountToSell)
	});

	this.buyButton.hidden = isSelected;
	this.buyButton.enabled = controlsPlayer(viewedPlayer) && g_ResourceData.CanUse(g_Players[viewedPlayer].civ, this.resourceCode);
	this.sellSelection.hidden = !isSelected;
}

BarterButton_FactionResource.prototype = BarterButton.prototype;
BarterButton_FactionResource.getWidth = BarterButton.getWidth;
BarterButton = BarterButton_FactionResource;
