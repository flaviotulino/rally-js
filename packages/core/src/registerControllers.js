import { join, relative } from 'path';
import parsingMiddleware from './middlewares/parsingMiddleware';
import validationMiddleware from './middlewares/validationMiddleware';

function registerControllers(router, routesTable, $verbose) {
  const controllers = require.context(controllersPath, true, /\.(ts|js)$/);

  if (controllers.keys().length === 0) {
    console.log(`No controllers found in ${controllersPath}`);
    process.exit(-1);
  }

  controllers.keys().forEach((ctrl) => {
    const {
      method = 'get', url, before = null, handler, after = null, enabled = true, schema = null,
    } = controllers(ctrl).default;

    if (enabled) {
      const fn = (() => {
        switch (method) {
          case 'GET': case 'get': return 'get';
          case 'POST': case 'post': return 'post';
          case 'PUT': case 'put': return 'put';
          case 'DELETE': case 'delete': return 'delete';
          default: throw new Error(`Method ${method} is not recognised`);
        }
      })();

      const middlewares = [];

      const middlewaresInfo = {};

      // parsing middleware
      middlewares.push(parsingMiddleware);

      if (schema) {
        // validation middleware
        middlewares.push((ctx, next) => validationMiddleware(ctx, next, schema));

        middlewaresInfo.validation = true;
      }

      if (before) {
        if (Array.isArray(before)) {
          middlewares.concat(...before);
          middlewaresInfo.before = before.length;
        } else {
          middlewares.push(before);
          middlewaresInfo.before = 1;
        }
      }

      // final  middleware
      middlewares.push(async (ctx, next) => {
        if ($verbose) {
          console.table({
            method,
            url: router.opts.prefix + url,
            action: relative(process.env.PROJECT, join(controllersPath, ctrl)),
          });
        }

        const body = await handler(ctx);
        ctx.body = body;

        if (after) {
          if (Array.isArray(after)) {
            let index = 0;
            const nextAfter = () => {
              index += 1;
            };

            while (index < after.length) {
              after[index](ctx, nextAfter);
            }

            middlewaresInfo.after = after.length;
          } else {
            after(ctx);
            middlewaresInfo.after = 1;
          }
        }

        next();
      });

      // register the route
      router[fn](
        url,
        ...middlewares,
      );

      routesTable.push({
        method,
        url: router.opts.prefix + url,
        action: relative(process.env.PROJECT, join(controllersPath, ctrl)),
        get middlewares() {
          if (Object.keys(middlewaresInfo).length > 0) {
            return middlewaresInfo;
          }
          return 'None';
        },
      });
    }
  });
}

export default registerControllers;
