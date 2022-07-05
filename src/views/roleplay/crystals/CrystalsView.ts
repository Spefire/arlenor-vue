import { ArlenorPower } from "@/models/ArlenorPower";
import { ArlenorSpeciality } from "@/models/ArlenorSpeciality";
import { ArlenorSpecialities } from "@/models/data/ListSpecialities";
import { PageTitles } from "@/models/PagesTitles";
import api from "@/utils/api";
import { defineComponent, Ref, ref } from "vue";

export default defineComponent({
  name: "CrystalsView",
  title: PageTitles.crystals,
  components: {},
  
  watch: {
    $route() {
      this.updatePage();
    },
    currentSpeciality() {
      this.updateSpecialityPowers();
    }
  },

  setup() {
    const allPowers: Ref<ArlenorPower[]> = ref([]);
    const allSpecialities = ref(ArlenorSpecialities.getListSpecialities());
    const currentSpeciality: Ref<ArlenorSpeciality | null> = ref(null);
    const specialityPowers: Ref<ArlenorPower[]> = ref([]);
    const selectedPower: Ref<ArlenorPower | null> = ref(null);
    const ranks: Ref<string[]> = ref([]);
    
    return { allPowers, allSpecialities, currentSpeciality, selectedPower, specialityPowers, ranks };
  },

  mounted() {
    this.updatePage();
    this.loadPowers();
  },

  methods: {
    // Navigation et chargements
    async loadPowers() {
      const allPowers = await api.readAllPower();
      this.allPowers = allPowers.sort((a, b) => a.name.localeCompare(b.name));
    },
    moveToSpe(code:string) {
      this.$router.push({ path: "crystals", query: { spe: code }});
    },

    updatePage() {
      if (this.$route.query.spe) {
        const targetSpeciality = ArlenorSpecialities.getListSpecialities().find(spe => spe.code === this.$route.query.spe);
        this.currentSpeciality = targetSpeciality ? targetSpeciality : null;
        if (this.currentSpeciality) this.currentSpeciality.setSkills();
        this.selectPower(null);
      } else {
        this.currentSpeciality = null;
      }
    },

    updateSpecialityPowers() {
      if (this.currentSpeciality) {
        const spe = this.currentSpeciality;
        const listGrp = spe.group.code ? this.allPowers.filter(power => power.group && power.group.code === spe.group.code && !power.speciality) : [];
        const listSpe = spe.code ? this.allPowers.filter(power => power.speciality && power.speciality.code === spe.code) : [];
        const list = listGrp.concat(listSpe);
        list.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        this.specialityPowers = list;
        this.ranks = this.specialityPowers.map(power => power.codeRank).filter((value, index, categoryArray) => categoryArray.indexOf(value) === index);
        this.ranks.sort((a, b) => a.localeCompare(b));
      } else {
        this.specialityPowers = [];
        this.ranks = [];
      }
    },
    
    // Affichages
    getPowersByRank(rank: string, isGroupPower: boolean): ArlenorPower[] {
      if (isGroupPower) {
        return this.specialityPowers.filter(power => power.codeRank === rank && !power.speciality);
      } else {
        return this.specialityPowers.filter(power => power.codeRank === rank && power.speciality);
      }
    },
    
    getDescription(description: string, length = 0) {
      if (length) return description.replace("&emsp;","").slice(0, length) + "...";
      return description.replace("&emsp;","");
    },

    getCasting(chanelingProperty: number) {
      if (!chanelingProperty) return "Pas d'incantation";
      return "" + chanelingProperty + " tours d'incantation";
    },
  
    getReloading(durationProperty: number) {
      if (!durationProperty) return "Utilisation illimitée";
      return "" + durationProperty + " utilisations par repos long";
    },

    // Actions
    selectPower(power: ArlenorPower | null) {
      this.selectedPower = power;
    },
  }
});
