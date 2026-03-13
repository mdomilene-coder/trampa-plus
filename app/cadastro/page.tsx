'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [nomePublico, setNomePublico] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  // Ajustado para bater com a regra do seu banco (check constraint)
  const [tipoPerfil, setTipoPerfil] = useState('Quero contratar');
  const [ufs, setUfs] = useState<any[]>([]);
  const [ufSel, setUfSel] = useState('');
  const [cidades, setCidades] = useState<any[]>([]);
  const [cidadeSel, setCidadeSel] = useState('');
  const [loading, setLoading] = useState(false);

  // Busca Estados do IBGE
  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => res.json())
      .then(data => setUfs(data));
  }, []);

  // Busca Cidades quando o Estado muda
  useEffect(() => {
    if (ufSel) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSel}/municipios?orderBy=nome`)
        .then(res => res.json())
        .then(data => setCidades(data));
    }
  }, [ufSel]);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Criar usuário no Auth do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
      });

      if (authError) throw authError;

      if (authData.user) {
        const siglaUf = ufs.find(u => u.id == ufSel)?.sigla;
        
        // 2. Salvar dados na tabela 'usuarios'
        const { error: profileError } = await supabase.from('usuarios').insert([
          {
            id: authData.user.id,
            nome_completo: nome,
            nome_publico: nomePublico,
            telefone: telefone,
            email: email,
            tipo_perfil: tipoPerfil, // Envia 'Quero contratar' ou 'Quero trabalhar'
            cidade_texto: `${cidadeSel}, ${siglaUf}`,
          },
        ]);

        if (profileError) throw profileError;

        alert('Cadastro realizado com sucesso!');
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      alert(`Erro no cadastro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 uppercase">Trampa+</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Crie sua conta</p>
        </div>

        <form onSubmit={handleCadastro} className="space-y-3">
          <input
            required
            type="text"
            placeholder="NOME COMPLETO"
            className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold text-sm"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            required
            type="text"
            placeholder="NOME PÚBLICO"
            className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold text-sm"
            value={nomePublico}
            onChange={(e) => setNomePublico(e.target.value)}
          />

          <input
            required
            type="tel"
            placeholder="TELEFONE (WHATSAPP)"
            className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold text-sm"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />

          <input
            required
            type="email"
            placeholder="E-MAIL"
            className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            required
            type="password"
            placeholder="SENHA"
            className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold text-sm"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4 py-2">
            <button
              type="button"
              onClick={() => setTipoPerfil('Quero contratar')}
              className={`p-4 rounded-2xl font-black text-[10px] tracking-widest transition-all ${
                tipoPerfil === 'Quero contratar' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
              }`}
            >
              👑 VOU CONTRATAR
            </button>
            <button
              type="button"
              onClick={() => setTipoPerfil('Quero trabalhar')}
              className={`p-4 rounded-2xl font-black text-[10px] tracking-widest transition-all ${
                tipoPerfil === 'Quero trabalhar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
              }`}
            >
              🛠️ VOU TRABALHAR
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              required
              value={ufSel}
              onChange={(e) => { setUfSel(e.target.value); setCidadeSel(''); }}
              className="p-4 bg-gray-50 rounded-2xl border-none font-bold text-sm"
            >
              <option value="">UF</option>
              {ufs.map(uf => <option key={uf.id} value={uf.id}>{uf.sigla}</option>)}
            </select>

            <select
              required
              disabled={!ufSel}
              value={cidadeSel}
              onChange={(e) => setCidadeSel(e.target.value)}
              className="p-4 bg-gray-50 rounded-2xl border-none font-bold text-sm disabled:opacity-50"
            >
              <option value="">CIDADE</option>
              {cidades.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black italic tracking-tighter uppercase hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 mt-4"
          >
            {loading ? 'PROCESSANDO...' : 'FINALIZAR CADASTRO'}
          </button>
        </form>
      </div>
    </div>
  );
}