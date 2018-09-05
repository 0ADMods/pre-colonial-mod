{
    let cmpTrigger = Engine.QueryInterface(SYSTEM_ENTITY, IID_Trigger);
    cmpTrigger.ConquestAddVictoryCondition({
        "classFilter": "Colony",
        "defeatReason": markForTranslation("%(player)s has been defeated (lost all Villagers).")
    });
}