 
let fs=require("fs");
class productManager {  
    constructor(path){
        this.path=path ;
    }

    #estructProduct = {
      properties: {
        code: { type: "string", minlength: 1 },
        title: { type: "string", minlength: 1 },
        description: { type: "string", minlength: 1 },
        price: { type: "number" },
        thumbnail: { type: "string", minlength: 1 },
        stock: { type: "number" },
      },
      required: ["code", "title", "description", "price", "thumbnail", "stock"],
    };
  
     #getNewId(productos) {
      let mayor = 0;
      productos.forEach((element) => {
        if (element.id > mayor) mayor = element.id;
      });
      return mayor + 1;
    }
  
    async addProduct(product) {
      let response = {
        estado: "",
        msg: [],
        producto: {},
      };
       
      let productos=await this.getProducts();
      let findProduct = productos.filter((X) => X.code == product.code);
  
      
      if (findProduct.length == 0) {
        let new_product_id =this.#getNewId(productos);
        let new_product = {
          id: new_product_id,
          ...product,
        };
        productos.push(new_product);

        let contenido=JSON.stringify(productos,null,2);
        await fs.promises.writeFile(`${this.path}`,contenido);

        response.estado = "OK";
        response.msg.push("Producto adicionado/modificado.");
        response.producto = new_product;
      } else {
          response.estado = "ERROR";
          response.msg.push("Código se encuentra registrado.");
      }
  
      return response;
    }
  
    async  getProducts() {
   
      try {
       let productos=await fs.promises.readFile(`${this.path}`,"utf-8");   
       return JSON.parse(productos);
    } catch (error) {
        console.log(error );
    }

    }
  
    async  getProductById(id) {
        let productos =await this.getProducts();
      let findProduct =productos.find((X) => X.id == id);
      let response = {
        estado: "ERROR",
        msg: "Not found",
        producto: {},
      };
      if (findProduct != undefined) {
        response.estado = "OK";
        response.msg = "Producto encontrado";
        response.producto = findProduct;
      }
  
      return response;
    }


    async updateProduct(product) {
        let response ;
      
        let msgValidEstruct = utilManager.validEstruct(
          this.#estructProduct,
          product
        );
        if (!msgValidEstruct.codigo) {
          msgValidEstruct.mensaje.forEach((X) => {
            response.estado = "ERROR";
            response.msg.push(X);
          });
          return response;
        }

        response =await this.deleteProduct(product.id); 
        if (response.estado =="ERROR")   return response ;
 
       let new_product = {    
        ...product,
      };
        response =await this.addProduct(new_product);

        return response ;
 
      }

      async deleteProduct(id){
        let response = {
            estado: "",
            msg: []           
          };

        try {
       
            let productos=await this.getProducts();
            let find =false;
            for(const key in productos){
                if(productos[key].id == id){             
                  productos.splice(key,1);
                  find=true;
                }
            }
            if (find){
                let contenido=JSON.stringify(productos,null,2);
                await fs.promises.writeFile(`${this.path}`,contenido);

                response.estado = "OK";
                response.msg.push("Producto eliminado");

            } else {

                response.estado = "ERROR";
                response.msg.push("Producto no encontrado.");
            }

        } catch (error) {
            response.estado = "ERROR";
            response.msg.push(error);
        }
        return response;
  
      }
  
  
      async deleteProductAll(){
        let response = {
            estado: "",
            msg: []           
          };
          try {
              await fs.promises.writeFile(`${this.path}`,'[]');
              response.estado = "OK";
              response.msg.push("Productos eliminados");
          } catch (error) {
            response.estado = "ERROR";
            response.msg.push(error);
          }
          return response;
        }


    
  }
  
  module.exports =  productManager;