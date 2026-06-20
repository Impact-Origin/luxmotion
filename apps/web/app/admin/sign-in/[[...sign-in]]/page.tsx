"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const SERIF = "var(--font-title), 'Cormorant Garamond', serif";

function OfficialLogo() {
  return (
    <div className="flex items-center gap-[10px]">
      <div className="relative flex h-[45px] w-[45px] shrink-0 items-center justify-center border-[1.9px] border-[#C9A96E]">
        <div className="relative h-[13px] w-[23px]">
          <Image src="/svgs/lm-monogram.svg" alt="" fill className="object-contain" priority />
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="relative h-[13px] w-[120px]">
          <Image src="/svgs/luxmotion-text.svg" alt="LuxMotion" fill className="object-contain object-left" priority />
        </div>
        <span className="mt-[4px] whitespace-nowrap text-[10px] tracking-[1.4px] text-[#999]">
          BY EASYTRANSFER
        </span>
      </div>
    </div>
  );
}

export default function Page() {
  const clerk = useSignIn();
  const router = useRouter();
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clerk.isLoaded || loading) return;
    const { signIn, setActive } = clerk;
    setError("");
    setLoading(true);
    try {
      const res = await signIn.create({ identifier, password });
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        router.push("/admin");
        return;
      }
      setError("Não foi possível concluir o início de sessão.");
    } catch (err) {
      const msg =
        (err as { errors?: { longMessage?: string; message?: string }[] })?.errors?.[0]
          ?.longMessage ?? "Utilizador ou palavra-passe inválidos.";
      setError(msg);
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen w-full bg-[#14110c] text-[#f3ecdd]">
      {/* Image panel */}
      <div className="relative hidden w-[46%] max-w-[640px] overflow-hidden lg:block">
        <Image src="/interior.png" alt="" fill priority sizes="46vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0f0c08] via-[#0f0c08]/55 to-[#0f0c08]/25" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(120% 80% at 28% 18%, rgba(201,169,110,0.12), transparent 60%)" }}
        />
        <div aria-hidden className="absolute inset-y-0 right-0 w-px bg-[rgba(201,169,110,0.20)]" />

        <div className="absolute left-10 top-10">
          <OfficialLogo />
        </div>

        <div className="absolute bottom-10 left-10 right-10">
          <div aria-hidden className="mb-5 h-px w-12 bg-[#C9A96E]" />
          <h2 className="text-[34px] leading-[1.12] text-white" style={{ fontFamily: SERIF }}>
            Conduzimos cada <span className="italic text-[#C9A96E]">detalhe</span>.
          </h2>
          <p className="mt-3 max-w-[380px] text-[14px] leading-relaxed text-[rgba(255,255,255,0.6)]">
            Painel de administração LuxMotion — frota, reservas, parcerias e conteúdos.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-[#C9A96E]/[0.06] blur-3xl"
        />
        <div className="relative w-full max-w-[400px]">
          <div className="mb-9 flex justify-center lg:hidden">
            <OfficialLogo />
          </div>

          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#C9A96E]">Acesso reservado</p>
            <h1 className="mt-2 text-[32px] leading-tight text-white" style={{ fontFamily: SERIF }}>
              Iniciar sessão
            </h1>
            <p className="mt-1.5 text-[14px] text-[rgba(255,255,255,0.5)]">
              Introduza as suas credenciais de administrador.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <label
                htmlFor="identifier"
                className="block text-[12px] font-medium uppercase tracking-[1px] text-[rgba(255,255,255,0.55)]"
              >
                Utilizador
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                autoFocus
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="O seu utilizador"
                className="h-12 w-full rounded-lg border border-[rgba(201,169,110,0.22)] bg-[rgba(255,255,255,0.03)] px-4 text-[15px] text-white outline-none transition placeholder:text-[rgba(255,255,255,0.3)] focus:border-[#C9A96E] focus:bg-[rgba(255,255,255,0.05)] focus:ring-2 focus:ring-[rgba(201,169,110,0.25)]"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-[12px] font-medium uppercase tracking-[1px] text-[rgba(255,255,255,0.55)]"
              >
                Palavra-passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-lg border border-[rgba(201,169,110,0.22)] bg-[rgba(255,255,255,0.03)] px-4 pr-11 text-[15px] text-white outline-none transition placeholder:text-[rgba(255,255,255,0.3)] focus:border-[#C9A96E] focus:bg-[rgba(255,255,255,0.05)] focus:ring-2 focus:ring-[rgba(201,169,110,0.25)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Esconder palavra-passe" : "Mostrar palavra-passe"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.4)] transition hover:text-[#C9A96E]"
                >
                  {showPw ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-[rgba(190,80,60,0.35)] bg-[rgba(190,80,60,0.10)] px-3 py-2.5 text-[13px] text-[#e7a596]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !clerk.isLoaded}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#C9A96E] text-[14px] font-semibold uppercase tracking-[1px] text-[#1a1510] transition hover:bg-[#d4b87f] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "A entrar…" : "Entrar"}
            </button>
          </form>

          <p className="mt-8 text-center text-[12px] text-[rgba(255,255,255,0.35)]">
            Acesso reservado à equipa LuxMotion.
          </p>
        </div>
      </div>
    </div>
  );
}
