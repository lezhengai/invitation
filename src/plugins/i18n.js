import Vue from 'vue';
import VueI18n from 'vue-i18n';
import invoiceTranslation from '../translations/invoice'

Vue.use(VueI18n);

const i18n = new VueI18n({ 
    locale: 'en',      
    messages: {"en": {"aveine-invoice": invoiceTranslation.en},
               "fr": {"aveine-invoice": invoiceTranslation.fr}
            }
});

export default i18n