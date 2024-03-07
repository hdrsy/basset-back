'use strict';

/**
 * middle service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::middle.middle');
