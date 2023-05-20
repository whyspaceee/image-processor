import { S3Client } from '@aws-sdk/client-s3';

const globalForAWS = global as unknown as {
  s3: S3Client | undefined;
};

console.log(process.env.S3_KEY, process.env.S3_SECRET)

// Configure AWS SDK with your credentials
const s3 = new S3Client({
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    endpoint: "https://sgp1.digitaloceanspaces.com",
    region: "us-east-1",
    credentials: {
        secretAccessKey: process.env.S3_SECRET!,
        accessKeyId: process.env.S3_KEY!,
    }
});

if (process.env.NODE_ENV !== 'production') {
  globalForAWS.s3 = s3;
}

export { s3 };
