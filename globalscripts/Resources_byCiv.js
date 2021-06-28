Resources.prototype.GetCodes = function(civ)
{
	if (!civ)
		return this.resourceCodes;

	return this.resourceData.map(res => this.CanUse(civ, res.code) && res.code).filter(x => x);
};

Resources.prototype.GetBarterableCodes = function(civ)
{
	if (!civ || !this.resourceCodesByProperty.barterable)
		return this.resourceCodesByProperty.barterable || [];

	return this.resourceCodesByProperty.barterable.filter(res => this.CanUse(civ, res));
};

Resources.prototype.GetTradableCodes = function(civ)
{
	if (!civ || !this.resourceCodesByProperty.tradable)
		return this.resourceCodesByProperty.tradable || [];

	return this.resourceCodesByProperty.tradable.filter(res => this.CanUse(civ, res));
};

Resources.prototype.GetTributableCodes = function(civ)
{
	if (!civ || !this.resourceCodesByProperty.tributable)
		return this.resourceCodesByProperty.tributable || [];

	return this.resourceCodesByProperty.tributable.filter(res => this.CanUse(civ, res));
}

Resources.prototype.CanUse = function(civ, resourceCode)
{
	if (!this.resourceCodes.includes(resourceCode))
		return false;

	let res = this.resourceDataObj[resourceCode];
	return (res.civs || []).includes(civ) || !res.civs && !(res.notcivs || []).includes(civ);
};
