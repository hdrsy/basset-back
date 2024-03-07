module.exports = [
  'strapi::errors',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        directives: {
          'connect-src': ["'self'", 'http:', 'https:'],
          'script-src': ["'self'", "https:", "http:"],
          'frame-src': ["'self'", "https:", "http:"],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
];
