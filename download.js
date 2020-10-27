const fs = require('fs-extra');
const { execFile } = require('child_process');
const { streamEndpoint, storagePath, streamToken } = require('./config');

const buildBasename = (channel, stime, etime) => `${stime}-${etime}-${channel}.aac`;

const buildFfmpegParams = (channel, stime, etime) => [
  '-hide_banner',
  '-y',
  '-i',
  `${streamEndpoint}/${channel}/${stime}/${etime}/playlist.m3u8?token=${streamToken}`,
  '-acodec',
  'copy',
];

const download = async (channel, stime, etime) => {
  const dirname = `${storagePath}/${stime.substr(2, 4)}`;
  const basename = buildBasename(channel, stime, etime);
  const fullTarget = `${dirname}/${basename}`;
  const tempPath = `./download/${basename}`;
  const exists = await fs.exists(`${fullTarget}`);
  if (exists) return false;
  await fs.ensureDir(dirname);
  await new Promise((resolve, reject) => {
    execFile('ffmpeg', [...buildFfmpegParams(channel, stime, etime), tempPath], (error, stdout, stderr) => {
      if (error) return reject(error);
      return resolve({ stdout, stderr });
    });
  });
  return fs.move(tempPath, fullTarget);
};

module.exports = {
  download,
};
