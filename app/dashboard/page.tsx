'use client'; 
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Categorias para dar cor ao seu dashboard
const categorias: { [key: number]: { nome: string; cor: string } } = {
  1: { nome: '🎨 Pintura', cor: 'bg-blue-600' },
  2: { nome: '🧹 Limpeza', cor: 'bg-green-600' },
  3: { nome: '⚡ Elétrica', cor: 'bg-yellow-500' },
  4: { nome: '🔧 Mecânica', cor: 'bg-red-500' },
};

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const [anuncios, setAnuncios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: profile } = await supabase.from('usuarios').select('*').eq('id', authUser.id).single();
          setUsuario(profile);

          const eContratante = profile?.tipo_perfil?.toLowerCase().includes('contratar');
          let query = supabase.from('trabalhos').select('*');

          if (eContratante) {
            query = query.eq('id_tomador', authUser.id);
          } else {
            query = query.neq('id_tomador', authUser.id).eq('status', 'pendente');
          }

          const { data: lista } = await query.order('id', { ascending: false });
          setAnuncios(lista || []);
        }
      } catch (err) {
        console.error("Erro ao carregar:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const eContratante = usuario?.tipo_perfil?.toLowerCase().includes('contratar');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600 font-black italic animate-pulse uppercase tracking-widest">
      Carregando Império...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-end border-b pb-6 border-gray-200">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-gray-800">
              Olá, {usuario?.nome_completo?.split(' ')[0] || 'Milene'}!
            </h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
              Perfil: <span className="text-blue-600">{eContratante ? '👑 Contratante' : '🛠️ Prestador'}</span>
            </p>
          </div>
          <button 
            onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')} 
            className="text-[10px] font-black text-red-400 uppercase border border-red-50 px-4 py-2 rounded-xl hover:bg-red-50 transition-all"
          >
            Sair
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <section className="md:col-span-2 space-y-4">
            <h2 className="font-black text-sm uppercase tracking-widest text-gray-400 mb-4">
              {eContratante ? '💬 Seus Pedidos Ativos' : '🌍 Oportunidades no Mercado'}
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {anuncios.length > 0 ? anuncios.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                   <div className="flex justify-between items-start mb-3">
                    <span className={`text-[9px] font-black uppercase text-white px-3 py-1 rounded-full ${categorias[job.id_servico]?.cor || 'bg-gray-400'}`}> 
                        {categorias[job.id_servico]?.nome || 'Serviço'}
                    </span>
                    <span className="text-[9px] text-gray-300 font-mono">#{job.id}</span>
                  </div>
                  <p className="text-md text-gray-800 font-bold leading-tight mb-4">{job.descricao}</p>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 font-bold uppercase">
                    <span className="text-blue-500 text-sm">📍</span> {job.cidade_texto}
                  </div>
                </div>
              )) : (
                <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center font-bold text-gray-300 italic uppercase text-sm">
                   Nenhum registro encontrado.
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-blue-50 text-center h-fit">
              <h2 className="font-black text-xl mb-2 italic tracking-tighter text-gray-800">Resumo</h2>
              <p className="text-xs text-gray-400 font-medium mb-6">
                {eContratante ? `Você tem ${anuncios.length} pedidos publicados.` : `Há ${anuncios.length} serviços aguardando prestador.`}
              </p>
              
              {eContratante && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  🚀 Criar Novo Pedido
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>

      {isModalOpen && <ModalCriar usuarioId={usuario?.id} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

function ModalCriar({ onClose, usuarioId }: { onClose: () => void, usuarioId: string }) {
  const [desc, setDesc] = useState('');
  const [ufs, setUfs] = useState<any[]>([]);
  const [ufSel, setUfSel] = useState('');
  const [cidades, setCidades] = useState<any[]>([]);
  const [cidadeSel, setCidadeSel] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(res => res.json()).then(data => setUfs(data));
  }, []);

  useEffect(() => {
    if (ufSel) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSel}/municipios?orderBy=nome`).then(res => res.json()).then(data => setCidades(data));
    }
  }, [ufSel]);

  const handlePublicar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    const siglaUf = ufs.find(u => u.id == ufSel)?.sigla;
    try {
      await fetch('/api/oportunidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descricao: desc, id_servico: 1, id_tomador: usuarioId,
          cidade_texto: `${cidadeSel}, ${siglaUf}`
        }),
      });
      window.location.reload();
    } catch (err) { alert("Erro ao salvar."); } finally { setEnviando(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-black mb-6 italic text-center uppercase tracking-tighter text-gray-800">Novo Pedido</h2>
        <form onSubmit={handlePublicar} className="space-y-4">
          <select required value={ufSel} onChange={(e) => {setUfSel(e.target.value); setCidadeSel('');}} className="w-full border-none bg-gray-50 p-4 rounded-2xl font-bold">
            <option value="">Estado...</option>
            {ufs.map(uf => <option key={uf.id} value={uf.id}>{uf.nome}</option>)}
          </select>
          <select required disabled={!ufSel} value={cidadeSel} onChange={(e) => setCidadeSel(e.target.value)} className="w-full border-none bg-gray-50 p-4 rounded-2xl font-bold">
            <option value="">Cidade...</option>
            {cidades.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
          </select>
          <textarea required value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="O que você precisa?" className="w-full border-none bg-gray-50 p-4 rounded-2xl h-32 resize-none text-sm font-medium" />
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={onClose} className="flex-1 font-black text-gray-400 uppercase text-[10px] tracking-widest">Fechar</button>
            <button type="submit" disabled={enviando} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-blue-200 tracking-widest">
              {enviando ? 'Enviando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}