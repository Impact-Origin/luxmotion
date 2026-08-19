import { createNavigation } from "next-intl/navigation"
import { routing } from "./routing"

/**
 * Substitui `next/link` e `next/navigation` em tudo o que é público.
 *
 * A diferença é que estes já sabem o idioma: um href="/tours" clicado a partir
 * de /pt/blogs vai para /pt/tours, em vez de saltar para o inglês ou obrigar o
 * middleware a fazer um reencaminhamento extra a cada clique.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
