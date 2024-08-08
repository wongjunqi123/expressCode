import express from "express";
import videoRoutes from "./routes/video.routes";

const app = express();
app.use(express.json());
const port = 3000;

app.use("/videos", videoRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
