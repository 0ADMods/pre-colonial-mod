Engine.LoadComponentScript("interfaces/BuildSlot.js");
Engine.LoadComponentScript("BuildSlot.js");

const buildSlotId = 1;
const buildingId = 2;

let cmpBuildSlot = ConstructComponent(buildSlotId, "BuildSlot", {
	"HideUponUse": "false"
});

TS_ASSERT_UNEVAL_EQUALS(cmpBuildSlot.GetOccupant(), INVALID_ENTITY);
TS_ASSERT_UNEVAL_EQUALS(cmpBuildSlot.InitConstruction(buildingId), true);
TS_ASSERT_UNEVAL_EQUALS(cmpBuildSlot.GetOccupant(), buildingId);