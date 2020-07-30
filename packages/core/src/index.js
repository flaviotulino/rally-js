import Koa from 'koa';
import Router from 'koa-router';
import 'regenerator-runtime/runtime';

import bodyParser from 'koa-bodyparser';
import config from './config';
import registerControllers from './registerControllers';
import registerModels from './registerModels';

import Action from './Action';

export { Action };

export default ({
  plugins = {
    ORM: false,
  },
} = {}) => {
  const routesTable = [];
  const app = new Koa();
  app.use(bodyParser());

  const routerConfig = config().router || {};

  const router = new Router({
    prefix: routerConfig.prefix || '/',
  });

  registerControllers(router, routesTable);

  app.use(router.routes());
  app.use(router.allowedMethods());

  async function start(port) {
    if (plugins.ORM) {
      await registerModels(plugins.ORM);
    }

    await app.listen(port);

    // if (verbose) {
    //   console.table(routesTable);
    // }

    console.log(`started on ${port}`);
  }

  function printRoutes() {
    console.table(routesTable);
  }

  return {
    start,
    printRoutes,
  };
};
