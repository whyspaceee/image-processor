import { SdkStreamMixin } from "@aws-sdk/types";

export const streamToBuffer = (stream : any): Promise<Buffer> =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    if (stream) {
      stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    } else {
      reject(new Error("Invalid stream"));
    }
  });