const Queue = require('better-queue');
const { search } = require('./search');
const { download } = require('./download');

const cleanDate = (s) => s.replace(/[^\d+]/g, '');

const rules = require('./rules.json');

const q = new Queue((input, cb) => {
  const channel = input.station_id;
  const stime = cleanDate(input.start_time);
  const etime = cleanDate(input.end_time);
  download(channel, stime, etime)
    .then(() => cb(null))
    .catch((e) => cb(e));
}, { concurrent: 5 });

const m = new Map();
Promise.all(rules.map(async (rule) => {
  const [key, areaId, stationId] = rule;
  const res = await search(key, areaId);
  res.forEach((e) => {
    if (stationId && e.station_id !== stationId) return;
    if (e.ts_out_ng !== 0 || e.ts_in_ng !== 0) return;
    if (e.status !== 'past') return;
    const pgkey = `${e.station_id}${cleanDate(e.start_time)}`;
    if (m.has(pgkey)) return;
    m.set(pgkey, e);
    q.push(e);
  });
})).then(() => {
  console.log([m.values()]);
});
