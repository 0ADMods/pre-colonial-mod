
TradeDialog.prototype.BarterPanel.prototype.update = function()
{
	let playerState = GetSimState().players[g_ViewedPlayer];
	let canBarter = playerState && playerState.canBarter;

	this.barterButtonManager.setViewedPlayer(g_ViewedPlayer);
	this.barterNoMarketsMessage.hidden = canBarter;
	this.barterResources.hidden = !canBarter;
	this.barterHelp.hidden = !canBarter;
	this.barterHelp.tooltip = sprintf(
		translate(this.InstructionsTooltip), {
			"quantity": this.BarterResourceSellQuantity,
			"hotkey": colorizeHotkey("%(hotkey)s", "session.massbarter"),
			"multiplier": this.Multiplier
		});
}
