// Run: node --experimental-strip-types --test scripts/test-corporate-translations.mjs
import assert from "node:assert/strict"
import { test } from "node:test"
import { createRequire } from "node:module"
import { readFileSync, existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { CORPORATE_LANGUAGES, localizeCorporateExperience } from "../packages/convex/convex/lib/corporateExperienceTranslations.ts"

const root = fileURLToPath(new URL("../", import.meta.url))
const convexRequire = createRequire(resolve(root, "packages/convex/package.json"))
const ts = convexRequire("typescript")
const registration = convexRequire("convex/server")

// Load the real registered functions without starting a deployment or writing data remotely.
function loadModule(path) {
  const output = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const module = { exports: {} }
  const localRequire = (specifier) => {
    if (specifier === "./_generated/server") return { query: registration.queryGeneric, mutation: registration.mutationGeneric }
    if (!specifier.startsWith(".")) return convexRequire(specifier)
    const base = resolve(dirname(path), specifier)
    return loadModule(existsSync(base) ? base : `${base}.ts`)
  }
  new Function("require", "module", "exports", output)(localRequire, module, module.exports)
  return module.exports
}
const api = loadModule(resolve(root, "packages/convex/convex/corporateExperiences.ts"))

const source = {
  _id: "experience1", _creationTime: 1,
  titlePrefix: "Lisboa Vintage", titleAccent: "Desafio Polaroid",
  shortDescription: "Descubra Lisboa.", duration: "halfDay", pillar: "experiences",
  subcategory: "teambuilding", groupSize: "10–80 pessoas", durationLabel: "2–3 horas",
  location: "Lisboa, Portugal", description: "Uma experiência em Lisboa.",
  experienceBody: "Explore a cidade.\n\nCrie memórias.",
  experienceItems: [{ strong: "Fotografia", body: "Conheça Lisboa." }],
  routeHighlights: ["Baixa"], whatsIncluded: ["Guia"],
  coverImageId: "cover1", galleryImageIds: ["gallery1"], status: "published",
  sortOrder: 0, createdAt: 1, updatedAt: 1,
}

function context(experiences = [source]) {
  let sequence = 0
  const tables = {
    corporateExperiences: structuredClone(experiences),
    corporateExperienceTranslations: [],
  }
  const find = (id) => Object.values(tables).flat().find((row) => row._id === id)
  const ctx = {
    db: {
      query(table) {
        let selected = tables[table]
        assert.ok(selected, `Unknown table ${table}`)
        return {
          withIndex(_name, callback) {
            callback({ eq(field, value) {
              selected = selected.filter((row) => row[field] === value)
              return this
            } })
            return this
          },
          async collect() { return structuredClone(selected) },
          async first() { return structuredClone(selected[0] ?? null) },
        }
      },
      async get(id) { return structuredClone(find(id) ?? null) },
      async insert(table, data) {
        const id = `${table}-${++sequence}`
        tables[table].push({ ...structuredClone(data), _id: id, _creationTime: 2 })
        return id
      },
      async patch(id, data) {
        const row = find(id)
        for (const [key, value] of Object.entries(data)) {
          if (value === undefined) delete row[key]
          else row[key] = structuredClone(value)
        }
      },
      async replace(id, data) {
        const row = find(id)
        const metadata = { _id: row._id, _creationTime: row._creationTime }
        Object.keys(row).forEach((key) => delete row[key])
        Object.assign(row, structuredClone(data), metadata)
      },
      async delete(id) {
        for (const table of Object.keys(tables)) tables[table] = tables[table].filter((row) => row._id !== id)
      },
    },
    storage: { async getUrl(id) { return `https://images.test/${id}` }, async delete() {} },
  }
  return { ctx, tables }
}
const run = (name, ctx, args) => api[name]._handler(ctx, args)

test("the public cards and drawer receive every translated text field in all supported languages", async () => {
  const { ctx } = context()
  for (const { value: locale } of CORPORATE_LANGUAGES.filter((language) => language.value !== "pt")) {
    const translation = {
      experienceId: source._id, locale,
      titlePrefix: `${locale} title`, titleAccent: `${locale} accent`, shortDescription: `${locale} preview`,
      groupSize: `${locale} people`, durationLabel: `${locale} duration`, location: `${locale} location`,
      description: `${locale} overview`, experienceBody: `${locale} paragraphs`,
      experienceItems: [{ strong: `${locale} strong`, body: `${locale} body` }],
      routeHighlights: [`${locale} route`], whatsIncluded: [`${locale} included`],
    }
    await run("upsertTranslation", ctx, translation)
    const [translated] = await run("listPublished", ctx, { locale })
    for (const field of Object.keys(translation).filter((key) => !["experienceId", "locale"].includes(key))) {
      assert.deepEqual(translated[field], translation[field], `${locale}: ${field}`)
    }
    assert.equal(translated.duration, source.duration)
    assert.equal(translated.subcategory, source.subcategory)
    assert.equal(translated.coverImageUrl, "https://images.test/cover1")
    assert.deepEqual(translated.galleryImageUrls, ["https://images.test/gallery1"])
  }
  assert.equal((await run("listPublished", ctx, { locale: "pt" }))[0].titlePrefix, source.titlePrefix)
  assert.deepEqual(await ctx.db.get(source._id), source)
})

test("saving, updating and removing a language keeps admin metadata current and source text intact", async () => {
  const { ctx } = context()
  const id = await run("upsertTranslation", ctx, { experienceId: source._id, locale: "en", titlePrefix: "Lisbon Vintage", description: "English overview" })
  assert.equal((await run("getTranslation", ctx, { experienceId: source._id, locale: "en" }))._id, id)
  const admin = await run("get", ctx, { id: source._id })
  assert.deepEqual(admin.availableLanguages, ["pt", "en"])
  assert.equal(admin.titlePrefix, source.titlePrefix)
  const page = await run("listPaged", ctx, { page: 0, pageSize: 10 })
  assert.deepEqual(page.rows[0].availableLanguages, ["pt", "en"])
  assert.equal(await run("upsertTranslation", ctx, { experienceId: source._id, locale: "en", titlePrefix: "Lisbon Updated" }), id)
  const [updated] = await run("listPublished", ctx, { locale: "en" })
  assert.equal(updated.titlePrefix, "Lisbon Updated")
  assert.equal(updated.description, source.description)
  await run("removeTranslation", ctx, { experienceId: source._id, locale: "en" })
  assert.equal(await run("getTranslation", ctx, { experienceId: source._id, locale: "en" }), null)
  assert.deepEqual((await run("get", ctx, { id: source._id })).availableLanguages, ["pt"])
  assert.equal((await run("listPublished", ctx, { locale: "en" }))[0].titlePrefix, source.titlePrefix)
})

test("missing and blank fields fall back to the original language independently", async () => {
  const { ctx } = context([source, { ...source, _id: "draft1", status: "draft" }])
  await run("upsertTranslation", ctx, { experienceId: source._id, locale: "fr", titlePrefix: "Lisbonne", description: "   " })
  const [fr] = await run("listPublished", ctx, { locale: "fr" })
  assert.equal(fr.titlePrefix, "Lisbonne")
  assert.equal(fr.description, source.description)
  assert.deepEqual(fr.experienceItems, source.experienceItems)
  const de = await run("listPublished", ctx, { locale: "de" })
  assert.equal(de.length, 1)
  assert.equal(de[0].titlePrefix, source.titlePrefix)
  assert.equal((await run("listPublished", ctx, {}))[0].titlePrefix, source.titlePrefix)
  assert.equal(localizeCorporateExperience(source, { locale: "fr", titlePrefix: "Wrong" }, "de").titlePrefix, source.titlePrefix)
})

test("translation writes validate language, source language, parent and title", async () => {
  const { ctx } = context()
  const args = { experienceId: source._id, locale: "en", titlePrefix: "Lisbon" }
  await assert.rejects(run("upsertTranslation", ctx, { ...args, locale: "pt" }), /original language/)
  await assert.rejects(run("upsertTranslation", ctx, { ...args, locale: "xx" }), /Unsupported/)
  await assert.rejects(run("upsertTranslation", ctx, { ...args, experienceId: "missing" }), /not found/)
  await assert.rejects(run("upsertTranslation", ctx, { ...args, titlePrefix: "  " }), /Title/)
  await run("upsertTranslation", ctx, args)
  await assert.rejects(run("update", ctx, { id: source._id, originalLanguage: "en" }), /Remove the translation/)
})

test("new experiences can choose a different source language and default safely to Portuguese", async () => {
  const { ctx } = context([])
  const { _id, _creationTime, createdAt, updatedAt, ...fields } = source
  const en = await run("create", ctx, { ...fields, originalLanguage: "en" })
  await run("upsertTranslation", ctx, { experienceId: en, locale: "pt", titlePrefix: "Título português" })
  assert.equal((await run("listPublished", ctx, { locale: "pt" }))[0].titlePrefix, "Título português")
  assert.equal((await run("listPublished", ctx, { locale: "en" }))[0].titlePrefix, source.titlePrefix)
  const pt = await run("create", ctx, fields)
  assert.equal((await ctx.db.get(pt)).originalLanguage, "pt")
})

test("deleting an experience removes its translations and keeps other experiences intact", async () => {
  const { ctx, tables } = context([source, { ...source, _id: "experience2" }])
  for (const experienceId of [source._id, "experience2"]) {
    await run("upsertTranslation", ctx, { experienceId, locale: "en", titlePrefix: "English" })
  }
  await run("remove", ctx, { id: source._id })
  assert.equal(await ctx.db.get(source._id), null)
  assert.equal(tables.corporateExperienceTranslations.length, 1)
  assert.equal(tables.corporateExperienceTranslations[0].experienceId, "experience2")
})
