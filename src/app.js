const express = require("express");
const app = express();
const { Musician } = require("../models/index")
const { db } = require("../db/connection")

const port = 3000;

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

//TODO: Create a GET /musicians route to return all musicians 

app.get("/musicians", async (req, res) => {
  try {
    const musicians = await Musician.findAll();
    res.json(musicians);
  } catch (error) {
    console.error("Error fetching musicians:", error);
    res.status(500).json({ error: "An error occurred while fetching musicians" });
  }
});

// New /musicians/:id route
app.get("/musicians/:id", async (req, res) => {
    const musicianId = req.params.id;
    try {
      const musician = await Musician.findByPk(musicianId);
  
      if (!musician) {
        return res.status(404).json({ error: "Musician not found" });
      }
      res.json(musician);
    } catch (error) {
      console.error("Error fetching musician:", error);
      res.status(500).json({ error: "An error occurred while fetching musician" });
    }
  });  

// New /musicians route (POST)
app.post("/musicians", async (req, res) => {
    try {
        const { name, instrument } = req.body;
        const newMusician = await Musician.create({ name, instrument });
        res.json(newMusician);
    } catch (error) {
        console.error("Error creating musician:", error);
        res.status(500).json({ error: "An error occurred while creating musician" });
    }
});

// Update existing musician (PUT)
app.put("/musicians/:id", async (req, res) => {
    const musicianId = req.params.id;
    try {
        const { name, instrument } = req.body;
        const [updatedRowCount, updatedMusicians] = await Musician.update(
            { name, instrument },
            { where: { id: musicianId }, returning: true }
        );
        
        if (updatedRowCount === 0) {
            return res.status(404).json({ error: "Musician not found" });
        }
        
        res.json(updatedMusicians[0]);
    } catch (error) {
        console.error("Error updating musician:", error);
        res.status(500).json({ error: "An error occurred while updating musician" });
    }
});

// Delete musician (DELETE)
app.delete("/musicians/:id", async (req, res) => {
    const musicianId = req.params.id;
    try {
        const deletedRowCount = await Musician.destroy({ where: { id: musicianId } });
        
        if (deletedRowCount === 0) {
            return res.status(404).json({ error: "Musician not found" });
        }
        
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting musician:", error);
        res.status(500).json({ error: "An error occurred while deleting musician" });
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



module.exports = app;