// Run: node --experimental-strip-types --test scripts/test-catalog-translations.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { localizeVehicle, localizeSelection, translatedField } from "../apps/web/lib/catalog-translations.ts";
import { legacyUpsellTranslations, plainText } from "../packages/convex/convex/lib/upsellTranslations.ts";

const locales = ["pt", "en", "de", "nl", "fr", "es"];

test("existing vehicle classes follow all six supported languages", () => {
  const names = ["Van Classe Executiva", "Business Class Van", "Businessklasse-Van", "Businessclass-van", "Van classe affaires", "Van de clase ejecutiva"];
  locales.forEach((locale, index) => {
    const car = localizeVehicle({ name: "Business Class Van", price: 70, passengers: 4 }, locale);
    assert.equal(car.name, names[index]);
    assert.equal(car.price, 70);
    assert.equal(car.passengers, 4);
  });
  assert.equal(localizeVehicle({ name: "Executivo" }, "en").name, "Executive");
  assert.equal(localizeVehicle({ name: "Autocarro" }, "fr").name, "Autocar");
});

test("custom translations override defaults, without translating car models", () => {
  const car = { name: "Business Class Van", examples: "Mercedes V-Class", translations: [{ locale: "pt", name: "Van Executiva" }] };
  assert.equal(localizeVehicle(car, "pt").name, "Van Executiva");
  assert.equal(localizeVehicle(car, "pt").examples, "Mercedes V-Class");
  assert.equal(localizeVehicle({ name: "Mercedes S-Class" }, "es").name, "Mercedes S-Class");
});

test("changing language after selection and session restoration uses original text", () => {
  const car = { name: "Custom vehicle", examples: "Original models", translations: [{ locale: "pt", name: "Carro personalizado", examples: "Modelos PT" }] };
  const restored = JSON.parse(JSON.stringify(localizeVehicle(car, "pt")));
  assert.equal(localizeVehicle(restored, "en").name, "Custom vehicle");
  assert.equal(localizeVehicle(restored, "en").examples, "Original models");
  const extra = { title: "Wine tasting", totalPrice: 55, translations: [{ locale: "pt", title: "Prova de vinhos" }] };
  const restoredExtra = JSON.parse(JSON.stringify(localizeSelection(extra, "pt")));
  assert.equal(localizeSelection(restoredExtra, "en").title, "Wine tasting");
  assert.equal(localizeSelection(restoredExtra, "en").totalPrice, 55);
});

test("missing and blank fields fall back independently, never to another language", () => {
  const translations = [{ locale: "pt", title: "Nome", description: "   " }, { locale: "fr", title: "Nom" }];
  assert.equal(translatedField(translations, "pt", "title", "Name"), "Nome");
  assert.equal(translatedField(translations, "pt", "description", "Original"), "Original");
  assert.equal(translatedField(translations, "de", "title", "Name"), "Name");
  assert.equal(translatedField(undefined, "en", "name", "Original"), "Original");
  assert.equal(translatedField([{ locale: "nl", duration: "Halve dag" }], "nl", "duration", "Meio-dia"), "Halve dag");
});

function legacyContext(tours, translations) {
  const calls = [];
  const ctx = { db: { query(table) {
    calls.push(table);
    return {
      withIndex(name, callback) {
        callback({ eq() { return this; } });
        return this;
      },
      filter(callback) {
        callback({ field: (name) => name, eq: () => true });
        return this;
      },
      async collect() { return table === "tours" ? tours : translations; },
    };
  } } };
  return { ctx, calls };
}

test("migrated stops recover existing titles and rich text descriptions", async () => {
  const { ctx } = legacyContext([{ _id: "tour1" }], [{ locale: "en", title: "Viewpoint", description: { content: [{ type: "paragraph", content: [{ text: "Enjoy the view." }] }] } }]);
  assert.deepEqual(await legacyUpsellTranslations(ctx, "Miradouro", "stops"), [{ locale: "en", title: "Viewpoint", description: "Enjoy the view." }]);
});

test("legacy recovery uses subtitles when available", async () => {
  const { ctx } = legacyContext([{ _id: "tour1" }], [{ locale: "en", title: "Tasting", subtitle: "Short description", description: { content: [{ text: "Long description" }] } }]);
  assert.equal((await legacyUpsellTranslations(ctx, "Prova", "experiences"))[0].description, "Short description");
});

test("missing or ambiguous legacy matches cannot supply unrelated translations", async () => {
  for (const tours of [[], [{ _id: "a" }, { _id: "b" }]]) {
    const { ctx, calls } = legacyContext(tours, [{ locale: "en", title: "Wrong" }]);
    assert.deepEqual(await legacyUpsellTranslations(ctx, "Stop", "stops"), []);
    assert.deepEqual(calls, ["tours"]);
  }
});

test("plain text handles old string descriptions and paragraph boundaries", () => {
  assert.equal(plainText("Original"), "Original");
  assert.equal(plainText(null), "");
  assert.equal(plainText({ content: [{ type: "paragraph", content: [{ text: "One" }] }, { type: "paragraph", content: [{ text: "Two" }] }] }).trim(), "One\nTwo");
});
