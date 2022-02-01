import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#1a2a4b",
        secondary: "#e4022d",
      },
// To do : Dark mode
      dark: {
        primary: "#1a2a4b",
        secondary: "#e4022d",
      },
    }
  }
});