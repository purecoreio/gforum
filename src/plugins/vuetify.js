import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: '#1de9b6',
                secondary: '#69f0ae',
                accent: '#6effe8',
                error: '#9fffe0'
            },
            light: {
                primary: '#1de9b6',
                secondary: '#69f0ae',
                accent: '#6effe8',
                error: '#9fffe0'
            }
        }
    },
});
