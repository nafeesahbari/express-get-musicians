const request = require('supertest');
const app = require('../src/app.js');
const Musician = require('models/Musician.js');

jest.mock("models/Musician.js", () => ({ create: jest.fn()}))

describe('Musician routes', () => {
  describe('CREATE functionality', () => {
    it('should successfully create a Musician and return 200', async () => {
      //ARRANGE
      const musicianData = {
        name: 'LUCY',
        instrument: 'drums',
      }
      Musician.create.mockResolvedValue(musicianData);
      
      //ACT
      const response = await request(app).post("/musicians").send(musicianData);

      //ASSERT - expect response status to be 200
      expect(response.status).toBe(200);
      expect(response.text).toEqual('LUCY');
      expect(Musician.create).toHaveBeenCalled();
    });

    it('should return an error if Musician creation fails', async () => {
      //ARRANGE
      const musicianData = {
        name: 'LUCY',
        instrument: 'drums',
      }
      Musician.create.mockRejectedValue(new Error('Musician creation failed'));
      
      //ACT
      const response = await request(app).post("/Musicians").send(musicianData);
      
      //ASSERT
      expect(response.status).toBe(500);
      expect(Musician.create).toHaveBeenCalled();
      expect(response.text).toContain('Musician creation failed');
    })
  })
})