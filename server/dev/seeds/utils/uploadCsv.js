const { spawn } = require('child_process');
const fs = require('fs');

module.exports.uploadCsv = async (filePath, chunk) => {
  const { PGCONTAINER } = process.env;
  const execString = `cat ${filePath} | docker exec -i ${PGCONTAINER} psql -U admin reviews -c "copy
 reviews from stdin with(format csv, header true);"`;

  const upload = spawn('sh', ['-c', execString]);

  return new Promise((resolve, reject) => {
    console.log(`SENDING CHUNK: ${chunk}`);

    upload.stdout.on('data', (data) => {
      console.log(`UPLOADED CHUNK: ${chunk}: ${data}`);
    });

    upload.stderr.on('data', () => {});

    upload.on('error', (error) => {
      reject(error);
    });

    upload.on('close', (code) => {
      if (code === 0) {
        console.log(`DELETING FILE: ${chunk}`);
        resolve(
          fs.unlink(filePath, (err) => {
            reject(err);
          })
        );
      }
      reject(code);
    });
  });
};
