
const preOcelotInit = init;
init = function(initData, hotloadData)
{
	preOcelotInit(initData, hotloadData);
	//not nide now
	//initCivChoicesDialog();

	// top_panel/label.xml
	// Remember to update pregame/mainmenu_ocelot.js in sync with this:
	// Translation: Game/Mod name as found at the top of the in-game user interface
	Engine.GetGUIObjectByName("alphaLabel").caption = sprintf(translate("%(title)s (%(version)s)"), {
		"title": translate("The Americas Ancient Empires"),
		"version": translate("ALPHA XXVI")
	});
}
