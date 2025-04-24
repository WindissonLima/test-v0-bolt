import { redirect } from "next/navigation"

// Redirecionar /produtos para a página de lista de produtos
export default function ProdutosPage() {
  redirect("/produtos/meus-produtos")
}
