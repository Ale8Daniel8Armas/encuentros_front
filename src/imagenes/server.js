import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload_routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/upload", uploadRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor de imágenes corriendo en puerto ${process.env.PORT}`);
});
