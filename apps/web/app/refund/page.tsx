import { Header } from "@/components/new-landing-page/header";
import { Footer } from "@/components/new-landing-page/footer";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.refund");

  return createPageMetadata({
    title: t("title"),
    description: t("sections.customerCancellation.content"),
    path: "/refund",
    keywords: ["refund policy", "cancellation policy", "easy transfer refund"],
  });
}

export default async function RefundPage() {
  const t = await getTranslations("legal.refund");

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Refund", url: "/refund" },
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
                {t("sections.customerCancellation.title")}
              </h2>
              <p className="text-[16px] leading-relaxed">
                {t("sections.customerCancellation.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.cancellationTerms.title")}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#222] mb-2">
                    {t("sections.cancellationTerms.moreThan48h.title")}
                  </h3>
                  <p className="text-[16px] leading-relaxed">
                    {t("sections.cancellationTerms.moreThan48h.content")}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#222] mb-2">
                    {t("sections.cancellationTerms.between24_48h.title")}
                  </h3>
                  <p className="text-[16px] leading-relaxed">
                    {t("sections.cancellationTerms.between24_48h.content")}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#222] mb-2">
                    {t("sections.cancellationTerms.lessThan24h.title")}
                  </h3>
                  <p className="text-[16px] leading-relaxed">
                    {t("sections.cancellationTerms.lessThan24h.content")}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.originalMethod.title")}
              </h2>
              <p className="text-[16px] leading-relaxed">
                {t("sections.originalMethod.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.companyCancellation.title")}
              </h2>
              <p className="text-[16px] leading-relaxed">
                {t("sections.companyCancellation.content")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.refundTerms.title")}
              </h2>
              <p className="text-[16px] leading-relaxed">
                {t("sections.refundTerms.content")}
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                {t
                  .raw("sections.refundTerms.items")
                  .map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>
              <p className="text-[16px] leading-relaxed mt-4">
                {t("sections.refundTerms.additional")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#222] mb-4">
                {t("sections.processing.title")}
              </h2>
              <p className="text-[16px] leading-relaxed">
                {t("sections.processing.content")}
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
