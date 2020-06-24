import Ajv from 'ajv';

async function validationMiddleware(ctx, next, schema) {
  const ajv = new Ajv();
  const valid = ajv.validate({ properties: schema }, ctx.request);
  if (!valid) {
    ctx.status = 400;
    ctx.body = {
      message: `${ajv.errors[0].dataPath.slice(1)} ${ajv.errors[0].message}`,
    };
  }
  await next();
}

export default validationMiddleware;
