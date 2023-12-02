import Debug from 'debug'
const debug = new Debug('api/utils/mongooseFunctions')

export default {

  /**
   * funcion para hacer llamados del middleware remove en cascada
   * y borrar todos los subdocumentos
   * 
   * @param {MongooseSchema} model - modelo a borrar 
   * @param {Object} condition - condicion de mongoose find(condition)
   */
  findManyAndPreRemove(model, condition = {}) {
    debug('findManyAndPreRemove called', condition)
    model.find(condition)
      .then(data => {
        if (data) {
          data.forEach(el => {
            el.remove();
          });
        }
      })
      .catch(err => {
        debug('err on findManyAndPreRemove', err);
      })
  }
}