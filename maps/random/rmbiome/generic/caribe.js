function setupBiome_caribe()
{
	[g_Gaia.tree1, g_Gaia.tree2, g_Gaia.tree3, g_Gaia.tree4] = pickRandom([
		[
			"gaia/flora_tree_cretan_date_palm_short",
			"gaia/flora_tree_cretan_date_palm_short",
			"gaia/flora_tree_cretan_date_palm_tall"
		],
		[
			"gaia/flora_tree_tropic_rainforest",
			"gaia/flora_tree_tropic_rainforest",
			"gaia/flora_tree_tropic_rainforest"
		],
		[
			"gaia/flora_tree_palm_tropical",
			"gaia/flora_tree_palm_tropical",
			"gaia/flora_tree_palm_tropical"
		]]);

	g_Gaia.tree3 = pickRandom([
		"gaia/flora_tree_date_palm_fruit",
		"gaia/flora_tree_date_palm"
	]);

	[g_Gaia.tree4, g_Gaia.tree5] = new Array(5).fill(pickRandom([
		"gaia/flora_tree_palm_areca",
		"gaia/flora_tree_date_palm"
	]));

	g_Gaia.fruitBush = pickRandom([
		"gaia/flora_bush_berry",
		"gaia/flora_bush_berry_03"
	]);
}
