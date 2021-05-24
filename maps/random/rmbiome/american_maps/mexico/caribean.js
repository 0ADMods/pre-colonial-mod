function setupBiome_caribean()
{
	[g_Gaia.tree1, g_Gaia.tree2] = pickRandom([
		[
			"gaia/tree/date_palm",
			"gaia/tree/palm_tropical"
		],
		[
			"gaia/tree/palm_areca",
			"gaia/tree/date_palm"
		],
		[
			"gaia/tree/palm_areca",
			"gaia/tree/palm_tropic"
		]]);

	g_Gaia.tree3 = pickRandom([
		"gaia/flora_cactus_nopal",
		"gaia/fruit/berry_05"
	]);

	[g_Gaia.tree4, g_Gaia.tree5] = new Array(2).fill(pickRandom([
		"gaia/tree/banyan",
		"gaia/tree/bush_tropic"
	]));

	g_Gaia.fruitBush = pickRandom([
		"gaia/fruit/berry_05",
		"gaia/fruit/date"
	]);
}
