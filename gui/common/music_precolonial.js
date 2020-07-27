Music.prototype.resetTracks = function()
{
	this.tracks = {
		"MENU": ["Honor_Bound.ogg"].concat(shuffleArray([
			"An_old_Warhorse_goes_to_Pasture.ogg",
			"Calm_Before_the_Storm.ogg",
			"Juno_Protect_You.ogg"
		])),
		"PEACE": [
			"Tale_of_Warriors.ogg",
			"Tavern_in_the_Mist.ogg",
			"The_Road_Ahead.ogg"
		],
		"BATTLE": ["Taiko_1.ogg", "Taiko_2.ogg"],
		"VICTORY": ["You_are_Victorious!.ogg"],
		"DEFEAT": ["Dried_Tears.ogg"],
		"CUSTOM": []
	};
};
