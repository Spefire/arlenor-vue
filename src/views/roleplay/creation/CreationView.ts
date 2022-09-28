import PopupBloc from "@/components/popup/PopupBloc.vue";
import { ArlenorCharacter } from "@/models/ArlenorCharacter";
import { ArlenorLevel } from "@/models/ArlenorLevel";
import { PageTitles } from "@/models/PagesTitles";
import api from "@/utils/api";
import downloads from "@/utils/downloads";
import random from "@/utils/random";
import useVuelidate from "@vuelidate/core";
import { between, required } from "@vuelidate/validators";
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";

import CaractsForm from "./forms/CaractsForm.vue";
import CrystalForm from "./forms/CrystalForm.vue";
import IdentityForm from "./forms/IdentityForm.vue";
import RaceForm from "./forms/RaceForm.vue";
import SkillsForm from "./forms/SkillsForm.vue";
import StuffForm from "./forms/StuffForm.vue";

export default defineComponent({
  name: "CreationView",
  title: PageTitles.creation,
  components: {
    RaceForm,
    CaractsForm,
    CrystalForm,
    SkillsForm,
    StuffForm,
    IdentityForm,
    PopupBloc,
  },

  data () {
    const store = useStore();
    return {
      store,
      form: {
        id: null,
        numLevel: 1,
      },
    };
  },

  setup() {
    const selection = ref(0);
    const hasModification = ref(false);
    const isSaved = ref(false);
    const showDeletePopup = ref(false);
    const showSavePopup = ref(false);
    return {
      v$: useVuelidate(),
      selection,
      hasModification,
      isSaved,
      showDeletePopup,
      showSavePopup
    };
  },

  mounted() {
    this.store.commit("loadAllCharacters");
    this.store.commit("loadLocalCharacters");
  },

  unmounted() {
    this.store.commit("resetCharacter");
  },

  computed: {
    character(): ArlenorCharacter {
      return this.store.state.character;
    },
    characters(): ArlenorCharacter[] {
      const allCharacters = this.store.state.allCharacters || [];
      const localCharacters = this.store.state.localCharacters || [];
      return allCharacters.concat(localCharacters);
    },
    checkDelete(): boolean {
      return false;
    }
  },

  validations: {
    form: {
      id: {},
      numLevel: {
        required,
        between: between(1, 20),
      },
    },
  },

  methods: {
    changeCharacter() {
      if (this.form.id) {
        const character = this.characters.find(charact => charact.id === this.form.id);
        if (character) this.form.numLevel = character.level.numLevel;
      } else this.form.numLevel = 1;
    },
    decreaseSelection(): void {
      if (this.selection === 5 && this.character.level.numLevel < 5) this.selection -= 2;
      else if (this.selection === 7) this.selection -= 2;
      else this.selection--;
      this.hasModification = false;
    },
    increaseSelection(): void {
      if (this.selection === 3 && this.character.level.numLevel < 5) this.selection += 2;
      else if (this.selection === 5) this.selection += 2;
      else this.selection++;
      this.hasModification = false;
    },
    changeModifs(): void {
      this.hasModification = true;
    },
    setSelection(newSelection: number): void {
      this.selection = newSelection;
    },
    startCreation(withReset: boolean): void {
      if (this.form.id) {
        const character = this.characters.find(charact => charact.id === this.form.id);
        this.store.commit("changeCharacter", character);
      } else if (withReset) {
        this.store.commit("resetCharacter");
      }
      const level = new ArlenorLevel(this.form.numLevel);
      this.store.commit("changeCharacterLevel", level);
      this.selection = 1;
      this.isSaved = false;
    },
    restartCreation(): void {
      this.store.commit("resetCharacter");
      this.selection = 0;
      this.form.id = null;
      this.form.numLevel = 1;
    },
    async downloadCharacter() {
      let allSkills = await api.readAllSkill();
      let allPowers = await api.readAllPower();
      allSkills = allSkills.sort((a, b) => a.name.localeCompare(b.name));
      allPowers = allPowers.sort((a, b) => a.name.localeCompare(b.name));
      downloads.downloadPDF(this.character, allSkills, allPowers);
    },
    openDeletePopup() {
      this.showDeletePopup = true;
    },
    closeDeletePopup(withAction: boolean) {
      this.showDeletePopup = false;
      if (withAction) {
        this.store.commit("deleteLocalCharacter",  this.form.id);
      }
    },
    openSavePopup() {
      this.showSavePopup = true;
    },
    closeSavePopup(withAction: boolean) {
      this.showSavePopup = false;
      if (withAction) {
        this.isSaved = true;
        this.character.id = random.generateID(20);
        this.store.commit("saveLocalCharacter",  this.character);
      }
    },
  },
});
