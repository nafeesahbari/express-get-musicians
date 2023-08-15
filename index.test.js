// install dependencies
const { execSync } = require('child_process');
execSync('npm install');
execSync('npm run seed');

const request = require("supertest")
const { db } = require('./db/connection');
const { Musician } = require('./models/index')
const app = require('./src/app');
const seedMusician = require("./seedData");

describe('./musicians endpoint', () => {
    // Write your tests here
    beforeAll(async () => {
        // Seed your database before running tests
        await db.sync({ force: true }); // This will recreate the database
        await seedMusician(); // Seed the musicians data
    });

    afterAll(async () => {
        await db.close(); // Close the database connection after all tests
    });

    test("GET /musicians should return a list of musicians", async () => {
        const response = await request(app).get("/musicians");

        // Verify the status code
        expect(response.statusCode).toBe(200);

        // Verify the response format
        expect(response.type).toBe("application/json");

        // Verify the response body contains an array of musicians
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("GET /musicians should return the correct number of musicians", async () => {
        const response = await request(app).get("/musicians");
        const musiciansFromDB = await Musician.findAll();

        // Verify that the number of musicians in the response matches the number in the database
        expect(response.body.length).toBe(musiciansFromDB.length);
    });

    test("GET /musicians should return musicians with correct properties", async () => {
        const response = await request(app).get("/musicians");
        const firstMusician = response.body[0];

        // Verify that the musician object has the expected properties
        expect(firstMusician).toHaveProperty("id");
        expect(firstMusician).toHaveProperty("name");
        expect(firstMusician).toHaveProperty("instrument");
        // Add more property checks as needed
    });

    test("GET /musicians/:id should return a single musician", async () => {
        const musiciansFromDB = await Musician.findAll();
        const randomIndex = Math.floor(Math.random() * musiciansFromDB.length);
        const randomMusician = musiciansFromDB[randomIndex];

        const response = await request(app).get(`/musicians/${randomMusician.id}`);

        // Verify the status code
        expect(response.statusCode).toBe(200);

        // Verify the response format
        expect(response.type).toBe("application/json");

        // Verify the response body matches the expected musician
        expect(response.body).toEqual(expect.objectContaining({
            id: randomMusician.id,
            name: randomMusician.name,
            instrument: randomMusician.instrument
            // Add more property checks as needed
        }));
    });

    test("GET /musicians/:id should return 404 for non-existent musician", async () => {
        const nonExistentId = 9999; // Assuming this ID doesn't exist

        const response = await request(app).get(`/musicians/${nonExistentId}`);

        // Verify the status code
        expect(response.statusCode).toBe(404);
    });

    test("POST /musicians should create a new musician", async () => {
        const newMusicianData = {
            name: "New Musician",
            instrument: "Guitar"
        };

        const response = await request(app)
            .post("/musicians")
            .send(newMusicianData);

        // Verify the status code
        expect(response.statusCode).toBe(200);

        // Verify the response format
        expect(response.type).toBe("application/json");

        // Verify the response body contains the created musician
        expect(response.body).toMatchObject(newMusicianData);
    });

    // Part 5 - step 10
    test('POST /musicians', () => {
        it('responds with errors when name field is empty', async () => {
          const response = await request(app)
            .post('/musicians')
            .send({ instrument: 'Guitar' });
      
          expect(response.status).toBe(400);
          expect(response.body).toHaveProperty('error');
        });
      
        it('responds with errors when instrument field is empty', async () => {
          const response = await request(app)
            .post('/musicians')
            .send({ name: 'John Doe' });
      
          expect(response.status).toBe(400);
          expect(response.body).toHaveProperty('error');
        });
      });

    test("PUT /musicians/:id should update an existing musician", async () => {
        const musiciansFromDB = await Musician.findAll();
        const randomIndex = Math.floor(Math.random() * musiciansFromDB.length);
        const randomMusician = musiciansFromDB[randomIndex];

        const updatedMusicianData = {
            name: "Updated Musician",
            instrument: "Piano"
        };

        const response = await request(app)
            .put(`/musicians/${randomMusician.id}`)
            .send(updatedMusicianData);

        // Verify the status code
        expect(response.statusCode).toBe(200);

        // Verify the response format
        expect(response.type).toBe("application/json");

        // Verify the response body matches the updated musician
        expect(response.body).toMatchObject(updatedMusicianData);
    });

    test("DELETE /musicians/:id should delete an existing musician", async () => {
        const musiciansFromDB = await Musician.findAll();
        const randomIndex = Math.floor(Math.random() * musiciansFromDB.length);
        const randomMusician = musiciansFromDB[randomIndex];

        const response = await request(app).delete(`/musicians/${randomMusician.id}`);

        // Verify the status code
        expect(response.statusCode).toBe(204);

        // Verify that the musician is deleted
        const deletedMusician = await Musician.findByPk(randomMusician.id);
        expect(deletedMusician).toBeNull();
    });

    it("should get all musicians", async () => {
        const response = await request(app).get("/musicians");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
      });
    
})