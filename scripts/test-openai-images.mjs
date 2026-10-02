// Run: node --experimental-strip-types --test scripts/test-openai-images.mjs
import assert from "node:assert/strict";
import { test, beforeEach, afterEach } from "node:test";
import { generateImage, imageModel, textModel } from "../packages/convex/convex/lib/openai.ts";

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xd9]);
const response = () => new Response(JSON.stringify({ data: [{ b64_json: jpeg.toString("base64") }] }), {
  headers: { "Content-Type": "application/json" },
});

beforeEach(() => {
  process.env.OPENAI_API_KEY = "test-key";
  delete process.env.OPENAI_IMAGE_MODEL;
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const key of ["OPENAI_API_KEY", "OPENAI_IMAGE_MODEL", "OPENAI_TEXT_MODEL"]) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
});

test("new images default to GPT Image 2.5 Sunburst while text configuration stays independent", () => {
  assert.equal(imageModel(), "gpt-image-2.5-sunburst");
  process.env.OPENAI_TEXT_MODEL = "configured-text-model";
  assert.equal(textModel(), "configured-text-model");
  process.env.OPENAI_IMAGE_MODEL = "gpt-image-2.5-flare";
  assert.equal(imageModel(), "gpt-image-2.5-flare");
  assert.equal(textModel(), "configured-text-model");
});

test("generation preserves the landscape JPEG contract with the new model", async () => {
  globalThis.fetch = async (url, init) => {
    assert.equal(url, "https://api.openai.com/v1/images/generations");
    assert.deepEqual(JSON.parse(init.body), {
      model: "gpt-image-2.5-sunburst", prompt: "Portugal", n: 1,
      size: "1536x1024", quality: "high", output_format: "jpeg",
    });
    return response();
  };
  const image = await generateImage({ prompt: "Portugal" });
  assert.equal(image.type, "image/jpeg");
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), jpeg);
});

test("logo-reference edits omit legacy fidelity and retain the original reference bytes", async () => {
  const reference = new Blob(["reference-image"], { type: "image/jpeg" });
  for (const model of ["gpt-image-2.5-sunburst", "gpt-image-2.5-flare", "gpt-image-2.5-sunburst-2026-09-08"]) {
    process.env.OPENAI_IMAGE_MODEL = model;
    globalThis.fetch = async (url, init) => {
      assert.equal(url, "https://api.openai.com/v1/images/edits");
      assert.equal(init.body.get("model"), model);
      assert.equal(init.body.has("input_fidelity"), false);
      assert.equal(init.body.get("quality"), "high");
      assert.equal(init.body.get("size"), "1536x1024");
      assert.equal(init.body.get("output_format"), "jpeg");
      assert.equal(init.body.get("image[]").name, "luxmotion-logo.jpg");
      assert.equal(await init.body.get("image[]").text(), "reference-image");
      assert.equal(new Headers(init.headers).has("Content-Type"), false);
      return response();
    };
    assert.equal((await generateImage({ prompt: "Preserve the logo", reference })).type, "image/jpeg");
  }
});

test("an explicit older model override still receives its supported fidelity setting", async () => {
  for (const model of ["gpt-image-1", "gpt-image-1.5"]) {
    process.env.OPENAI_IMAGE_MODEL = model;
    globalThis.fetch = async (_url, init) => {
      assert.equal(init.body.get("model"), model);
      assert.equal(init.body.get("input_fidelity"), "high");
      return response();
    };
    await generateImage({ prompt: "Logo", reference: new Blob(["logo"], { type: "image/png" }) });
  }
});
