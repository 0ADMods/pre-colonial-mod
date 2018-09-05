

Trigger.prototype.Mexicas = function(data)
{
	if (this.state != "start")
		return;

	var cmpGUIInterface = Engine.QueryInterface(SYSTEM_ENTITY, IID_GuiInterface);
	cmpGUIInterface.PushNotification({
		"players": [1,2],
		"message": markForTranslation("Conquer this Coast for your a new settlement for Tenochtitlan"),
		translateMessage: true
	});
};

Trigger.prototype.Tlaxcalans = function(data)
{
    if (this.state != "start")
        return;
    
    var cmpGUIInterface = Engine.QueryInterface(SYSTEM_ENTITY, IID_GuiInterface);
    cmpGUIInterface.PushNotification({
        "players":[2,3],
        "message": markForTranslation("Repel the Enemy"),
        translateMessage : false
    });
};


var cmpTrigger = Engine.QueryInterface(SYSTEM_ENTITY, IID_Trigger);

cmpTrigger.state = "start";
cmpTrigger.DoAfterDelay(2000, "Mexicas", {});
cmpTrigger.DoAfterDelay(2000, "Tlaxcalans",{});