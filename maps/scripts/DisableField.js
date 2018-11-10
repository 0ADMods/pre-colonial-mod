Trigger.prototype.DisableField = function()
{
    let cmpRangeManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_RangeManager);
    let fields = cmpRangeManager.GetEntitiesByPlayer(this.playerID).filter(e => Engine.QueryInterface(e, IID_Identity).HasClass("Field"));
    let keep = 6;
    for (let ent of fields)
    {
        let cmpHealth = Engine.QueryInterface(ent, IID_Health);
        if (!cmpHealth)
            Engine.DestroyEntity(ent);
        else if(--keep < 0)
            cmpHealth.Kill();
    }
};

{
    let cmpTrigger = Engine.QueryInterface(SYSTEM_ENTITY, IID_Trigger);
    cmpTrigger.playerID = 1;
    cmpTrigger.RegisterTrigger("OnInitGame", "DisableField", { "enabled": true });
}