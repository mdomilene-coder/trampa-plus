'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CadastroInicial() {
  const [formData, setFormData] = useState({
    nome_completo: '',
    nome_publico: '',
    email: '',
    telefone: '',
    tipo_perfil: 'Quero trabalhar' // Valor inicial padrão
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Importante: Usamos o nome da tabela em MAIÚSCULAS como no seu script_01_2026.sql
    const { data, error } = await supabase
      .from('usuarios') 
      .insert([formData])
      .select()
      .single();

    if (error) {
      alert('Erro ao salvar: ' + error.message);
      return;
    }

    if (data) {
      const userId = data.id;
      const perfil = data.tipo_perfil;

      alert('Cadastro realizado! Vamos configurar seu perfil.');
      // O link agora leva o termo amigável na URL
      window.location.href = `/selecionar-servicos?id=${userId}&role=${encodeURIComponent(perfil)}`;
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Crie sua conta no Trampa+</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <input 
          placeholder="Nome Completo" 
          className="border p-2 rounded"
          onChange={e => setFormData({...formData, nome_completo: e.target.value})}
          required
        />
        
        <input 
          placeholder="Nome Público (como quer ser chamado)" 
          className="border p-2 rounded"
          onChange={e => setFormData({...formData, nome_publico: e.target.value})}
          required
        />
        
        <input 
          type="email" 
          placeholder="E-mail" 
          className="border p-2 rounded"
          onChange={e => setFormData({...formData, email: e.target.value})}
          required
        />
        
        <input 
          type="tel" 
          placeholder="Telefone (WhatsApp)" 
          className="border p-2 rounded"
          onChange={e => setFormData({...formData, telefone: e.target.value})}
          required
        />
        
        <label className="text-sm font-medium text-gray-700 -mb-2">O que você deseja?</label>
        <select 
          className="border p-2 rounded bg-white"
          value={formData.tipo_perfil}
          onChange={e => setFormData({...formData, tipo_perfil: e.target.value})}
        >
          {/* VALORES EXATOS DO BANCO DE DADOS */}
          <option value="Quero trabalhar">Quero trabalhar</option>
          <option value="Quero contratar">Quero contratar</option>
          <option value="Quero trabalhar / Quero contratar">Quero fazer os dois!</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors mt-2">
          Próximo Passo
        </button>
      </form>
    </div>
  )
}