'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CadastroInicial() {
  const [formData, setFormData] = useState({
    nome_completo: '',
    nome_publico: '',        // ← ADICIONADO
    email: '',
    telefone: '',
    tipo_perfil: 'prestador'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('usuarios')
      .insert([formData])
      .select() // Importante: devolve os dados criados
      .single();

    if (error) {
      alert('Erro: ' + error.message);
      return;
    }

    if (data) {
      // Pega o ID e o Perfil direto do que o banco acabou de criar
      const userId = data.id;
      const perfil = data.tipo_perfil;

      // Cadastro com sucesso e "empurrão" para a próxima página
      alert('Cadastro realizado! Vamos configurar suas especialidades.');
      window.location.href = `/selecionar-servicos?id=${userId}&role=${perfil}`;
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Crie sua conta no Trampa+</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <input 
          placeholder="Nome Completo" 
          className="border p-2 rounded"
          onChange={e => setFormData({...formData, nome_completo: e.target.value})}
          required
        />
        
        {/* ← NOVO CAMPO ADICIONADO AQUI */}
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
        
        <select 
          className="border p-2 rounded"
          onChange={e => setFormData({...formData, tipo_perfil: e.target.value})}
        >
          <option value="prestador">Quero prestar serviços</option>
          <option value="tomador">Quero contratar serviços</option>
          <option value="ambos">Ambos</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Próximo Passo
        </button>
      </form>
    </div>
  )
}