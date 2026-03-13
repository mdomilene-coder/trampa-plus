import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Desestrutura todos os campos, incluindo os de GPS
    const { 
      id_tomador, 
      id_servico, 
      descricao, 
      cidade_texto, 
      latitude, 
      longitude, 
      localizacao 
    } = body;

    const { data, error } = await supabase
      .from('trabalhos')
      .insert([
        { 
          id_tomador, 
          id_servico, 
          descricao, 
          cidade_texto, 
          latitude, // <--- Aqui grava a latitude
          longitude, // <--- Aqui grava a longitude
          localizacao, // <--- Aqui grava o POINT para o mapa
          status: 'pendente' 
        }
      ])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data, { status: 201 });
    
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}