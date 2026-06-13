import { SignIn } from "@clerk/nextjs";

const SERIF = "var(--font-title), 'Cormorant Garamond', serif";

export default function Page() {
  const year = new Date().getFullYear();

  return (
    <div className="relative flex min-h-screen w-full bg-[#f6f1e9] text-[#211c16]">
      {/* Brand panel (desktop) */}
      <div className="relative hidden w-[44%] max-w-[560px] flex-col justify-between overflow-hidden border-r border-[#e7ddca] bg-[#fffdf9] p-12 lg:flex">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#C9A96E]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#C9A96E]/[0.07] blur-3xl" />

        <div className="relative flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-md border border-[#d8c7a3] bg-[#A08248]/[0.08] text-[#A08248]"
            style={{ fontFamily: SERIF }}
          >
            <span className="text-[20px] leading-none">LM</span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[22px] text-[#211c16]" style={{ fontFamily: SERIF }}>
              LuxMotion
            </span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-[3px] text-[#A08248]">
              By EasyTransfer
            </span>
          </span>
        </div>

        <div className="relative">
          <div aria-hidden className="mb-5 h-px w-12 bg-[#C9A96E]" />
          <h2 className="max-w-[420px] text-[42px] leading-[1.08] text-[#211c16]" style={{ fontFamily: SERIF }}>
            Painel de <span className="italic text-[#A08248]">administração</span>
          </h2>
          <p className="mt-5 max-w-[380px] text-[15px] leading-relaxed text-[#6b6358]">
            Acesso reservado à equipa LuxMotion. Inicie sessão para gerir frota, reservas,
            parcerias e conteúdos do site.
          </p>
        </div>

        <div className="relative text-[11px] uppercase tracking-[2px] text-[#a99e8c]">
          © {year} LuxMotion · EasyTransfer
        </div>
      </div>

      {/* Sign-in */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-[420px]">
          {/* Brand (mobile) */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-md border border-[#d8c7a3] bg-[#A08248]/[0.08] text-[#A08248]"
              style={{ fontFamily: SERIF }}
            >
              <span className="text-[18px] leading-none">LM</span>
            </span>
            <span className="text-[20px] text-[#211c16]" style={{ fontFamily: SERIF }}>
              LuxMotion
            </span>
          </div>

          <div className="mb-7">
            <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#A08248]">Acesso seguro</p>
            <h1 className="mt-2 text-[31px] leading-tight text-[#211c16]" style={{ fontFamily: SERIF }}>
              Bem-vindo de volta
            </h1>
            <p className="mt-1.5 text-[14px] text-[#6b6358]">
              Inicie sessão na sua conta de administrador.
            </p>
          </div>

          <SignIn
            path="/admin/sign-in"
            appearance={{
              variables: {
                colorPrimary: "#A08248",
                colorText: "#211c16",
                colorTextSecondary: "#6b6358",
                colorBackground: "#ffffff",
                colorInputBackground: "#ffffff",
                colorInputText: "#211c16",
                colorDanger: "#b4452f",
                borderRadius: "0.6rem",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "15px",
              },
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-none",
                card: "w-full gap-6 rounded-2xl border border-[#e7ddca] bg-white px-7 py-7 shadow-[0_12px_40px_rgba(160,130,72,0.08)]",
                header: "hidden",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border-[#e2d7c1] text-[#211c16] hover:bg-[#f6f1e9] normal-case",
                socialButtonsBlockButtonText: "font-medium",
                dividerLine: "bg-[#e7ddca]",
                dividerText: "text-[#8a8074]",
                formFieldLabel: "text-[#4a443c] font-medium",
                formFieldInput:
                  "border-[#e2d7c1] bg-white text-[#211c16] focus:border-[#A08248] focus:ring-2 focus:ring-[#A08248]/25",
                formButtonPrimary:
                  "bg-[#C9A96E] text-[#1a1510] hover:bg-[#bb9a5b] active:bg-[#ad8d4f] text-[14px] font-semibold normal-case shadow-none",
                formFieldInputShowPasswordButton: "text-[#8a8074] hover:text-[#211c16]",
                footerActionLink: "text-[#A08248] hover:text-[#8a6a30] font-medium",
                identityPreviewEditButton: "text-[#A08248]",
                footer: "hidden",
              },
            }}
          />

          <p className="mt-6 text-center text-[12px] text-[#a99e8c]">
            Problemas a aceder? Contacte o administrador do sistema.
          </p>
        </div>
      </div>
    </div>
  );
}
