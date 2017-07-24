import db from '../models/index';
import sample from '../models/sample';

const sequelize = db.sequelize;

/**
 * @description: Defines controller for manipulating 'sample' model
 * @class
 */
class Sample {
  /**
   * @description: Initializes instance with 'sample' model as local property
   * @constructor
   */
  constructor() {
    this.sample = sample(sequelize);
  }

  /**
   * @description: creates a new sample
   * @param {String} value1
   * @param {String} value2
   * @param {String} value3
   * @param {Function} done
   * @return {Object} newSample
   */
  createSample(value1, value2, value3, done) {
    return this.sample.sync().then(() => {
      this.sample.create({
        value1,
        value2,
        value3,
      }).then((newSample) => {
        done(newSample);
      }).catch((err) => {
        throw new Error(err);
      });
    });
  }

  /**
   * @description: fetches all available samples
   * @param {Function} done
   * @return {Object} allSamples
   */
  getAllSamples(done) {
    this.sample.findAll().then((allSamples) => {
      done(allSamples);
    });
  }

  /**
   * @description: fetches all samples matching specified sampleKey
   * @param {String} sampleKey
   * @param {Function} done
   * @return {Object} matchingSamples
   */
  getSampleByKey(sampleKey, done) {
    this.sample.findAll({ where: { sampleId: sampleKey } })
      .then((matchingSamples) => {
        done(matchingSamples);
      });
  }

  /**
   * @description: deletes a sample matching specified sampleKey
   * @param {String} sampleKey
   * @return {Object} deletedSample
   */
  deleteSample(sampleKey) {
    this.sample.destroy({ where: { sampleId: sampleKey } });
  }
}

export default Sample;
