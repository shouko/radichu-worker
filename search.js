const fetch = require('node-fetch');
const { uid, searchEndpoint } = require('./config');

const baseParams = [
//    [ 'key', '' ],
//    [ 'area_id', 'JP13' ],
  ['filter', 'past'],
  ['start_day', ''],
  ['end_day', ''],
  ['region_id', ''],
  ['page_idx', '0'],
  ['uid', uid],
  ['row_limit', '50'],
  ['app_id', 'pc'],
  ['action_id', '0'],
];

const buildQueryUrl = (key, areaId) => {
  const query = [
    ...baseParams,
    ['key', encodeURIComponent(key)],
    ['area_id', `JP${areaId}`],
  ].map((e) => e.join('=')).join('&');
  return `${searchEndpoint}?${query}`;
};

const search = async (key, areaId) => fetch(buildQueryUrl(key, areaId))
  .then((r) => r.json())
  .then((r) => {
    if (!r || !Array.isArray(r.data)) return [];
    return r.data;
  })
  .catch(() => []);

module.exports = {
  search,
};
