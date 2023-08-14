const express = require("express");
const router = express.Router();
const { Musician } = require("../models/index");

// router.post, router CRUD:

router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    if (!user) {
      throw new Error("No user created");
    }
    res.send(user.username);
  } catch (error) {
    next(error);
  }
});

router.get("/musicians", async (req, res) => {
    try {
      const musicians = await Musician.findAll();
      res.json(musicians);
    } catch (error) {
      console.error("Error fetching musicians:", error);
      res.status(500).json({ error: "An error occurred while fetching musicians" });
    }
  });
  
// New /musicians/:id route
router.get("/musicians/:id", async (req, res) => {
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
router.post("/musicians", async (req, res) => {
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
router.put("/musicians/:id", async (req, res) => {
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
router.delete("/musicians/:id", async (req, res) => {
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

router.listen(port, () => {
console.log(`Server is running on port ${port}`);
});
  

module.exports = router;
