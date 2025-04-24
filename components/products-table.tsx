"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Tipo para os dados do produto
interface Product {
  id: string
  name: string
  image: string
  categories: string[]
  stock: number
}

// Dados fictícios para os produtos
const products: Product[] = [
  {
    id: "1",
    name: "Notebook Pro X1",
    image: "/modern-workspace.png",
    categories: ["Eletrônicos", "Computadores", "Notebooks"],
    stock: 15,
  },
  {
    id: "2",
    name: 'Monitor UltraWide 29"',
    image: "/computer-monitor-display.png",
    categories: ["Eletrônicos", "Periféricos", "Monitores"],
    stock: 8,
  },
  {
    id: "3",
    name: "Teclado Mecânico RGB",
    image: "/colorful-mechanical-keyboard.png",
    categories: ["Eletrônicos", "Periféricos", "Teclados"],
    stock: 23,
  },
  {
    id: "4",
    name: "Mouse Gamer 16000 DPI",
    image: "/field-mouse-close-up.png",
    categories: ["Eletrônicos", "Periféricos", "Mouses"],
    stock: 31,
  },
  {
    id: "5",
    name: "Headset 7.1 Surround",
    image: "/gamer-immersion.png",
    categories: ["Eletrônicos", "Áudio", "Headsets"],
    stock: 12,
  },
  {
    id: "6",
    name: "Smartphone Galaxy S23",
    image: "/modern-communication-hub.png",
    categories: ["Eletrônicos", "Celulares", "Samsung"],
    stock: 7,
  },
  {
    id: "7",
    name: 'Tablet iPad Pro 11"',
    image: "/digital-slate.png",
    categories: ["Eletrônicos", "Tablets", "Apple"],
    stock: 5,
  },
  {
    id: "8",
    name: "Câmera DSLR 24MP",
    image: "/vintage-camera-still-life.png",
    categories: ["Eletrônicos", "Fotografia", "Câmeras"],
    stock: 3,
  },
  {
    id: "9",
    name: "Impressora Multifuncional",
    image: "/modern-office-printer.png",
    categories: ["Eletrônicos", "Escritório", "Impressoras"],
    stock: 9,
  },
  {
    id: "10",
    name: 'Smart TV 55" 4K',
    image: "/vintage-television.png",
    categories: ["Eletrônicos", "TVs", "Smart TVs"],
    stock: 6,
  },
]

// Componente para exibir as categorias com o botão "+"
const CategoriesCell = ({ categories }: { categories: string[] }) => {
  const [showAll, setShowAll] = React.useState(false)
  const visibleCategories = showAll ? categories : categories.slice(0, 2)
  const hasMore = categories.length > 2

  return (
    <div className="flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
      {visibleCategories.map((category, index) => (
        <span
          key={index}
          className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
        >
          {category}
        </span>
      ))}
      {!showAll && hasMore && (
        <button
          type="button"
          className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation()
            setShowAll(true)
          }}
        >
          +{categories.length - 2}
        </button>
      )}
      {showAll && hasMore && (
        <button
          type="button"
          className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation()
            setShowAll(false)
          }}
        >
          Menos
        </button>
      )}
    </div>
  )
}

export function ProductsTable() {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [searchQuery, setSearchQuery] = React.useState("")

  // Função para navegar para a página de detalhes do produto
  const navigateToProductDetail = (productId: string) => {
    router.push(`/produtos/${productId}`)
  }

  // Função para navegar para a página de criação de produto
  const navigateToNewProduct = () => {
    router.push("/produtos/novo-produto")
  }

  // Definição das colunas
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "image",
      header: "Imagem",
      cell: ({ row }) => (
        <div
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border bg-background cursor-pointer"
          onClick={() => navigateToProductDetail(row.original.id)}
        >
          <img
            src={row.original.image || "/placeholder.svg"}
            alt={row.original.name}
            className="h-full w-full object-cover"
          />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Nome do Produto",
      cell: ({ row }) => (
        <div
          className="text-foreground cursor-pointer hover:underline"
          onClick={() => navigateToProductDetail(row.original.id)}
        >
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "categories",
      header: "Categorias",
      cell: ({ row }) => <CategoriesCell categories={row.original.categories} />,
    },
    {
      accessorKey: "stock",
      header: "Estoque",
      cell: ({ row }) => {
        const stock = row.original.stock
        let stockClass = "text-foreground"

        if (stock <= 5) {
          stockClass = "text-red-500/60"
        } else if (stock <= 10) {
          stockClass = "text-amber-500/60"
        }

        return <div className={`text-sm ${stockClass}`}>{stock} unidades</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigateToProductDetail(row.original.id)}>Ver detalhes</DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  navigator.clipboard.writeText(row.original.id)
                }}
              >
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Editar produto</DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Atualizar estoque</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600/60" onClick={(e) => e.stopPropagation()}>
                Excluir produto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Filtrar produtos com base na pesquisa
  const filteredProducts = React.useMemo(() => {
    if (!searchQuery) return products

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categories.some((category) => category.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }, [searchQuery])

  const table = useReactTable({
    data: filteredProducts,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          {/* Botão "Novo Produto" que direciona para a página de criação */}
          <Button onClick={navigateToNewProduct}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-xs text-muted-foreground">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => navigateToProductDetail(row.original.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-xs text-muted-foreground">
          {table.getFilteredRowModel().rows.length} produto(s) encontrado(s).
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-xs text-muted-foreground">Linhas por página</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-xs text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir para primeira página</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir para página anterior</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir para próxima página</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir para última página</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
