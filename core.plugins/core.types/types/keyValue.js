export default {
  name: 'keyValue',
  schema: {
    key: {
      type: 'string',
      isRequired: true
    },
    value: {
      type: 'any'
    }
  },
  build(def){
    return def;
  }
};
