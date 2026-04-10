import { Header } from "@/components/new-landing-page/header";
import { Footer } from "@/components/new-landing-page/footer";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.privacy");

  return createPageMetadata({
    title: t("title"),
    description: t("sections.introduction.content"),
    path: "/privacy-policy",
    keywords: ["privacy policy", "data protection", "gdpr"],
  });
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("legal.privacy");

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Privacy Policy", url: "/privacy-policy" },
        ])}
      />
      <Header />
      <div className="pt-[40px] md:pt-[40px]">
        <main className="max-w-4xl mx-auto px-4 md:px-8 lg:px-[60px] xl:px-[100px] py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-[#222] mb-8">
            {t("title")}
          </h1>

          <div className="prose prose-lg max-w-none text-[#404040] space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.introduction.title")}
              </h2>
              <p className="text-[16px] leading-relaxed">
                {t("sections.introduction.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.informationCollected.title")}
              </h2>
              <p className="text-[16px] leading-relaxed mb-2">
                {t("sections.informationCollected.content")}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                {t
                  .raw("sections.informationCollected.items")
                  .map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.howWeUse.title")}
              </h2>
              <p className="text-[16px] leading-relaxed mb-2">
                {t("sections.howWeUse.content")}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                {t
                  .raw("sections.howWeUse.items")
                  .map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.sharing.title")}
              </h2>
              <p className="text-[16px] leading-relaxed">
                {t("sections.sharing.content")}
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                {t
                  .raw("sections.sharing.items")
                  .map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.security.title")}
              </h2>
              <p className="text-[16px] leading-relaxed">
                {t("sections.security.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.rights.title")}
              </h2>
              <p className="text-[16px] leading-relaxed mb-2">
                {t("sections.rights.content")}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                {t
                  .raw("sections.rights.items")
                  .map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.cookies.title")}
              </h2>
              <p className="text-[16px] leading-relaxed">
                {t("sections.cookies.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.contact.title")}
              </h2>
              <p className="text-[16px] leading-relaxed">
                {t("sections.contact.content")}
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Email: geral@easytransferericeira.com</li>
                <li>Telefone: +351 963 650 278</li>
              </ul>
            </section>

            <section className="pt-4">
              <p className="text-[14px] text-[#808080]">
                {t("lastUpdated")}:{" "}
                {new Date().toLocaleDateString("pt-PT", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
