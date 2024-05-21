import * as mathjs from "mathjs";


class Const {
    readonly SOLAR_MASS: mathjs.Unit;
    readonly SOLAR_RADIUS: mathjs.Unit;
    readonly MAS: mathjs.Unit;
    readonly ASTRONOMICAL_UNIT: mathjs.Unit;
    readonly PARSEC: mathjs.Unit;
    readonly LIGHT_YEAR: mathjs.Unit;
    readonly EPOCH_J2000 = 946684800;
    readonly DAYS_FROM_JD_TO_J2000 = 2451545;
    readonly EARTH_MASS: mathjs.Unit;
    readonly EARTH_RADIUS: mathjs.Unit;

    constructor() {
        this.SOLAR_MASS = mathjs.createUnit("solarmass", "1.989E30 kg", {override: true});
        this.SOLAR_RADIUS = mathjs.createUnit("solarradius", "696340 km", {override: true});
        this.EARTH_MASS = mathjs.createUnit("earthmass", "5.9722E24 kg", {override: true});
        this.EARTH_RADIUS = mathjs.createUnit("earthradius", "6371 km", {override: true});
        this.MAS = mathjs.createUnit("mas", "1e-3 arcsec", {override: true});
        this.ASTRONOMICAL_UNIT = mathjs.createUnit("au", "149597870700 m", {override: true});
        this.PARSEC = mathjs.createUnit("pc", mathjs.evaluate("(360*60*60/(2*pi)) au"), {override: true});
        this.LIGHT_YEAR = mathjs.createUnit("ly", "9460730472580800 m", {override: true});
    }
}

export const CONST = new Const();