import { createServer, Model,  Factory, belongsTo, association, JSONAPISerializer } from "miragejs"
const faker = require('faker');

export function makeServer({ environment = "development" } = {}) {
  let server = createServer({
    environment,

    serializers: {
      application: JSONAPISerializer.extend({
        embed: true,
        keyForAttribute(attribute) {
          return attribute.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        },
        keyForEmbeddedRelationship(modelName) {
          return modelName.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        }
      })
    },
    
    models: {
      ambassador: Model,
      invoice: Model.extend({
        ambassador: belongsTo()
      })
    },

    factories: {
      ambassador: Factory.extend({
        name() {
          return faker.name.firstName();
        },
        billing_email() {
          return faker.internet.email();
        },
        image() {
          return faker.image.imageUrl();
        }
      }),
      invoice: Factory.extend({
        url(){
          return "https://s3-eu-west-3.amazonaws.com/aws-aveine-winedata-media/media/tos/domain/en/CGU_v2.pdf?X-Amz-Expires=86400&Content-Type=application%2Fpdf&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUY55IPUFDYTNTIXV%2F20210407%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Date=20210407T082352Z&X-Amz-SignedHeaders=host&X-Amz-Signature=d55db2254e24129178e27cc5d4bc74ce8ee28afbeed17ac595faee27dfcab0b5"
        },
      
        amount(){
          let number = 1000;
          return Math.floor(Math.random()* (number + 1))
        },
      
        currency(){
            return "Euro"
        },
      
        paid_at() {
          return null;
        },
      
        created_at(){
          return faker.date.recent();
        },
        ambassador: association()
      })
    },

    seeds(server) {
      server.createList('invoice', 10);
    },

    routes() {
      this.namespace = "/"

      this.get('invoices');
      this.post('invoices');
      this.patch('invoices/:id');
      this.delete('invoices/:id')
    },
  })

  return server
}