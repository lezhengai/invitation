<template>
  <v-container id="aveine-invoice-list">
    <v-list flat>
      <v-list-item
          v-for="(invoice, i) in invoices"
          :key="i"
      >
        <v-list-item-content class="d-flex flex-row justify-space-between">
          <v-col cols="1">
            <v-avatar v-if="invoice.ambassador" cols="1" class="icon-container align-center justify-center" size="36px">
              <img class="ambassador-img" v-if="invoice.ambassador.image" :src="invoice.ambassador.image"/>
              <img class="ambassador-img" v-else src="../assets/placeholder-image.png"/>
            </v-avatar>
            <v-avatar v-else cols="1" class="icon-container align-center justify-center" size="36px">
              <img class="ambassador-img" src="../assets/placeholder-image.png"/>
            </v-avatar>
          </v-col>
          <v-col cols="3" class="ma-3">
            <p v-if="invoice.ambassador">
              {{invoice.ambassador.name}}<br>
              {{invoice.ambassador.billing_email}}<br>
              {{new Date(invoice.created_at).toISOString().substr(0, 10)}}
            </p> 
            <p v-if="invoice.super_ambassador">
              {{invoice.super_ambassador.name}}<br>
              {{invoice.super_ambassador.billing_email}}<br>
              {{new Date(invoice.created_at).toISOString().substr(0, 10)}}
            </p> 
          </v-col>
          
          <v-col cols="2" class="ma-3">
            <p>{{invoice.amount}} {{invoice.currency}}</p> 
          </v-col>

          <v-col cols="2" class="ma-3">
            <div class="layout-column layout-align-center">
              <p v-if="invoice.paid_at">
                {{$t ("aveine-invoice.title.payedAt")}}
                {{new Date(invoice.paid_at).toISOString().substr(0, 10)}}
              </p> 
              <p v-else>
                {{$t("aveine-invoice.title.notPayed")}}
              </p> 
            </div>
          </v-col>

          <v-row cols="3" class="ma-3">
            <a color="primary" raised class="ma-6" :href="invoice.url" target="_blank">
              <v-btn class="update" >
                {{$t("aveine-invoice.button.viewInvoice")}}
              </v-btn>
            </a>
            <div v-if="!invoice.paid_at">
              <v-dialog
                transition="dialog-bottom-transition"
                max-width="600"
                v-if="adminMode"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" raised class="ma-6" v-bind="attrs" v-on="on">
                    {{$t("aveine-invoice.button.pay")}}
                  </v-btn>
                </template>
                <template v-slot:default="dialog">
                  <v-card>
                    <v-toolbar
                      class="text-h6"
                      color="primary"
                      dark
                    >{{$t("aveine-invoice.title.payment")}}</v-toolbar>
                    <v-card-text class="justify-center align-center">
                      <v-col class="ma-6">
                        {{$t("aveine-invoice.title.paymentConfirmation")}}
                      </v-col>
                      <v-text-field
                        v-model="selectedInvoicePaymentDate"
                        type="date"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                      ></v-text-field>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn
                        text
                        class="update ma-2"
                        @click="submitPayment(invoice, dialog)"
                      >{{$t("aveine-invoice.button.submit")}}</v-btn>
                      <v-btn
                        text
                        class="ma-2"
                        @click="dialog.value = false"
                      >{{$t("aveine-invoice.button.cancel")}}</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
              <v-dialog
                transition="dialog-bottom-transition"
                max-width="600"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" raised  class="ma-6" v-bind="attrs" v-on="on">
                    {{$t("aveine-invoice.button.delete")}}
                  </v-btn>
                </template>
                <template v-slot:default="dialog">
                  <v-card>
                    <v-toolbar
                      class="text-h6"
                      color="primary"
                      dark
                    >{{$t("aveine-invoice.title.delete")}}</v-toolbar>
                    <v-card-text class="justify-center align-center">
                      <div class="text-h6 pa-6">{{$t("aveine-invoice.button.deleteRequest")}}</div>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn
                        text
                        class="delete ma-2"
                        @click="deleteInvoice(invoice, dialog)"
                      >{{$t("aveine-invoice.button.delete")}}</v-btn>
                      <v-btn
                        text
                        class="ma-2"
                        @click="dialog.value = false"
                      >{{$t("aveine-invoice.button.cancel")}}</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </div>
          </v-row>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>
<script>
import { Invoice } from 'aveine-toolbox'

export default {
  props: {
    /**
     * The list of loaded recent invoices
     * 
     * @type {Array}
     */
    invoices: Array, 
    /**
     * Flag to hide/show admin data/actions
     * 
     * @type {Boolean}
     */
    adminMode: Boolean},
  data: () => ({
    /**
     * Store the payment date to use on payment input
     * 
     * @type {String}
     */
    selectedInvoicePaymentDate: null,
  }),
  methods: {
  /**
   * Submit payment for the selected invoice
   * @param {Object} invoice the selected invoice
   * @param {Object} dialog the state of the dialog
   */
  submitPayment(invoice, dialog) {
    try{
      this.processing = true;
      
      let date = new Date(this.selectedInvoicePaymentDate);

      invoice.paid_at = date;
      Invoice.api().patch(`invoices/${invoice.$id}`, invoice);

      this.selectedInvoicePaymentDate = null;
      dialog.value = false;

      this.$toastr.s(this.$t("aveine-invoice.button.payedConfirmation"));
    } catch (response) {
      this.$toastr.e(response.toString());
    }
  },
		/**
		 * Delete the selected invoice
		 * @param {Object} invoice the selected invoice
		 * @param {Object} dialog the state of the dialog
		 */
		async deleteInvoice(invoice, dialog) {
      try {
        await Invoice.api().delete(`invoices/${invoice.id}`, {
            delete: 1
          }
        );
        dialog.value = false;
        this.$toastr.s(this.$t("aveine-invoice.button.deleteConfirmation"));
      } catch (response) {
        this.$toastr.e(response.toString());
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  div#aveine-invoice-list {
    h3 {
      font-size: 20px;
      font-weight: bolder;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
  }
</style>