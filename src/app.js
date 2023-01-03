let productManager = require("./productManager.js");
let oProducto = new productManager("../productos.txt");
 

const express = require("express");

const app = express();
const PUERTO = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/products/:pid", (req, res) => {
  let idProd = req.params["pid"];

  console.log(idProd);

  const main = async () => {
    let response = await oProducto.getProductById(idProd);
    res.json(response);
  };
  main();
});
//http://localhost:8080/products/7

app.get("/products", (req, res) => {
  let cantFilas = new Number(req.query.limit ?? 0);

  const main = async () => {
    let response = await oProducto.getProducts();

    if (cantFilas > 0 && cantFilas <= response.length) {     
      response = response.slice(0, cantFilas);
    }
    res.json(response);
  };
  main();
});
//http://localhost:8080/products/?limit=2
 

app.listen(PUERTO, () => {
  console.log(`Servidor arriba en puerto:${PUERTO}  ruta:>localhost:${PUERTO}`);
});
