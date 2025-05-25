const { BlobServiceClient } = require("@azure/storage-blob");
const csvParser = require("csv-parser");
const stream = require("stream");

module.exports = async function (context, blobTrigger) {
  const csvContent = blobTrigger.toString();
  const results = [];

  const readableStream = new stream.Readable();
  readableStream.push(csvContent);
  readableStream.push(null);

  readableStream.pipe(csvParser())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      context.log("CSV Records:");
      results.forEach(record => {
        context.log(record);
      });
    });
};