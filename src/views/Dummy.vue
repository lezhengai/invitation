<template>
  <v-app>
    <v-app-bar
      app
      light
      elevation="10"
      :flat="true"
    >
      <div class="d-flex align-center toolbar-left">
      </div>

      <v-spacer></v-spacer>
      <div class="d-flex align-center">
        <AveineButtonLanguage :expandedButton="true"/>
      </div>
    </v-app-bar>
    <v-main>    
      <v-container class="dummy">
        <v-col v-if="dataLoaded">
          <v-col>
            <h1>Details</h1>
            <AveineInvoiceManagement :invoices="invoices" :adminMode="true"/>
          </v-col>
        </v-col>
        <v-progress-circular
          v-else
          class="d-flex justify-center"
          style="position: fixed; top: 30%; left: 50%; z-index: 10"
          indeterminate
          :size="100"
          :width="10"
          color="secondary"
        ></v-progress-circular>
      </v-container>
    </v-main>
  </v-app>

</template>

<script>
import { AveineButtonLanguage } from 'aveine-toolbox'
import { Invoice } from 'aveine-toolbox';
import AveineInvoiceManagement from '../components/AveineInvoiceManagement.vue';
export default {
  name: 'Dummy',
  components: {
    AveineButtonLanguage,
    AveineInvoiceManagement
  },
  data () {
    return {
      /**
       * Storing the invoice ressource to work on
       * 
       * @type {Object}
       */
      invoices: [],
      /**
       * Flag to determine when all of the backend data has been loaded
       * 
       * @type {Boolean}
       */
      dataLoaded: false
    }
  },
  async created() {
    let invoices = await Invoice.api().get(`invoices`, {
        params: {
					include: 'ambassador.user'
        }
      }
    );
    const that = this;
    invoices.response.data.map(async function(data){
      that.invoices.push(await Invoice.query().whereId(data.id).withAllRecursive().first());
    })

    this.dataLoaded = true;
  }
}
</script>
<style lang="scss">
  @import "aveine-toolbox/src/assets/style/aveine-colors";
  @import "aveine-toolbox/src/assets/style/aveine-style";
  @import "aveine-toolbox/src/assets/style/aveine-font";
  @import "aveine-toolbox/dist/aveine-toolbox";

</style>