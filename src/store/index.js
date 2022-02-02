import Vue from 'vue'
import axios from 'axios'
import { Vuex, VuexORM, database } from "aveine-toolbox"
import VuexORMAxios from '@vuex-orm/plugin-axios'
import VuexORMisDirtyPlugin from '@vuex-orm/plugin-change-flags';
import { dataNormalizer } from 'aveine-toolbox';

Vue.use(Vuex)

// Initializing VuexORM
VuexORM.use(VuexORMAxios,
  {
  axios,
  apiRoot: "/",
  baseURL: process.env.VUE_APP_API_HOST,
  headers: {'Authorization': `Bearer ` + localStorage.authToken, 'Content-Type': 'application/vnd.api+json'},
  transformResponse: (data) => {
    let serializedData = dataNormalizer.documentToModel(JSON.parse(data));
    console.log("serialized response", serializedData);

    return data ? serializedData : null;
  }
})

// To do : See how to use this correctly or replacing it
VuexORM.use(VuexORMisDirtyPlugin);

export default new Vuex.Store({
  plugins: [VuexORM.install(database)]
})
