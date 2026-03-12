import { supabase } from '@/lib/supabase';

export default async function DashboardPage() {
  // 1. Busca os dados do usuário na tabela USUARIOS (conforme seu script_01_2026.sql)
  const { data: usuario } = await supabase
    .from('USUARIOS') 
    .select('tipo_perfil, nome_completo')
    .single();

  // Define o tipo com base nas suas novas categorias amigáveis
  const tipo = usuario?.tipo_perfil || 'Quero trabalhar / Quero contratar';

  // Lógicas para o "Camaleão"
  const podeTrabalhar = tipo === 'Quero trabalhar' || tipo === 'Quero trabalhar / Quero contratar';
  const podeContratar = tipo === 'Quero contratar' || tipo === 'Quero trabalhar / Quero contratar';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Olá, {usuario?.nome_completo || 'Milene'}!</h1>
          <p className="text-gray-600">
            Sua intenção atual: <span className="font-semibold text-blue-600">{tipo}</span>
          </p>
        </header>

        {/* 2. Seletor para Perfil Misto usando suas frases sugeridas */}
        {tipo === 'Quero trabalhar / Quero contratar' && (
          <div className="flex flex-col gap-2 mb-8">
            <p className="text-sm font-medium text-gray-500">O que você quer fazer agora?</p>
            <div className="flex gap-4 bg-white p-1 rounded-xl shadow-sm w-fit border border-gray-200">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">
                Estou procurando oportunidade
              </button>
              <button className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
                Estou contratando
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* SEÇÃO DO PRESTADOR */}
          {podeTrabalhar && (
            <section className="md:col-span-2 space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                🛠️ Oportunidades para você
              </h2>
              <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                <p className="text-gray-500">Buscando serviços na sua região...</p>
              </div>
            </section>
          )}

          {/* SEÇÃO DO TOMADOR */}
          {podeContratar && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                📢 Meus Anúncios
              </h2>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Você não tem anúncios ativos.</p>
                <button className="mt-4 w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
                  Criar Novo Pedido
                </button>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}