import { Router } from "express";
import ProductManager from "../ProductManager.js";
const manager = new ProductManager();
const productsRealTime = Router();

// Obtener todos los productos
productsRealTime.get("/", async (req, res) => {
  try {
    const products = await manager.getProducts();
    res.render("realTimeProducts", { products: products });
  } catch (e) {
    res.status(502).send({ error: true });
  }
});

// Crear producto
productsRealTime.post("/", async (req, res) => {
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
      req.io.emit("addProduct", result);
      res.send(result);
    } catch (e) {
      res.status(502).send({ error: true });
    }
  }
});

// Borrar producto
productsRealTime.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const products = await manager.getProducts();
    const productsById = products.find((producto) => producto.id == pid);

    if (!productsById) {
      res.status(404).send({ error: true, message: "Producto no encontrado" });
    }
    await manager.deleteProduct(pid);
    req.io.emit("removeProduct", pid);
    res.send({ deleted: true });
  } catch (e) {
    res.status(502).send({ error: true });
  }
});

export default productsRealTime;
