const app = require("./src/app");
const { db } = require("./db/connection")
const port = 3000;
//
const musiciansRouter = require("./routes/musicians");

app.use("/musicians", musiciansRouter); // Mount the router at /musicians

app.listen(port, () => {
    db.sync();
    console.log(`Listening at http://localhost:${port}/musicians`)
})