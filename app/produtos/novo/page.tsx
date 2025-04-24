import { redirect } from "next/navigation"

export default function RedirectPage() {
  redirect("/produtos/novo-produto")
}
