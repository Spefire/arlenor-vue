import { ArlenorGroup, ArlenorGroups } from "./ArlenorGroup";

export class ArlenorClass {
  public name: string;
  public image: string;
  public description: string;
  public group: ArlenorGroup;

  get code(): string {
    let code = this.name;
    code = code.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    code = code.replace(/\s/g, "");
    return code.toUpperCase();
  }

  constructor(name: string, group: ArlenorGroup) {
    this.name = name;
    this.image = require("./../assets/icons/class.png");
    this.description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam pulvinar justo a facilisis aliquet. In justo libero, tempor a ipsum id, pellentesque semper est. Nam elit ex, pulvinar eu libero nec, sagittis fringilla lorem. Curabitur consequat nulla elit, nec tincidunt risus rhoncus vitae. In hac habitasse platea dictumst.";
    this.group = group;
  }
}

export class ArlenorClasses {
  public Paladin: ArlenorClass;
  public Chevalier: ArlenorClass;
  public DanseurMartial: ArlenorClass;
  public Derviche: ArlenorClass;

  public LameOmbre: ArlenorClass;
  public Chasseur: ArlenorClass;
  public DanseurSabre: ArlenorClass;
  public DoubleLame: ArlenorClass;
  public Escrimeur: ArlenorClass;

  public Elementaliste: ArlenorClass;
  public Createur: ArlenorClass;
  public Pelerin: ArlenorClass;
  public Dompteur: ArlenorClass;
  public Illusionniste: ArlenorClass;
  public Envouteur: ArlenorClass;

  public Chaman: ArlenorClass;
  public Guerisseur: ArlenorClass;
  public ClercArmure: ArlenorClass;
  public PretreArlenor: ArlenorClass;
  public Exorciste: ArlenorClass;
  public Virtuose: ArlenorClass;
  public Banshee: ArlenorClass;

  constructor() {
    const groups = new ArlenorGroups();

    this.Paladin = new ArlenorClass("Paladin", groups.Gardien);
    this.Chevalier = new ArlenorClass("Chevalier", groups.Gardien);
    this.DanseurMartial = new ArlenorClass("Danseur Martial", groups.Moine);
    this.Derviche = new ArlenorClass("Derviche", groups.Moine);

    this.LameOmbre = new ArlenorClass("Lame de l'Ombre", groups.Assassin);
    this.Chasseur = new ArlenorClass("Chasseur", groups.Assassin);
    this.DanseurSabre = new ArlenorClass("Danseur au Sabre", groups.Assassin);
    this.DoubleLame = new ArlenorClass("Double Lame", groups.Bretteur);
    this.Escrimeur = new ArlenorClass("Escrimeur", groups.Bretteur);

    this.Elementaliste = new ArlenorClass("Elémentaliste", groups.Sorcier);
    this.Createur = new ArlenorClass("Créateur", groups.Sorcier);
    this.Pelerin = new ArlenorClass("Pèlerin", groups.Invocateur);
    this.Dompteur = new ArlenorClass("Dompteur de bêtes", groups.Invocateur);
    this.Illusionniste = new ArlenorClass("Illusionniste", groups.Enchanteur);
    this.Envouteur = new ArlenorClass("Envoûteur", groups.Enchanteur);

    this.Chaman = new ArlenorClass("Chaman", groups.Druide);
    this.Guerisseur = new ArlenorClass("Guérisseur", groups.Druide);
    this.ClercArmure = new ArlenorClass("Clerc d'armure", groups.Pretre);
    this.PretreArlenor = new ArlenorClass("Prêtre d'Arlénor", groups.Pretre);
    this.Exorciste = new ArlenorClass("Exorciste", groups.Pretre);
    this.Virtuose = new ArlenorClass("Virtuose", groups.Barde);
    this.Banshee = new ArlenorClass("Banshee", groups.Barde);
  }
}

export function getListClasses(): ArlenorClass[] {
  const arlenorClasses = new ArlenorClasses();
  return Object.values(arlenorClasses);
}
