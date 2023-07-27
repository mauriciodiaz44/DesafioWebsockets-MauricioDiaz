import { Router } from "express";
import ProductManager from "../ProductManager.js";
const manager = new ProductManager();
const productsView = Router();

// Obtener todos los productos
productsView.get("/", async (req, res) => {
  try {
    const products = await manager.getProducts();
    res.render("home", { products: products });
  } catch (e) {
    res.status(502).send({ error: true, msg: e });
  }
});

// Obtener producto por id
productsView.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const products = await manager.getProducts();
    const productsById = products.find((producto) => producto.id == pid);

    if (!productsById) {
      res.status(404).send({ error: true, message: "Producto no encontrado" });
    }
    res.render("home", { products: productsById });
  } catch (e) {
    res.status(502).send({ error: true, msg: e });
  }
});

// Actualizar producto por id
productsView.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = req.body;
    await manager.updateProduct(pid, product);
    res.send({ update: true });
  } catch (e) {
    res.status(502).send({ error: true, msg: e });
  }
});

// Crear producto
productsView.post("/", async (req, res) => {
  const body = req.body;
  if (
    !body.title ||
    !body.description ||
    !body.code ||
    !body.price ||
    !body.status ||
    !body.stock ||
    !body.category
  ) {
    res.send({ error: true, message: "Hay algunos campos en blanco" });
  } else {
    try {
      const result = await manager.addProduct(body);

      res.send(result);
    } catch (e) {
      res.status(502).send({ error: true, msg: e });
    }
  }
});

// Borrar producto
productsView.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    await manager.deleteProduct(pid);
    res.send({ deleted: true });
  } catch (e) {
    res.status(502).send({ error: true, msg: e });
  }
});

// Borrar todos los productos
productsView.delete("/", async (req, res) => {
  await manager.deleteAll();
  res.send({ deleted: true });
});

export default productsView;
