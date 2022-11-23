const fs = require('fs');
const stats = fs.statSync('package-lock.json');
const segmentsCount = Math.ceil(stats.size / 1024); //1KB chunk
const fileSize = stats.size;
const chunkSize = Math.floor(fileSize / (segmentsCount - 1));

const lastChunkSize = fileSize - chunkSize * (segmentsCount - 1);
console.log('Segments: ', segmentsCount);
console.log('ChunkSize: ', chunkSize);
console.log('LastChunkSize: ', lastChunkSize);

const stream = fs.createReadStream('package-lock.json', {
  encoding: 'utf-8',
  // highWaterMark: chunkSize,
});
let t = 0;
stream.pause();
stream
  .on('readable', () => {
    // console.log('READABLE');
    let d;
    while ((d = stream.read(1024)) != null) {
      console.log(d.length);
      t += d.length;
    }
  })
  .on('end', () => {
    console.log('t: ', t);

    console.log('Size: ', stats.size);
  });

// stream.pause();
// console.log('P', stream.isPaused());
