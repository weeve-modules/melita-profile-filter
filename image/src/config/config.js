const env = require('../utils/env')

module.exports = {
  EGRESS_URL: env('EGRESS_URL', ''),
  INGRESS_HOST: env('INGRESS_HOST', '127.0.0.1'),
  INGRESS_PORT: env('INGRESS_PORT', '8080'),
  PROFILE_IDS: env('PROFILE_IDS', '0c86cf8b-a8b2-45b1-ad36-a59c20404b24'),
  MATCHED_URL: env('MATCHED_URL', 'https://testmp.free.beeceptor.com'),
  MODULE_NAME: env('MODULE_NAME', 'Melita Profile Filter'),
}
