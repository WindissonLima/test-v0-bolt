import { redirect } from "next/navigation"

// Redirecionar a página inicial para o dashboard
export default function HomePage() {
  redirect("/produtos/meus-produtos")
}
