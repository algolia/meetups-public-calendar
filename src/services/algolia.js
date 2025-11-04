import { algoliasearch } from 'algoliasearch';

const appId = 'MXM0JWJNIW';
const apiKey =
  'NGU1NGYzMjU3MWJiYjQ3MTg3ODI5MDdkOTc0M2RhN2I4MGM4YWZlZWMwYmIyNGY1MWI2YmU2MjJjYzU3NDA0Y2ZpbHRlcnM9c3RhdHVzJTNBJUUyJTlDJTg1JTIwQ29uZmlybWVk';
const indexName = 'meetups';

const client = algoliasearch(appId, apiKey);

/**
 * Fetch meetups from Algolia for a given time range
 * @param {number} startTimestamp - Unix timestamp for range start
 * @param {number} endTimestamp - Unix timestamp for range end
 * @returns {Promise<Array>} Array of meetup hits
 */
export async function getMeetups(startTimestamp, endTimestamp) {
  const { results } = await client.search({
    requests: [
      {
        indexName,
        query: '',
        filters: `startDate >= ${startTimestamp} AND startDate <= ${endTimestamp}`,
        hitsPerPage: 100,
      },
    ],
  });

  return results[0].hits;
}
