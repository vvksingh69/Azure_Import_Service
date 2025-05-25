const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
  const { name } = req.query;

  if (!name) {
    context.res = {
      status: 400,
      body: "Query parameter 'name' is required."
    };
    return;
  }

  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    new Azure.StorageSharedKeyCredential(accountName, accountKey)
  );

  const containerName = "uploaded";
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Create container if it doesn't exist
  await containerClient.createIfNotExists();

  // Generate SAS token
  const blobSas = generateBlobSas(
    accountName,
    accountKey,
    containerName,
    name,
    "w"
  );

  context.res = {
    status: 200,
    body: {
      token: blobSas,
      url: `${containerClient.url}/${name}?${blobSas}`
    }
  };
};

function generateBlobSas(accountName, accountKey, container, blob, permissions) {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 15); // Token valid for 15 minutes

  // Construct SAS token parameters
  const sas = new BlobSasParameters({
    containerName: container,
    blobName: blob,
    permissions,
    startsOn: new Date(),
    expiresOn: expiry
  });

  return sas.generateSasQueryParameters(
    new StorageSharedKeyCredential(accountName, accountKey)
  ).toString();
}