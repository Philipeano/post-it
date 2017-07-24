import express from 'express';
import sample from '../controllers/sampleController';

const sampleRouter = express.Router();

/**
 * @description: Defines router for handling all 'sample' requests
 * @module
 */

const sampleController = new sample.Sample();

// Fetch all samples
sampleRouter.get('/samples', sampleController.getAllSamples);

// Fetch samples with specified key
sampleRouter.get('/:sampleId/samples', sampleController.getSampleByKey);

// Create new sample
sampleRouter.post('/', sampleController.createSample);

// Delete samples with specified key
sampleRouter.delete('/:sampleId/samples', sampleController.deleteSample);

// Respond to random requests
sampleRouter.use('/*', (req, res) => {
  res.status(200).send({ message: 'PostIT API is running...' });
});

export default sampleRouter;
