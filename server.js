import app from "./app.js"; //.js lekuntey error vasthadhi

import cloudinary from "cloudinary";

cloudinary.v2.config({
  api_key: "771582953754449",
  cloud_name: "dpamk6j6w",
  api_secret: "oW21po6rg1Pan1HWbGt831KC8-I",
});

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
