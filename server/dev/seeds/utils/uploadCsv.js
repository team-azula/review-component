const { spawn } = require('child_process');
const fs = require('fs');
const log = require('single-line-log').stdout;

module.exports.uploadCsv = async (filePath, chunk) => {
  const { PGCONTAINER } = process.env;
  const execString = `cat ${filePath} | docker exec -i ${PGCONTAINER} psql -U admin reviews -c "copy
 reviews from stdin with(format csv, header true);"`;

  const upload = spawn('sh', ['-c', execString]);

  return new Promise((resolve, reject) => {
    log(` - SENDING CHUNK: ${chunk}`);
    let insertions = 0;

    upload.stdout.on('data', (data) => {
      insertions += parseInt(data.toString().replace('COPY', ''), 10);
      log(` - UPLOADED CHUNK: ${chunk}: ${data}`);
    });

    upload.stderr.on('data', () => {});

    upload.on('error', (error) => {
      reject(error);
    });

    upload.on('close', async (code) => {
      if (code === 0) {
        // log(` - DELETING FILE: ${chunk}`);
        // await fs.unlink(filePath, (err) => {
        //   reject(err);
        // });
        resolve(insertions);
      }
      reject(code);
    });
  });
};
