import { Buffer } from "node:buffer";
import { connectLambda, getStore } from "@netlify/blobs";
import type { Handler } from "@netlify/functions";

const defaultContentType = "application/octet-stream";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: "Method not allowed."
    };
  }

  const key = event.queryStringParameters?.key;
  if (!key) {
    return {
      statusCode: 400,
      body: "Missing image key."
    };
  }

  try {
    connectLambda(event as unknown as Parameters<typeof connectLambda>[0]);
    const store = getStore("suguan-images");
    const result = await store.getWithMetadata(key, { type: "arrayBuffer" });

    if (!result) {
      return {
        statusCode: 404,
        body: "Image not found."
      };
    }

    const contentType =
      typeof result.metadata.contentType === "string"
        ? result.metadata.contentType
        : defaultContentType;

    return {
      statusCode: 200,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType
      },
      body: Buffer.from(result.data).toString("base64"),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error("Netlify image read failed:", error);
    return {
      statusCode: 500,
      body: "Image read failed."
    };
  }
};
