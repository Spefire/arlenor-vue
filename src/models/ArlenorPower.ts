import { ArlenorEnum, getEnumByCode } from "./ArlenorEnum";
import { ArlenorGroup } from "./ArlenorGroup";
import { ArlenorSpeciality } from "./ArlenorSpeciality";
import { ArlenorGroups } from "./data/ListGroups";
import { ArlenorSpecialities } from "./data/ListSpecialities";

export class ArlenorPower {
  public id = "";
  public hour = "00:00";
  public date = "01/01/1990";

  public isVerified: boolean;

  public name: string;
  public description: string;
  public codeType: string;
  public codeGroup: string;
  public codeSpeciality: string | null;

  public level: number;
  public codeRange: string;
  public codeDuration: string;
  public chaneling: boolean;
  public codeTargets: string;
    
  get code(): string {
    let code = this.name;
    code = code.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    code = code.replace(/\s/g, "");
    return code.toUpperCase();
  }

  get image(): string | null {
    if (this.codeSpeciality) {
      if (this.isVerified) return require("./../assets/icons/powers/power_spe_ok.png");
      else return require("./../assets/icons/powers/power_spe.png");
    }
    else if (this.codeGroup) {
      if (this.isVerified) return require("./../assets/icons/powers/power_grp_ok.png");
      else return require("./../assets/icons/powers/power_grp.png");
    }
    else return null;
  }

  get type(): ArlenorEnum {
    return getEnumByCode(this.codeType, PowerTypesEnum);
  }

  get group(): ArlenorGroup {
    return ArlenorGroups.getGroup(this.codeGroup);
  }

  get speciality(): ArlenorSpeciality | null {
    if (!this.codeSpeciality) return null;
    return ArlenorSpecialities.getSpeciality(this.codeSpeciality);
  }

  get range(): ArlenorEnum {
    return getEnumByCode(this.codeRange, PowerRangesEnum);
  }
  
  get duration(): ArlenorEnum {
    return getEnumByCode(this.codeType, PowerDurationsEnum);
  }
  
  get targets(): ArlenorEnum {
    return getEnumByCode(this.codeTargets, PowerTargetsEnum);
  }

  constructor() {
    const groups = new ArlenorGroups();

    this.isVerified = false;

    this.name = "";
    this.description = "";
    this.codeType = PowerTypesEnum.AnatomieSurhumaine.Code;
    this.codeGroup = groups.Assassin.code;
    this.codeSpeciality = null;

    this.level = 0;
    this.codeRange = PowerRangesEnum.Personnelle.Code;
    this.codeDuration = PowerDurationsEnum.Instantanee.Code;
    this.chaneling = false;
    this.codeTargets = PowerTargetsEnum.Aucune.Code;
  }

  public initByJSON(value: string): void {
    const powerDB = JSON.parse(value);
    this.date = powerDB.date;
    this.hour = powerDB.hour;
    this.isVerified = powerDB.isVerified ? true : false;

    this.name = powerDB.name;
    this.description = powerDB.description;
    this.codeType = powerDB.codeType;
    this.codeGroup = powerDB.codeGroup;
    this.codeSpeciality = powerDB.codeSpeciality ? powerDB.codeSpeciality : null;

    if (powerDB.level) this.level = parseInt(powerDB.level);
    this.codeRange = powerDB.codeRange;
    this.codeDuration = powerDB.codeDuration;
    this.chaneling = powerDB.chaneling ? true : false;
    this.codeTargets = powerDB.codeTargets;
  }

  public initTime(): void {
    function pad(s: number) { return (s < 10) ? "0" + s : s; }
    const date = new Date();
    const hours = (date.getHours() < 10 ? "0" : "") + date.getHours();
    const minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    this.hour = hours + ":" + minutes;
    this.date = [pad(date.getDate()), pad(date.getMonth()+1), date.getFullYear()].join("/");
  }
}

export class PowerTypesEnum {
  static AnatomieSurhumaine: ArlenorEnum = { Code: "ANATOMIE", Libelle: "Anatomie surhumaine" };
  static ArmeNaturelle: ArlenorEnum = { Code: "ARME_NAT", Libelle: "Arme naturelle" };
  static ArmureNaturelle: ArlenorEnum = { Code: "ARMURE_NAT", Libelle: "Armure naturelle" };
  static Chimerisme: ArlenorEnum = { Code: "CHIMERISME", Libelle: "Chimérisme" };
  static CoupSpecial: ArlenorEnum = { Code: "COUP_SPE", Libelle: "Coup spécial" };
  static DeplacementSpacial: ArlenorEnum = { Code: "DEP_SPATIAL", Libelle: "Déplacement spacial" };
  static Immunite: ArlenorEnum = { Code: "IMMUNITE", Libelle: "Immunité" };
  static ManipulationTemps: ArlenorEnum = { Code: "MANIP_TEMPS", Libelle: "Manipulation temporelle" };
  static Metamorphose: ArlenorEnum = { Code: "METAMORPHOSE", Libelle: "Métamorphose" };
  static PerceptionSpecial: ArlenorEnum = { Code: "PERCEPTION", Libelle: "Perception spéciale" };
  static PouvoirMental: ArlenorEnum = { Code: "POUV_MENTAL", Libelle: "Pouvoir mental" };
  static PouvoirSoin: ArlenorEnum = { Code: "POUV_SOIN", Libelle: "Pouvoir de soin" };
  static RayonAttaque: ArlenorEnum = { Code: "RAYON_ATK", Libelle: "Rayonnement d'attaque" };
  static RayonProtection: ArlenorEnum = { Code: "RAYON_DEF", Libelle: "Rayonnement de protection" };
  static RayonSpecial: ArlenorEnum = { Code: "RAYON_SPE", Libelle: "Rayonnement spécial" };
  static Spiritisme: ArlenorEnum = { Code: "SPIRITISME", Libelle: "Spiritisme" };
  static Transmutation: ArlenorEnum = { Code: "TRANSMUTATION", Libelle: "Transmutation" };
}

export class PowerRangesEnum {
  static Personnelle: ArlenorEnum = { Code: "0", Libelle: "Personnelle" };
  static Toucher: ArlenorEnum = { Code: "1", Libelle: "Toucher" };
  static Vue: ArlenorEnum = { Code: "2", Libelle: "A vue" };
  static Infinie: ArlenorEnum = { Code: "3", Libelle: "Infinie" };
}

export class PowerDurationsEnum {
  static Instantanee: ArlenorEnum = { Code: "0", Libelle: "Instantanée" };
  static Scene: ArlenorEnum = { Code: "1", Libelle: "Scène" };
  static Journee: ArlenorEnum = { Code: "2", Libelle: "Journée" };
  static Illimitee: ArlenorEnum = { Code: "3", Libelle: "Illimitée" };
}

export class PowerTargetsEnum {
  static Aucune: ArlenorEnum = { Code: "0", Libelle: "Aucune" };
  static Unique: ArlenorEnum = { Code: "1", Libelle: "Unique" };
  static Foule: ArlenorEnum = { Code: "2", Libelle: "Foule choisie" };
  static Monde: ArlenorEnum = { Code: "3", Libelle: "Tout le monde" };
}
