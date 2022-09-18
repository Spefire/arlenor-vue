import { CaractDescriptionEnum, CaractNomEnum } from "@/models/ArlenorCaracts";
import { ArlenorCharacter } from "@/models/ArlenorCharacter";
import { getListRaces } from "@/models/data/ListRaces";
import useVuelidate from "@vuelidate/core";
import { between, sameAs } from "@vuelidate/validators";
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "CaractsForm",
  components: {},
  emits: ["changeStep", "previousStep", "nextStep"],
    
  data() {
    const store = useStore();
    const caractDescriptionEnum = CaractDescriptionEnum;
    const selectCaract = CaractNomEnum.Force.Code;
    const allRaces = ref(getListRaces());
    const level = store.state.character.level;
    const race = store.state.character.race;
    const totalCaracts = store.state.character.totalCaracts || 5;
    return {
      caractDescriptionEnum,
      store,
      selectCaract,
      allRaces,
      level,
      race,
      form: {
        for: store.state.character.caracts.for || 1,
        hab: store.state.character.caracts.hab || 1,
        int: store.state.character.caracts.int || 1,
        ten: store.state.character.caracts.ten || 1,
        cha: store.state.character.caracts.cha || 1,
        mag: store.state.character.caracts.mag || 1,
        pointsLeft: (level.maxCaracts - totalCaracts),
      },
      isModified: false,
      needConfirm: false,
    };
  },

  setup () {
    return { v$: useVuelidate() };
  },
  
  validations: {
    form: {
      for: {
        between: between(1, 5),
      },
      hab: {
        between: between(1, 5),
      },
      int: {
        between: between(1, 5),
      },
      ten: {
        between: between(1, 5),
      },
      cha: {
        between: between(1, 5),
      },
      mag: {
        between: between(1, 5),
      },
      pointsLeft: {
        sameAs: sameAs(0)
      }
    },
  },

  methods: {
    changeCaract(caract: string) {
      this.selectCaract = caract;
      const totalCaracts = parseInt(this.form.for)
      + parseInt(this.form.hab)
      + parseInt(this.form.int)
      + parseInt(this.form.ten)
      + parseInt(this.form.cha)
      + parseInt(this.form.mag);
      this.form.pointsLeft = (this.level.maxCaracts - totalCaracts);
      this.updateForm();
    },
    getInitiative() {
      return parseInt(this.form.hab) + parseInt(this.form.int);
    },
    getPointsDeVie() {
      let points = this.level.maxHealth;
      if (this.race.code === this.allRaces[1].code) points++;
      if (this.race.code === this.allRaces[4].code) points++;
      if (parseInt(this.form.ten) <= 1) points--;
      if (parseInt(this.form.ten) >= 5) points++;
      return points;
    },
    updateForm() {
      this.isModified = true;
      this.needConfirm = false,
      this.$emit("changeStep");
    },
    cancelForm() {
      if (this.isModified && !this.needConfirm) {
        this.needConfirm = true;
      } else {
        this.isModified = false;
        this.$emit("previousStep");
      }
    },
    submitForm() {
      this.save();
      this.isModified = false;
      this.$emit("nextStep");
    },
    save() {
      const newCharacter = new ArlenorCharacter();
      newCharacter.caracts.for = parseInt(this.form.for);
      newCharacter.caracts.hab = parseInt(this.form.hab);
      newCharacter.caracts.int = parseInt(this.form.int);
      newCharacter.caracts.ten = parseInt(this.form.ten);
      newCharacter.caracts.cha = parseInt(this.form.cha);
      newCharacter.caracts.mag = parseInt(this.form.mag);
      this.store.commit("changeCharacterCaracts", newCharacter);
    }
  }
});
