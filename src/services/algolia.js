import { algoliasearch } from 'algoliasearch';

const appId = 'MXM0JWJNIW';
const apiKey = '6b85adf80eb163b6b2a5af2408cee83b';
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
