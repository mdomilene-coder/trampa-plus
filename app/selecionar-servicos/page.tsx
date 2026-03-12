'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation' // useRouter para navegar
import { supabase } from '@/lib/supabase'

export default function SelecionarServicos() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const role = searchParams.get('role')
  const userId = searchParams.get('id')

  const [servicos, setServicos] = useState<any[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [carregando, setCarregando] = useState(false)

  // Configurações do Camaleão
  const config = {
    prestador: {
      titulo: "O que você sabe fazer?",
      subtitulo: "Selecione suas especialidades para receber os melhores matches de trabalho.",
      corBotao: "bg-blue-600",
      textoBotao: "Finalizar Perfil de Prestador"
    },
    tomador: {
      titulo: "Do que você precisa agora?",
      subtitulo: "Selecione os serviços que você deseja contratar hoje.",
      corBotao: "bg-emerald-600",
      textoBotao: "Buscar Profissionais"
    },
    ambos: {
      titulo: "Vamos configurar tudo!",
      subtitulo: "Selecione as categorias que te interessam para contratar ou prestar serviços.",
      corBotao: "bg-purple-600",
      textoBotao: "Confirmar e Ir para o Painel"
    }
  }

  const ui = config[role as keyof typeof config] || config.ambos

  useEffect(() => {
    fetchServicos()
  }, [])

  async function fetchServicos() {
    const { data } = await supabase.from('lista_servicos').select('*').order('categoria')
    if (data) setServicos(data)
  }

  // --- FUNÇÃO PARA SALVAR  ---
  async function salvarSelecao() {
    if (selectedIds.length === 0) {
      alert("Por favor, selecione pelo menos um serviço!")
      return
    }

    setCarregando(true)

    // Objeto com ID do usuário, ID do serviço e a CATEGORIA
    const dadosParaSalvar = selectedIds.map(id => {
      const servicoCompleto = servicos.find(s => s.id === id)
      return {
        usuario_id: userId,
        servico_id: id,
        categoria_servico: servicoCompleto?.categoria // <-- A inteligência que você sugeriu!
      }
    })

    const { error } = await supabase
      .from('usuarios_servicos')
      .insert(dadosParaSalvar)

    if (error) {
      console.error("Erro ao salvar:", error)
      alert("Houve um erro ao salvar suas escolhas.")
    } else {
      // Se salvou, manda para a dashboard
      router.push(`/dashboard?id=${userId}`)
    }
    setCarregando(false)
  }

  // Lógica de Agrupamento visual por Categorias
  const servicosAgrupados = servicos.reduce((acc: any, item: any) => {
    const categoria = item.categoria || 'Outros'
    if (!acc[categoria]) acc[categoria] = []
    acc[categoria].push(item)
    return acc
  }, {})

  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">{ui.titulo}</h1>
        <p className="text-slate-600">{ui.subtitulo}</p>
      </header>

      {/* Grid Organizado */}
      {Object.keys(servicosAgrupados).map((categoria) => (
        <div key={categoria} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">{categoria}</h2>
            <div className="h-[1px] bg-slate-200 flex-1"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {servicosAgrupados[categoria].map((item: any) => (
              <div 
                key={item.id}
                onClick={() => setSelectedIds(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id])}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-sm ${
                  selectedIds.includes(item.id) 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-slate-100 bg-white'
                }`}
              >
                <h3 className={`text-lg font-semibold ${selectedIds.includes(item.id) ? 'text-blue-700' : 'text-slate-800'}`}>
                  {item.nome_servico}
                </h3>
              </div>
            ))}
          </div>
        </div>
      ))}

      <footer className="mt-10 sticky bottom-6">
        <button 
          onClick={salvarSelecao}
          disabled={carregando}
          className={`w-full py-4 text-white rounded-xl font-bold shadow-xl transition-all active:scale-95 ${ui.corBotao} ${carregando ? 'opacity-50' : ''}`}
        >
          {carregando ? "Salvando..." : `${ui.textoBotao} (${selectedIds.length})`}
        </button>
      </footer>
    </main>
  )
}