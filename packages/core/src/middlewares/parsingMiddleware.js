function parseToPrimitive(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value.toString();
  }
}

async function parsingMiddleware(ctx, next) {
  [
    ctx.request.query,
    ctx.request.params,
    ctx.request.body,
    ctx.request.headers,
  ].forEach((field) => {
    if (field) {
      Object.entries(field).forEach(([key, value]) => {
        /* eslint-disable no-param-reassign */
        field[key] = parseToPrimitive(value);
        /* eslint-enable */
      });
    }
  });

  await next();
}

export default parsingMiddleware;
