import express from "express";
import productRoutes from "./routes/product.routes";
import usersRoutes from "./routes/users.routes";
import 'dotenv/config'

const app = express();
app.use(express.json());
const port = 3000;

app.use("/products", productRoutes);
app.use("/users", usersRoutes);
app.use("/saveProfile", usersRoutes);
app.use("/fetchProfile", usersRoutes);
app.use("/order", usersRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});