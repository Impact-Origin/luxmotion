import { Header } from "@/components/new-landing-page/header";
import { Footer } from "@/components/new-landing-page/footer";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.termsAndConditions");

  return createPageMetadata({
    title: t("title"),
    description: t("sections.acceptance.content"),
    path: "/terms-and-conditions",
    keywords: ["terms and conditions", "booking policy", "easy transfer terms"],
  });
}

export default async function TermsAndConditionsPage() {
  const t = await getTranslations("legal.termsAndConditions");

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Terms and Conditions", url: "/terms-and-conditions" },
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
                {t("sections.acceptance.title")}
              </h2>
              <p className="text-[16px] leading-relaxed">
                {t("sections.acceptance.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.services.title")}
              </h2>
              <p className="text-[16px] leading-relaxed">
                {t("sections.services.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.bookings.title")}
              </h2>
              <p className="text-[16px] leading-relaxed">
                {t("sections.bookings.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.cancellations.title")}
              </h2>
              <p className="text-[16px] leading-relaxed">
                {t("sections.cancellations.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.responsibilities.title")}
              </h2>
              <p className="text-[16px] leading-relaxed">
                {t("sections.responsibilities.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.modifications.title")}
              </h2>
              <p className="text-[16px] leading-relaxed">
                {t("sections.modifications.content")}
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
