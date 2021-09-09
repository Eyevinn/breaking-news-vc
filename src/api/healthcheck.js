module.exports = (fastify, opts, next) => {
    fastify.get('/', async (request, reply) => {
      reply.send({
        message: 'ok',
        component: 'breaking-news-vc',
        docs: '/api/docs'
      });
    }); 
    next();
  };