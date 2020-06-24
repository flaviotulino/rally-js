import config from './config';

async function registerModels(ORM) {
  const { database } = config();
  const models = require.context(modelsPath, true, /\.(js|ts)$/);

  const entities = models.keys().map((m) => models(m).default);

  await ORM.createConnection({
    ...database,
    entities,
  });

  return Promise.resolve();
}

export default registerModels;
