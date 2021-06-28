
function TributeButton_FactionResource(playerID, resCode, resIndex)
{
	this.playerID = playerID;
	this.resCode = resCode;
	this.amount = undefined;
	this.canUse = g_ResourceData.CanUse(g_Players[playerID].civ, resCode);

	let name = "diplomacyPlayer[" + (playerID - 1) + "]_tribute[" + resIndex + "]";

	this.button = Engine.GetGUIObjectByName(name);
	if (this.canUse)
		this.button.onPress = this.onPress.bind(this);
	setPanelObjectPosition(this.button, resIndex, resIndex + 1, 0);

	Engine.GetGUIObjectByName(name + "_hotkey").onRelease = this.onMassTributeRelease.bind(this);
	Engine.GetGUIObjectByName(name + "_image").sprite = "stretched:" + this.ResourceIconPath + resCode + ".png";

	this.setAmount(this.DefaultAmount);
}

DiplomacyDialogPlayerControl.prototype.TributeButtonManager.prototype.TributeButton.prototype.update = function(playerInactive)
{
	this.button.hidden = playerInactive || !this.canUse || !g_ResourceData.CanUse(g_Players[g_ViewedPlayer].civ, this.resCode);

	if (!this.button.hidden)
		this.button.enabled = controlsPlayer(g_ViewedPlayer);
}

TributeButton_FactionResource.prototype = DiplomacyDialogPlayerControl.prototype.TributeButtonManager.prototype.TributeButton.prototype;
DiplomacyDialogPlayerControl.prototype.TributeButtonManager.prototype.TributeButton = TributeButton_FactionResource;
