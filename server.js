import app from "./app.js"; //.js lekuntey error vasthadhi

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
