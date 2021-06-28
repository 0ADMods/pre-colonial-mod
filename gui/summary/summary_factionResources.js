var g_MaxHeadingTitle = 18;

function updateChart(number, category, item, itemNumber, type)
{
	if (!g_ScorePanelsData[category].counters[itemNumber].fn)
		return;
	let chart = Engine.GetGUIObjectByName("chart[" + number + "]");
	chart.format_y = g_ScorePanelsData[category].headings[itemNumber + 1].format || "INTEGER";
	Engine.GetGUIObjectByName("chart[" + number + "]XAxisLabel").caption = translate("Time elapsed");

	let series = [];
	if (Engine.GetGUIObjectByName("toggleTeamBox").checked)
		for (let team in g_Teams)
		{
			let data = [];
			for (let index in g_GameData.sim.playerStates[1].sequences.time)
			{
				let value = g_ScorePanelsData[category].teamCounterFn(team, index, item,
					g_ScorePanelsData[category].counters, g_ScorePanelsData[category].headings);
				if (type)
					value = value[type];
				data.push([g_GameData.sim.playerStates[1].sequences.time[index], value || 0]);
			}
			series.push(data);
		}
	else
		for (let j = 1; j <= g_PlayerCount; ++j)
		{
			let playerState = g_GameData.sim.playerStates[j];
			let data = [];
			for (let index in playerState.sequences.time)
			{
				let value = g_ScorePanelsData[category].counters[itemNumber].fn(playerState, index, item);
				if (type)
					value = value[type];
				data.push([playerState.sequences.time[index], value || 0]);
			}
			series.push(data);
		}

	chart.series = series;
}
