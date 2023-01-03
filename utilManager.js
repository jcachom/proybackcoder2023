 class   utilManager {
    constructor() {}
  
    static validEstruct = (estructBase, jsObject) => {
      let Properties = estructBase.properties;
      let propsRequired = estructBase.required;
      let listMensaje = [];
      let hasPropObject = false;
      let minlength = 0;
      let msgval = "",
        typeEstruct = "",
        typeObject = "";
  
      let estructResponse = {
        codigo: true,
        mensaje: [],
      };
  
      for (var prop in Properties) {
        hasPropObject = jsObject.hasOwnProperty(prop);
        if (propsRequired.includes(prop)) {
          if (!hasPropObject) {
            listMensaje.push(`Propiedad [${prop}] es requerido.`);
          }
        }
        let subProp = Properties[prop];
  
        if (subProp.hasOwnProperty("minlength")) {
          minlength = subProp.minlength;
          msgval = `Propiedad [${prop}] debe ser tamaño mínimo:${minlength}`;
          if (hasPropObject && jsObject[prop].length < minlength)
            listMensaje.push(msgval);
        }
  
        if (subProp.hasOwnProperty("type")) {
          typeEstruct = subProp.type;
          typeObject = typeof jsObject[prop];
          msgval = `Tipo dato [${prop}] debe ser ${typeEstruct}`;
          if (hasPropObject && typeObject != typeEstruct)
            listMensaje.push(msgval);
        }
      }
  
      if (listMensaje.length > 0) {
        estructResponse.codigo = false;
        estructResponse.mensaje = listMensaje;
      }
  
      return estructResponse;
    };
  }

  module.exports =  utilManager;