
function CounterManager_FactionResources(playerViewControl)
{
	this.allyPlayerStates = {};

	this.counters = [];

	this.resourceCounts = Engine.GetGUIObjectByName("resourceCounts");

	this.setupCounters();

	this.init();

	registerSimulationUpdateHandler(this.rebuildOnSimUpdate.bind(this));
	playerViewControl.registerViewedPlayerChangeHandler(this.rebuildOnViewedPlayerChange.bind(this));
}

CounterManager.prototype.setupCounters = function()
{
	this.counters = [];

	if (!g_Players[g_ViewedPlayer])
		return;

	// TODO: filter resources depending on JSON file
	for (let resCode of g_ResourceData.GetCodes((g_Players[g_ViewedPlayer] || { "civ": null }).civ))
		this.addCounter(resCode, CounterResource);

	this.addCounter("population", CounterPopulation);

	hideRemaining("resourceCounts", this.counters.length);
}

CounterManager.prototype.addCounter = function(resCode, type)
{
	let panelCount = this.resourceCounts.children.length;
	if (this.counters.length + 1 > panelCount)
		throw "There are " + (this.counters.length + 1) + " resource counters to display, but only " + panelCount + " panel items!";

	let id = "resource[" + this.counters.length + "]";
	let newCounter = new type(
		resCode,
		Engine.GetGUIObjectByName(id),
		Engine.GetGUIObjectByName(id + "_icon"),
		Engine.GetGUIObjectByName(id + "_count"),
		Engine.GetGUIObjectByName(id + "_stats"));
	newCounter.icon.sprite = "stretched:session/icons/resources/" + resCode + ".png";
	newCounter.panel.onPress = this.onPress.bind(this);
	newCounter.panel.hidden = false;
	this.counters.push(newCounter);
}

CounterManager.prototype.init = function()
{
	horizontallySpaceObjects("resourceCounts", this.counters.length);
}

CounterManager.prototype.onPress = function()
{
	Engine.ConfigDB_CreateAndWriteValueToFile(
		"user",
		"gui.session.respoptooltipsort",
		String((+Engine.ConfigDB_GetValue("user", "gui.session.respoptooltipsort") + 2) % 3 - 1),
		"config/user.cfg");
	this.rebuildOnSimUpdate();
}

CounterManager.prototype.rebuildOnSimUpdate = function()
{
	if (g_ViewedPlayer <= 0)
		return;

	let viewedPlayerState = g_SimState.players[g_ViewedPlayer];
	this.allyPlayerStates = {};
	for (let player in g_SimState.players)
		if (player != 0 &&
			player != g_ViewedPlayer &&
			g_Players[player].state != "defeated" &&
			(g_IsObserver ||
				viewedPlayerState.hasSharedLos &&
				g_Players[player].isMutualAlly[g_ViewedPlayer]))
			this.allyPlayerStates[player] = g_SimState.players[player];

	this.selectedOrder = +Engine.ConfigDB_GetValue("user", "gui.session.respoptooltipsort");
	this.orderTooltip = this.getOrderTooltip();

	for (let counter of this.counters)
		if (!counter.panel.hidden)
			counter.rebuild(viewedPlayerState, this.getAllyStatTooltip.bind(this));
}

CounterManager.prototype.rebuildOnViewedPlayerChange = function()
{
	this.setupCounters();
	this.resourceCounts.hidden = g_ViewedPlayer <= 0;
	this.rebuildOnSimUpdate();
}

delete CounterManager.prototype.rebuild;

CounterManager_FactionResources.prototype = CounterManager.prototype;
CounterManager_FactionResources.ResourceTitleTags = CounterManager.ResourceTitleTags;
CounterManager = CounterManager_FactionResources;
