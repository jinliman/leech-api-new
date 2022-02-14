'use strict';

const TTL = 5 * 60;

async function cache(ctx, next) {
  if (ctx.method !== 'GET') {
    return await next();
  }

  const cached = ctx.cache[ctx.url];
  if (cached !== undefined && cached.js && cached.js + TTL * 1000 > Date.now()) {
    ctx.status = 200;
    ctx.body = cached.body;
    return;
  }

  await next();

  ctx.set('Cache-Control', `public, max-age=${TTL}`);
  ctx.cache[ctx.url] = {
    ts: Date.now(),
    body: ctx.body,
  };
}

module.exports = cache;
