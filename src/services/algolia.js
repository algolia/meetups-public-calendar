import { algoliasearch } from 'algoliasearch';

const appId = 'MXM0JWJNIW';
const apiKey =
  'YmYzNzgxNTNmMzIxZmVhNTQyYThiYWZlZWI2OTY3ODFkMGZkMTY3MTEwNTQ3ZmU1ZjI2ZmI0ZjgzZDgyMmQ3NmZpbHRlcnM9c3RhdHVzJTNBJTIyJUUyJTlDJTg1JTIwQ29uZmlybWVkJTIy';
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
