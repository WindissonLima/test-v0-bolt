"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { BoxIcon, ImageIcon, PlusIcon, SearchIcon, Trash2Icon, XIcon, CheckIcon, PlusCircleIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

// Dados fictícios para categorias
const categorias = [
  { value: "eletronicos", label: "Eletrônicos" },
  { value: "computadores", label: "Computadores" },
  { value: "perifericos", label: "Periféricos" },
  { value: "celulares", label: "Celulares" },
  { value: "tablets", label: "Tablets" },
  { value: "audio", label: "Áudio" },
  { value: "tvs", label: "TVs" },
  { value: "cameras", label: "Câmeras" },
  { value: "escritorio", label: "Escritório" },
  { value: "gaming", label: "Gaming" },
]

// Modificar a lista de atributos para incluir "Numeração"
const atributos = [
  { value: "cor", label: "Cor" },
  { value: "tamanho", label: "Tamanho" },
  { value: "material", label: "Material" },
  { value: "capacidade", label: "Capacidade" },
  { value: "potencia", label: "Potência" },
  { value: "numeracao", label: "Numeração" },
]

// Adicionar valores para o atributo "numeracao" e garantir que os valores para "tamanho" estejam corretos
const valoresAtributos = {
  cor: [
    { value: "preto", label: "Preto" },
    { value: "branco", label: "Branco" },
    { value: "azul", label: "Azul" },
    { value: "vermelho", label: "Vermelho" },
    { value: "verde", label: "Verde" },
  ],
  tamanho: [
    { value: "p", label: "P" },
    { value: "m", label: "M" },
    { value: "g", label: "G" },
    { value: "gg", label: "GG" },
  ],
  material: [
    { value: "plastico", label: "Plástico" },
    { value: "metal", label: "Metal" },
    { value: "vidro", label: "Vidro" },
    { value: "madeira", label: "Madeira" },
  ],
  capacidade: [
    { value: "128gb", label: "128GB" },
    { value: "256gb", label: "256GB" },
    { value: "512gb", label: "512GB" },
    { value: "1tb", label: "1TB" },
  ],
  potencia: [
    { value: "500w", label: "500W" },
    { value: "750w", label: "750W" },
  ],
  numeracao: [
    { value: "33", label: "33" },
    { value: "34", label: "34" },
    { value: "35", label: "35" },
    { value: "36", label: "36" },
    { value: "37", label: "37" },
    { value: "38", label: "38" },
    { value: "39", label: "39" },
    { value: "40", label: "40" },
    { value: "41", label: "41" },
    { value: "42", label: "42" },
    { value: "43", label: "43" },
    { value: "44", label: "44" },
  ],
}

// Dados fictícios para estoque (substitua por dados reais)
const estoques = [
  { id: "1", nome: "Loja Física" },
  { id: "2", nome: "Depósito" },
]

// Dados fictícios para tabelas de preço
const tabelasPreco = [
  { id: "1", nome: "Tabela Padrão" },
  { id: "2", nome: "Tabela Atacado" },
  { id: "3", nome: "Tabela Varejo" },
  { id: "4", nome: "Tabela Promocional" },
  { id: "5", nome: "Tabela Black Friday" },
  { id: "6", nome: "Tabela Especial" },
]

// Schema de validação do formulário
const formSchema = z.object({
  foto: z.string().optional(),
  nome: z.string().min(3, {
    message: "O nome do produto deve ter pelo menos 3 caracteres.",
  }),
  codigo: z.string().min(1, {
    message: "O código do produto é obrigatório.",
  }),
  ncm: z.string().optional(),
  gtin: z.string().optional(),
  codigoBarras: z.string().optional(),
  categorias: z.array(z.string()).min(1, {
    message: "Selecione pelo menos uma categoria.",
  }),
  temVariacoes: z.boolean().default(false),
  atributos: z
    .array(
      z.object({
        nome: z.string(),
        valores: z.array(z.string()).min(1, {
          message: "Adicione pelo menos um valor para o atributo.",
        }),
      }),
    )
    .optional(),
  variacoes: z
    .array(
      z.object({
        nome: z.string(),
        codigo: z.string().optional(),
      }),
    )
    .optional(),
  tabelasPreco: z
    .array(
      z.object({
        id: z.string(),
        nome: z.string(),
        precoCusto: z.string().optional(),
        precoVenda: z.string().optional(),
      }),
    )
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

export function NewProductForm() {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([])
  const [openCategoryPopover, setOpenCategoryPopover] = React.useState(false)
  const [selectedAtributo, setSelectedAtributo] = React.useState<string | null>(null)
  const [openAtributoPopover, setOpenAtributoPopover] = React.useState(false)
  const [editingAtributo, setEditingAtributo] = React.useState<string | null>(null)
  const [selectedValorAtributo, setSelectedValorAtributo] = React.useState<string | null>(null)
  const [openValorAtributoPopover, setOpenValorAtributoPopover] = React.useState(false)
  const [atributosAdicionados, setAtributosAdicionados] = React.useState<Array<{ nome: string; valores: string[] }>>([])
  const [variacoes, setVariacoes] = React.useState<Array<{ nome: string; codigo: string }>>([])
  const [selectedVariacao, setSelectedVariacao] = React.useState<string | null>(null)
  const [openEstoqueDialog, setOpenEstoqueDialog] = React.useState(false)
  const [imageSrc, setImageSrc] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [tabelasPrecoSelecionadas, setTabelasPrecoSelecionadas] = React.useState<
    Array<{ id: string; nome: string; precoCusto: string; precoVenda: string }>
  >([])
  const [selectedTabelaPreco, setSelectedTabelaPreco] = React.useState<string | null>(null)
  const [openTabelaPrecoPopover, setOpenTabelaPrecoPopover] = React.useState(false)

  // Inicializar o formulário com react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      codigo: "",
      ncm: "",
      gtin: "",
      codigoBarras: "",
      categorias: [],
      temVariacoes: false,
      atributos: [],
      variacoes: [],
      tabelasPreco: [],
    },
  })

  // Função para adicionar categoria
  const addCategory = (category: string) => {
    if (!selectedCategories.includes(category)) {
      const newCategories = [...selectedCategories, category]
      setSelectedCategories(newCategories)
      form.setValue("categorias", newCategories)
    }
    setOpenCategoryPopover(false)
  }

  // Função para remover categoria
  const removeCategory = (category: string) => {
    const newCategories = selectedCategories.filter((c) => c !== category)
    setSelectedCategories(newCategories)
    form.setValue("categorias", newCategories)
  }

  // Função para adicionar atributo
  const addAtributo = () => {
    if (selectedAtributo && !atributosAdicionados.some((a) => a.nome === selectedAtributo)) {
      const newAtributos = [...atributosAdicionados, { nome: selectedAtributo, valores: [] }]
      setAtributosAdicionados(newAtributos)
      form.setValue("atributos", newAtributos)
      setSelectedAtributo(null)
    }
    setOpenAtributoPopover(false)
  }

  // Função para adicionar valor ao atributo
  const addValorAtributo = (atributoNome: string, valorSelecionado: string) => {
    if (valorSelecionado) {
      const atributoIndex = atributosAdicionados.findIndex((a) => a.nome === atributoNome)
      if (atributoIndex !== -1 && !atributosAdicionados[atributoIndex].valores.includes(valorSelecionado)) {
        const newAtributos = [...atributosAdicionados]
        newAtributos[atributoIndex].valores.push(valorSelecionado)
        setAtributosAdicionados(newAtributos)
        form.setValue("atributos", newAtributos)

        // Gerar variações automaticamente
        gerarVariacoes(newAtributos)
      }
    }
    setSelectedValorAtributo(null)
    setOpenValorAtributoPopover(false)
  }

  // Função para remover valor do atributo
  const removeValorAtributo = (atributoNome: string, valor: string) => {
    const atributoIndex = atributosAdicionados.findIndex((a) => a.nome === atributoNome)
    if (atributoIndex !== -1) {
      const newAtributos = [...atributosAdicionados]
      newAtributos[atributoIndex].valores = newAtributos[atributoIndex].valores.filter((v) => v !== valor)
      setAtributosAdicionados(newAtributos)
      form.setValue("atributos", newAtributos)

      // Gerar variações automaticamente
      gerarVariacoes(newAtributos)
    }
  }

  // Função para remover atributo
  const removeAtributo = (atributoNome: string) => {
    const newAtributos = atributosAdicionados.filter((a) => a.nome !== atributoNome)
    setAtributosAdicionados(newAtributos)
    form.setValue("atributos", newAtributos)

    // Gerar variações automaticamente
    gerarVariacoes(newAtributos)
  }

  // Função para gerar todas as combinações possíveis de variações
  const gerarVariacoes = (atributos: Array<{ nome: string; valores: string[] }>) => {
    if (atributos.length === 0 || atributos.some((a) => a.valores.length === 0)) {
      setVariacoes([])
      form.setValue("variacoes", [])
      return
    }

    // Função recursiva para gerar combinações
    const gerarCombinacoes = (
      atributos: Array<{ nome: string; valores: string[] }>,
      index: number,
      atual: { [key: string]: string },
      resultado: Array<{ nome: string; codigo: string }>,
    ) => {
      if (index === atributos.length) {
        // Construir o nome da variação
        const nome = Object.entries(atual)
          .map(([atributo, valor]) => {
            // Encontrar o label do valor
            const atributoObj = atributos.find((a) => a.nome === atributo)
            const valorObj = valoresAtributos[atributo as keyof typeof valoresAtributos]?.find((v) => v.value === valor)
            return `${valorObj?.label || valor}`
          })
          .join(" / ")

        resultado.push({ nome, codigo: "" })
        return
      }

      const atributo = atributos[index]
      for (const valor of atributo.valores) {
        atual[atributo.nome] = valor
        gerarCombinacoes(atributos, index + 1, atual, resultado)
      }
    }

    const novasVariacoes: Array<{ nome: string; codigo: string }> = []
    gerarCombinacoes(atributos, 0, {}, novasVariacoes)

    // Preservar códigos existentes
    const variacoesAtualizadas = novasVariacoes.map((novaVar) => {
      const existente = variacoes.find((v) => v.nome === novaVar.nome)
      return existente ? existente : novaVar
    })

    setVariacoes(variacoesAtualizadas)
    form.setValue("variacoes", variacoesAtualizadas)
  }

  // Função para atualizar o código de uma variação
  const atualizarCodigoVariacao = (nome: string, codigo: string) => {
    const novasVariacoes = variacoes.map((v) => (v.nome === nome ? { ...v, codigo } : v))
    setVariacoes(novasVariacoes)
    form.setValue("variacoes", novasVariacoes)
  }

  // Função para lidar com o upload de imagem
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImageSrc(result)
        form.setValue("foto", result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Função para abrir o seletor de arquivo
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Função para adicionar tabela de preço
  const addTabelaPreco = (tabelaId: string) => {
    const tabela = tabelasPreco.find((t) => t.id === tabelaId)
    if (tabela && !tabelasPrecoSelecionadas.some((t) => t.id === tabelaId)) {
      const novaTabelaPreco = {
        id: tabela.id,
        nome: tabela.nome,
        precoCusto: "",
        precoVenda: "",
      }
      const novasTabelasPreco = [...tabelasPrecoSelecionadas, novaTabelaPreco]
      setTabelasPrecoSelecionadas(novasTabelasPreco)
      form.setValue("tabelasPreco", novasTabelasPreco)
    }
    setSelectedTabelaPreco(null)
    setOpenTabelaPrecoPopover(false)
  }

  // Função para remover tabela de preço
  const removeTabelaPreco = (tabelaId: string) => {
    const novasTabelasPreco = tabelasPrecoSelecionadas.filter((t) => t.id !== tabelaId)
    setTabelasPrecoSelecionadas(novasTabelasPreco)
    form.setValue("tabelasPreco", novasTabelasPreco)
  }

  // Função para atualizar preço de custo
  const atualizarPrecoCusto = (tabelaId: string, valor: string) => {
    const novasTabelasPreco = tabelasPrecoSelecionadas.map((t) => (t.id === tabelaId ? { ...t, precoCusto: valor } : t))
    setTabelasPrecoSelecionadas(novasTabelasPreco)
    form.setValue("tabelasPreco", novasTabelasPreco)
  }

  // Função para atualizar preço de venda
  const atualizarPrecoVenda = (tabelaId: string, valor: string) => {
    const novasTabelasPreco = tabelasPrecoSelecionadas.map((t) => (t.id === tabelaId ? { ...t, precoVenda: valor } : t))
    setTabelasPrecoSelecionadas(novasTabelasPreco)
    form.setValue("tabelasPreco", novasTabelasPreco)
  }

  // Função para formatar valor como moeda
  const formatarMoeda = (valor: string) => {
    if (!valor) return ""

    // Remove caracteres não numéricos
    const apenasNumeros = valor.replace(/\D/g, "")

    // Converte para número e divide por 100 para obter o valor em reais
    const valorNumerico = Number.parseFloat(apenasNumeros) / 100

    // Formata como moeda brasileira
    return valorNumerico.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    })
  }

  // Função para converter entrada de moeda
  const converterEntradaMoeda = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove caracteres não numéricos
    const apenasNumeros = e.target.value.replace(/\D/g, "")

    // Converte para número e divide por 100 para obter o valor em reais
    const valorNumerico = Number.parseFloat(apenasNumeros || "0") / 100

    // Formata como moeda brasileira
    return valorNumerico.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    })
  }

  // Função para enviar o formulário
  function onSubmit(data: FormValues) {
    toast.success("Produto adicionado com sucesso!")
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Informações Básicas em um único card */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Preencha as informações essenciais do produto.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Coluna 1 */}
              <div className="space-y-4">
                {/* Upload de Foto */}
                <FormField
                  control={form.control}
                  name="foto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foto do Produto</FormLabel>
                      <FormControl>
                        <div
                          className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-md border border-dashed border-input bg-muted/20 transition-colors hover:bg-muted/30"
                          onClick={triggerFileInput}
                        >
                          {imageSrc ? (
                            <img
                              src={imageSrc || "/placeholder.svg"}
                              alt="Preview"
                              className="h-full w-full rounded-md object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <ImageIcon className="mb-2 h-8 w-8" />
                              <span className="text-xs">Clique para adicionar</span>
                            </div>
                          )}
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nome do Produto */}
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Produto</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome do produto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Código do Produto */}
                <FormField
                  control={form.control}
                  name="codigo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código do Produto</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o código do produto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Coluna 2 */}
              <div className="space-y-4">
                {/* NCM */}
                <FormField
                  control={form.control}
                  name="ncm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NCM</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o NCM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* GTIN */}
                <FormField
                  control={form.control}
                  name="gtin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GTIN</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o GTIN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Código de barras */}
                <FormField
                  control={form.control}
                  name="codigoBarras"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de barras</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o código de barras" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Categorias */}
                <FormField
                  control={form.control}
                  name="categorias"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categorias</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Popover open={openCategoryPopover} onOpenChange={setOpenCategoryPopover}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openCategoryPopover}
                                className="w-full justify-between"
                              >
                                Selecionar categoria
                                <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Buscar categoria..." />
                                <CommandList>
                                  <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                                  <CommandGroup>
                                    {categorias.map((categoria) => (
                                      <CommandItem key={categoria.value} onSelect={() => addCategory(categoria.value)}>
                                        {categoria.label}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          {/* Lista de categorias selecionadas */}
                          <div className="flex flex-wrap gap-2">
                            {selectedCategories.map((category) => {
                              const categoryLabel = categorias.find((c) => c.value === category)?.label || category
                              return (
                                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                                  {categoryLabel}
                                  <XIcon className="h-3 w-3 cursor-pointer" onClick={() => removeCategory(category)} />
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção de Variações - Fora do card, diretamente na tela */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium">Variações do Produto</h2>
            <p className="text-sm text-muted-foreground">Configure se o produto possui variações e seus atributos.</p>
          </div>

          {/* Tem Variações */}
          <FormField
            control={form.control}
            name="temVariacoes"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Produto com variações</FormLabel>
                  <FormDescription>
                    Ative se o produto possuir diferentes variações (cor, tamanho, etc).
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Seção de Atributos e Valores - Visível apenas se temVariacoes for true */}
          {form.watch("temVariacoes") && (
            <div className="space-y-4">
              <Separator />

              <div className="space-y-2">
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Atributos
                  </span>
                  <div className="flex items-center gap-2">
                    <Popover open={openAtributoPopover} onOpenChange={setOpenAtributoPopover}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openAtributoPopover}
                          className="w-full justify-between"
                        >
                          {selectedAtributo
                            ? atributos.find((a) => a.value === selectedAtributo)?.label
                            : "Clique e selecione um atributo"}
                          <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar atributo..." />
                          <CommandList>
                            <CommandEmpty>Nenhum atributo encontrado.</CommandEmpty>
                            <CommandGroup>
                              {atributos
                                .filter((a) => !atributosAdicionados.some((added) => added.nome === a.value))
                                .map((atributo) => (
                                  <CommandItem
                                    key={atributo.value}
                                    onSelect={() => {
                                      setSelectedAtributo(atributo.value)
                                      setOpenAtributoPopover(false)
                                    }}
                                  >
                                    {atributo.label}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <Button type="button" size="sm" onClick={addAtributo} disabled={!selectedAtributo}>
                      <PlusIcon className="mr-1 h-4 w-4" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Lista de atributos adicionados */}
              {atributosAdicionados.length > 0 && (
                <div className="space-y-4">
                  {atributosAdicionados.map((atributo, index) => {
                    const atributoLabel = atributos.find((a) => a.value === atributo.nome)?.label || atributo.nome
                    return (
                      <div key={index} className="rounded-md bg-sidebar p-4 shadow-sm">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-medium">{atributoLabel}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAtributo(atributo.nome)}
                            className="h-8 w-8 p-0 text-muted-foreground"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Corrigir a parte do componente que exibe os valores de atributos */}
                        <div className="mb-2 flex items-center gap-2">
                          <Popover
                            open={openValorAtributoPopover && editingAtributo === atributo.nome}
                            onOpenChange={(open) => {
                              setOpenValorAtributoPopover(open)
                              if (open) {
                                setEditingAtributo(atributo.nome)
                              } else if (!open && editingAtributo === atributo.nome) {
                                setSelectedValorAtributo(null)
                              }
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openValorAtributoPopover && editingAtributo === atributo.nome}
                                className="w-full justify-between"
                                size="sm"
                              >
                                Adicionar valor
                                <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Buscar valor..." />
                                <CommandList>
                                  <CommandEmpty>Nenhum valor encontrado.</CommandEmpty>
                                  <CommandGroup>
                                    {valoresAtributos[atributo.nome as keyof typeof valoresAtributos]
                                      ?.filter((v) => !atributo.valores.includes(v.value))
                                      .map((valor) => (
                                        <CommandItem
                                          key={valor.value}
                                          onSelect={() => {
                                            addValorAtributo(atributo.nome, valor.value)
                                          }}
                                        >
                                          {valor.label}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* Lista de valores do atributo */}
                        <div className="flex flex-wrap gap-2">
                          {atributo.valores.map((valor, vIndex) => {
                            const valorLabel =
                              valoresAtributos[atributo.nome as keyof typeof valoresAtributos]?.find(
                                (v) => v.value === valor,
                              )?.label || valor
                            return (
                              <Badge key={vIndex} variant="outline" className="flex items-center gap-1">
                                {valorLabel}
                                <XIcon
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={() => removeValorAtributo(atributo.nome, valor)}
                                />
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Variações Geradas */}
        {form.watch("temVariacoes") && variacoes.length > 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium">Variações Geradas</h2>
              <p className="text-sm text-muted-foreground">
                Variações geradas automaticamente com base nos atributos e valores selecionados.
              </p>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Variação</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead className="w-[100px]">Estoque</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variacoes.map((variacao, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{variacao.nome}</TableCell>
                      <TableCell>
                        <Input
                          placeholder="Código da variação"
                          value={variacao.codigo}
                          onChange={(e) => atualizarCodigoVariacao(variacao.nome, e.target.value)}
                          className="h-8 w-40"
                        />
                      </TableCell>
                      <TableCell>
                        <Dialog
                          open={openEstoqueDialog && selectedVariacao === variacao.nome}
                          onOpenChange={(open) => {
                            setOpenEstoqueDialog(open)
                            if (!open) setSelectedVariacao(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setSelectedVariacao(variacao.nome)}
                            >
                              <BoxIcon className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Estoque da Variação: {variacao.nome}</DialogTitle>
                              <DialogDescription>
                                Gerencie o estoque desta variação em diferentes locais.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Loja</TableHead>
                                    <TableHead className="text-right">Quantidade</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {estoques.map((estoque) => (
                                    <TableRow key={estoque.id}>
                                      <TableCell>{estoque.nome}</TableCell>
                                      <TableCell className="text-right">
                                        <Input type="number" defaultValue="0" className="h-8 w-20 text-right ml-auto" />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                            <DialogFooter>
                              <Button type="button" onClick={() => setOpenEstoqueDialog(false)}>
                                Salvar
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Tabela de Preços - Diretamente no layout da página */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium">Tabela de Preços</h2>
            <p className="text-sm text-muted-foreground">
              Associe o produto a tabelas de preço existentes e defina os valores.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Popover open={openTabelaPrecoPopover} onOpenChange={setOpenTabelaPrecoPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openTabelaPrecoPopover}
                    className="w-full justify-between"
                  >
                    {selectedTabelaPreco
                      ? tabelasPreco.find((t) => t.id === selectedTabelaPreco)?.nome
                      : "Selecionar tabela de preço"}
                    <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar tabela de preço..." />
                    <CommandList>
                      <CommandEmpty>Nenhuma tabela encontrada.</CommandEmpty>
                      <CommandGroup>
                        {tabelasPreco
                          .filter((t) => !tabelasPrecoSelecionadas.some((selected) => selected.id === t.id))
                          .map((tabela) => (
                            <CommandItem
                              key={tabela.id}
                              onSelect={() => {
                                setSelectedTabelaPreco(tabela.id)
                                addTabelaPreco(tabela.id)
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedTabelaPreco === tabela.id ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {tabela.nome}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button
                type="button"
                size="icon"
                onClick={() => {
                  if (selectedTabelaPreco) {
                    addTabelaPreco(selectedTabelaPreco)
                  } else {
                    setOpenTabelaPrecoPopover(true)
                  }
                }}
              >
                <PlusCircleIcon className="h-4 w-4" />
              </Button>
            </div>

            {tabelasPrecoSelecionadas.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tabela de Preço</TableHead>
                      <TableHead>Preço de Custo</TableHead>
                      <TableHead>Preço de Venda</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tabelasPrecoSelecionadas.map((tabela) => (
                      <TableRow key={tabela.id}>
                        <TableCell className="font-medium">{tabela.nome}</TableCell>
                        <TableCell>
                          <Input
                            placeholder="R$ 0,00"
                            value={tabela.precoCusto}
                            onChange={(e) => {
                              const valorFormatado = converterEntradaMoeda(e)
                              atualizarPrecoCusto(tabela.id, valorFormatado)
                            }}
                            className="h-8 w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="R$ 0,00"
                            value={tabela.precoVenda}
                            onChange={(e) => {
                              const valorFormatado = converterEntradaMoeda(e)
                              atualizarPrecoVenda(tabela.id, valorFormatado)
                            }}
                            className="h-8 w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground"
                            onClick={() => removeTabelaPreco(tabela.id)}
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-md border border-dashed p-8 text-center">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                  <BoxIcon className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Nenhuma tabela de preço adicionada</h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Selecione uma tabela de preço existente para definir os valores para este produto.
                  </p>
                  <Button size="sm" className="relative" onClick={() => setOpenTabelaPrecoPopover(true)}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Adicionar Tabela de Preço
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button">
            Cancelar
          </Button>
          <Button type="submit">Salvar Produto</Button>
        </div>
      </form>
    </Form>
  )
}
