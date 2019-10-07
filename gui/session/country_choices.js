//country_choices.js

//NOTE: is not used now
//How to used:
//"CivBonuses"
//}
//"CountryChoices":
//	[
//		"country/texas",
//		"country/mexico",
//      "country/centralamerica",
//      etc..
//	],
// You need a tech like this saved in simulation/data/technologies/country/country.json:
//{
//		"genericName": "Become Mexico",
//      "icon": "flag_mexican_a.png"
//
//}

const COUNTRY_CHOICE_BUTTON_WIDTH = 200;
const COUNTRY_CHOICE_BUTTON_SPACING = 25;

function initCountryChoicesDialog()
{
         if(g_ViewedPlayer < 0)
		    return;
		
		let currentPlayer = g_Players[g_ViewedPlayer];
		let contryChoices = g_CountryData[currentPlayer.country].ContryChoices;
		if (contryChoices == undefined)
		    retrun;
		
		for(let i = 0; i < countryChoices.length; ++i)
		{
		   let contryChoiceTechResearched = Engine.GuiInterfaceCall("IsTechnologyResearched",
		            "tech": countryChoices[i],
					"player": g_ViewedPlayer
			});
			if(countryChoiceTechResearched)
			    return;
		}
		
		let countryChoicesDialogPanel = Engine.GetGUIObjectByName("countryChoicesDialogPanel");
		let countryChoicesDialogPanelWidth = countryChoicesDialogPanel.size.right - countryChoicesDialogPanel.size.left;
		let buttonsLength = COUNTRY_CHOICE_BUTTON_WIDTH * countryChoices.length + COUNTRY_CHOIC_BUTTON_SPACING * (countryChoices.length - 1);
		let buttonStart = (countryChoicesDialogPanelWidth - buttonsLength) / 2;
		
		for(let i = 0; i < countryChoices.length;++i)
		{
			let countryChoiceTechData = GetTechnologyData(countryChoices[i]);
			
			let countryChoiceButton = Engine.GetGUIObjectByName("countryChoice[" + i + "]");
			countryChoiceButton.caption = countryChoiceTechData.name.generic;
			
			let size = countryChoiceButton.size;
			
			countryChoiceButton.onPress = (function(tech) { return function() {
				Engine.PostNetworkCommand({"type":"country-choice", "template": tech});
				Engine.GetGUIObjectByName("countryChoicesDialogPanel").hidden = true;
			}})(countryChoices[i]);
			
			let countryChoiceIcon = Engine.GetGUIObjectByName("countryChoiceIcon[" + i + "]");
			countryChoiceIcon.sprite = "stretched:session/portraits/" + countryChoiceTechData.icon;
			
			countryChoicesDialogPanel.hidden = false;
		}
}