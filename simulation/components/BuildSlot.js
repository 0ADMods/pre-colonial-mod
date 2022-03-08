/*
 * TODO: the vague plan is that this should keep track of who currently owns the settlement,
 * and some other code can detect this (or get notified of changes) when it needs to.
 * A civcenter's BuildRestrictions component will see that it's being built on this settlement,
 * call MoveOutOfWorld on us (so we're invisible and only the building is visible/selectable),
 * tell us that its player owns us, and move us back into our original position when the building
 * is destroyed. Don't know if that's a sensible plan, though.
 */
class BuildSlot
{
	Init()
	{
		this.occupant = INVALID_ENTITY;
	}

	/**
	 * Initialises construction, thus rendering this socket useless.
	 *
	 * @param {number} player - The player requesting the initialisation.
	 * @param {number} entity - The entity being built on/in this slot.
	 *
	 * @return {boolean} Whether the initialisation was successful.
	 */
	InitConstruction(entity)
	{
		this.occupant = entity;

		if (this.template.HideUponUse != "true")
			return true;

		let cmpPosition = Engine.QueryInterface(this.entity, IID_Position);
		if (!cmpPosition)
			return false;

		this.previousPosition = cmpPosition.GetPosition();
		cmpPosition.MoveOutOfWorld();

		return true;
	}

	/**
	 * Resets this socket by setting the occupant to 0 and moving back to its former position.
	 */
	Reset()
	{
		this.occupant = INVALID_ENTITY;

		if (!this.previousPosition)
			return;

		let cmpPosition = Engine.QueryInterface(this.entity, IID_Position);
		if (!cmpPosition)
			return;

		cmpPosition.JumpTo(this.previousPosition.x, this.previousPosition.z);
		delete this.previousPosition;
	}

	/**
	 * Get the current occupant, i.e. the building placed upon this socket.
	 *
	 * @return {number} The current occupant of this build slot.
	 */
	GetOccupant()
	{
		return this.occupant;
	}
}

BuildSlot.prototype.Schema =
	"<a:help>Specifies this is a building slot, an entity where a structure can be placed upon.</a:help>" +
	"<a:example>" +
		"<BuildSlot>" +
			"<HideUponUse>true</HideUponUse>" +
		"</BuildSlot>" +
	"</a:example>" +
	"<element name='HideUponUse' a:help='Whether the slot will be hidden when construction initiates.'>" +
		"<data type='boolean'/>" +
	"</element>";

BuildSlot.prototype.OnGlobalEntityRenamed = function(msg)
{
	if (msg.entity != this.occupant)
		return;

	// Our occupant died, reset our state.
	if (msg.newentity == INVALID_ENTITY)
		this.Reset();
	else
		this.occupant = msg.newentity;
};

BuildSlot.prototype.OnGlobalOwnershipChanged = function(msg)
{
	if (msg.entity != this.occupant)
		return;

	// Our occupant died, reset our state.
	if (msg.to == INVALID_PLAYER)
		this.Reset();
};

Engine.RegisterComponentType(IID_BuildSlot, "BuildSlot", BuildSlot);