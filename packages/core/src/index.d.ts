declare module "@rally-js/core";

import Koa from 'koa';

interface RallyOptions {
    plugins: {
        ORM: any
    }
}

interface RallyModule {
    start(port: Number): void;
    printRoutes(): void;
}

type ActionMiddleware = (ctx: Koa.Context, next: Koa.Next) => void;

interface ActionOptions {
    enabled?: boolean;
    // schema?: 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: String;
    after?: ActionMiddleware | Array<ActionMiddleware>;
    before?: ActionMiddleware | Array<ActionMiddleware>;
    handler(ctx: Koa.Context, next?: Koa.Next): void;
}

export class Action {
    constructor(options: ActionOptions);
}
    
export default function (options: RallyOptions): RallyModule;
