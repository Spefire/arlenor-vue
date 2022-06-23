import { ArlenorCharacter } from "@/models/ArlenorCharacter";
import { ArlenorRace, DifficultyEnum } from "@/models/ArlenorRace";
import { getListRaces } from "@/models/data/ListRaces";
import { getListRaceSkills } from "@/models/data/ListSkills";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "RaceForm",
  components: {},
  emits: ["changeStep", "nextStep"],
  
  data() {
    const store = useStore();
    const allRaces = getListRaces().filter(race => race.difficulty !== DifficultyEnum.Impossible.Code);
    const allSkills = getListRaceSkills();
    return {
      store,
      allRaces,
      allSkills,
      form: {
        raceCode: store.state.character.race?.code || allRaces[0].code,
      },
      isModified: false,
    };
  },

  setup () {
    return { v$: useVuelidate() };
  },
  
  validations: {
    form: {
      raceCode: {
        required
      },
    },
  },

  computed: {
    currentRace(): ArlenorRace | null {
      if (this.form.raceCode) {
        const race = this.allRaces.find(race => race.code === this.form.raceCode);
        return race ? race : null;
      }
      else return null;
    },
  },

  methods: {
    getSkills(raceCode: string) {
      return this.allSkills.filter(skill => skill.race && skill.race.code === raceCode);
    },
    updateForm() {
      this.isModified = true;
      this.$emit("changeStep");
    },
    submitForm() {
      this.save();
      this.isModified = false;
      this.$emit("nextStep");
    },
    save() {
      const newCharacter = new ArlenorCharacter();
      const race = this.allRaces.find(race => race.code === this.form.raceCode);
      newCharacter.race = race ? race : this.allRaces[0];
      this.store.commit("changeCharacterRace", newCharacter);
    }
  }
});
