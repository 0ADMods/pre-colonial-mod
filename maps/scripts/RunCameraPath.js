//Script from the manual

Trigger.prototype.StartCutscene = function(data)
{
    var cmpCinemaManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_CinemaManager);

    if(!cmpCinemaManager)
       return;
    
    cmpCinemaManager.addCinemaPathToQueue("MyPath");

    cmpCinemaManager.Play();
};

var cmpTrigger = Engine.QueryInterface(SYSTEM_ENTITY, IID_Trigger);
cmpTrigger.DoAfterDeley(5000,"StartCutscene",{});