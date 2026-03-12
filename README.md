# 🦎 Trampa+ (Trampa Plus)
> Conexão direta e reputação real para quem quer trabalhar e para quem precisa contratar.

O **Trampa+** é uma plataforma focada em simplicidade e confiança. Diferente de redes sociais poluidas, aqui o foco é o **Match Geográfico** e a **Reputação Viva**, garantindo que o prestador não gaste com transporte desnecessário e o cliente encontre profissionais validados.

---

## 🚀 Status do Projeto: MVP em Desenvolvimento
Atualmente, o projeto está na fase de consolidação da **Dashboard Camaleão** e estruturação do **Match por Raio de Atendimento**.

---

## 🛠️ Tecnologias e Arquitetura
- **Frontend:** Next.js 14+ (App Router)
- **Estilização:** Tailwind CSS (Interface limpa e responsiva)
- **Backend:** Supabase (Auth, Database e Realtime)
- **Banco de Dados:** PostgreSQL com extensões espaciais (PostGIS)

---

## 🧠 Inteligência de Negócio (Diferenciais)

### 1. Dashboard Camaleão 🦎
A interface se adapta instantaneamente à intenção do usuário:
- **"Quero trabalhar"**: Foco em oportunidades próximas e gestão de especialidades.
- **"Quero contratar"**: Foco em publicação de vagas e gestão de candidatos.
- **Perfil Misto**: Alternância rápida entre os dois modos sem deslogar.

### 2. Score de Confiança Temporal 📈
Nossa função SQL `calcular_pontuacao_confianca` não é uma média simples. Ela valoriza o presente:
- **Avaliações Recentes (0-90 dias):** Peso 1.0
- **Avaliações Médias (91-180 dias):** Peso 0.7
- **Avaliações Antigas (+180 dias):** Peso 0.4
*Isso garante que um erro no passado não condene o profissional para sempre e que a excelência atual seja recompensada.*

### 3. Match por Geolocalização 📍
Preocupação central com o **custo de transporte**:
- O sistema busca cruzar a `cidade_regiao` do prestador com as vagas num raio de **15km**, otimizando o lucro de quem trabalha e a velocidade de quem contrata.

---

## 🗂️ Estrutura de Dados (Database Schema)
- `USUARIOS`: Perfis, intenções e score consolidado.
- `LISTA_SERVICOS`: Catálogo oficial de profissões (Diarista, Pintor, Garçom, etc).
- `USUARIOS_SERVICOS`: Vínculo entre o profissional e suas habilidades.
- `TRABALHOS`: O coração das interações, onde ocorrem os feedbacks e a mágica do score.

---

## 🗺️ Roadmap (Cronograma Lógico)
- [x] Definição de Visão e Requisitos (MVP).
- [x] Estrutura de Banco de Dados e Triggers de Score.
- [x] Fluxo de Cadastro com Linguagem Amigável.
- [ ] **Dashboard Interativa (Em andamento)**.
- [ ] Página de Perfil Público (Vitrine do Prestador).
- [ ] Lógica de Match Geográfico (15km).
- [ ] Sistema de Feedback Pós-Serviço.

---

## 👩‍💻 Desenvolvedora
**Milene Duarte de Oliveira**