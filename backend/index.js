import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send(`Hello This is Ajay! and nothing changed`);
});
app.get("/user", (req, res)=>{
  res.send("User is Ajay and he has great aura")
});

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});