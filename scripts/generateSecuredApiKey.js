/**
 * Generate a Secured API Key that is:
 * - scoped to the same index as its primary key
 * - filters results to only include records with status = 'CONFIRMED'
 *
 * The secured key is meant to be generated once and hardcoded in the application.
 *
 * Usage:
 *   ALGOLIA_SEARCH_API_KEY=your_key_here yarn run generate-secured-api-key
 *
 * Documentation:
 * - Secured API Keys: https://www.algolia.com/doc/guides/security/api-keys/
 * - Generate method: https://www.algolia.com/doc/libraries/sdk/methods/search/generate-secured-api-key
 */

import { algoliasearch } from 'algoliasearch';

const appId = 'MXM0JWJNIW';
const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

if (!searchApiKey) {
  console.error(
    '❌ Error: ALGOLIA_SEARCH_API_KEY environment variable is required',
  );
  console.error('');
  console.error('Usage:');
  console.error(
    'ALGOLIA_SEARCH_API_KEY=your_key_here yarn run generate-secured-api-key',
  );
  process.exit(1);
}

const client = algoliasearch(appId, searchApiKey);

// Generate a secured API key with status filter
const securedApiKey = client.generateSecuredApiKey({
  parentApiKey: searchApiKey,
  restrictions: {
    filters: 'status:"✅ Confirmed"',
  },
});

console.log('Generated key:');
console.log('');
console.log(securedApiKey);
