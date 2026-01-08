// ============================================
// PRIMEIROCV - SERVIÇO DE IA (GOOGLE GEMINI)
// ============================================

import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  PersonalData,
  ProfessionalObjective,
  Education,
  Experience,
  Skill,
} from '@/types';

// ============================================
// CONFIGURAÇÃO
// ============================================

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    if (!GEMINI_API_KEY) {
      throw new Error('VITE_GEMINI_API_KEY não configurada');
    }
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return genAI;
}

function getModel() {
  return getGenAI().getGenerativeModel({ model: 'gemini-2.5-flash' });
}

/**
 * Verifica se a IA está configurada
 */
export function isAIConfigured(): boolean {
  return Boolean(GEMINI_API_KEY);
}

// ============================================
// PROMPTS
// ============================================

const SYSTEM_CONTEXT = `Você é um especialista em recursos humanos e recrutamento no Brasil, 
especializado em ajudar jovens a conseguir seu primeiro emprego. 
Você entende o mercado de trabalho brasileiro, especialmente para vagas de entrada como 
Jovem Aprendiz, estágio e primeiro emprego.

REGRAS IMPORTANTES:
- Sempre responda em português brasileiro
- Use linguagem profissional mas acessível
- Foque em destacar potencial e disposição para aprender
- Evite jargões corporativos excessivos
- Seja conciso e direto
- Não invente informações que não foram fornecidas`;

// ============================================
// GERAÇÃO DE OBJETIVO PROFISSIONAL
// ============================================

interface GenerateObjectiveParams {
  personalData: PersonalData;
  targetPosition?: string;
  education: Education[];
  experiences: Experience[];
  skills: Skill[];
}

export async function generateObjective(params: GenerateObjectiveParams): Promise<string> {
  const { personalData, targetPosition, education, experiences, skills } = params;

  const hasExperience = experiences.length > 0;
  const hasEducation = education.length > 0;
  const hasSkills = skills.length > 0;

  // Construir contexto
  let context = `Nome: ${personalData.fullName || 'Candidato'}`;
  
  if (personalData.city && personalData.state) {
    context += `\nLocalização: ${personalData.city} - ${personalData.state}`;
  }

  if (targetPosition) {
    context += `\nCargo desejado: ${targetPosition}`;
  }

  if (hasEducation) {
    const edu = education[0];
    context += `\nFormação: ${edu.course} em ${edu.institution}`;
    if (edu.current) context += ' (cursando)';
  }

  if (hasExperience) {
    context += `\nExperiências: ${experiences.map(e => e.title).join(', ')}`;
  }

  if (hasSkills) {
    const topSkills = skills.slice(0, 5).map(s => s.name);
    context += `\nHabilidades: ${topSkills.join(', ')}`;
  }

  const prompt = `${SYSTEM_CONTEXT}

TAREFA: Escreva um objetivo profissional para o currículo desta pessoa.

INFORMAÇÕES DO CANDIDATO:
${context}

REQUISITOS:
- Entre 50 e 150 palavras
- Destaque motivação e vontade de aprender
- ${hasExperience ? 'Mencione brevemente a experiência' : 'Foque no potencial e disposição'}
- ${targetPosition ? `Mencione interesse na área de ${targetPosition}` : 'Seja genérico mas profissional'}
- Primeira pessoa (Busco..., Tenho interesse..., etc)
- NÃO use clichês como "dinâmico", "proativo" em excesso
- Seja autêntico e humano

Responda APENAS com o texto do objetivo, sem explicações adicionais.`;

  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().trim();
    
    // Limpar possíveis formatações markdown
    return text.replace(/^["']|["']$/g, '').trim();
  } catch (error) {
    console.error('Erro ao gerar objetivo:', error);
    throw new Error('Não foi possível gerar o objetivo. Tente novamente.');
  }
}

// ============================================
// MELHORIA DE DESCRIÇÃO DE EXPERIÊNCIA
// ============================================

interface ImproveDescriptionParams {
  title: string;
  company?: string;
  description: string;
  type: 'job' | 'internship' | 'project' | 'volunteer';
}

export async function improveExperienceDescription(
  params: ImproveDescriptionParams
): Promise<string> {
  const { title, company, description, type } = params;

  const typeLabels = {
    job: 'emprego',
    internship: 'estágio',
    project: 'projeto',
    volunteer: 'voluntariado',
  };

  const prompt = `${SYSTEM_CONTEXT}

TAREFA: Melhore a descrição desta experiência profissional para um currículo.

INFORMAÇÕES:
- Tipo: ${typeLabels[type]}
- Cargo: ${title}
${company ? `- Empresa/Local: ${company}` : ''}
- Descrição atual: "${description}"

REQUISITOS:
- Mantenha entre 50 e 100 palavras
- Use verbos de ação no passado ou presente
- Destaque responsabilidades e conquistas
- Seja específico mas não invente informações
- Mantenha o tom profissional
- Se a descrição original for muito curta, expanda com suposições razoáveis para o cargo

Responda APENAS com a descrição melhorada, sem explicações.`;

  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Erro ao melhorar descrição:', error);
    throw new Error('Não foi possível melhorar a descrição. Tente novamente.');
  }
}

// ============================================
// SUGESTÃO DE HABILIDADES
// ============================================

interface SuggestSkillsParams {
  targetPosition?: string;
  education: Education[];
  experiences: Experience[];
  currentSkills: Skill[];
}

interface SuggestedSkill {
  name: string;
  category: 'technical' | 'soft' | 'language' | 'tool';
  reason: string;
}

export async function suggestSkills(params: SuggestSkillsParams): Promise<SuggestedSkill[]> {
  const { targetPosition, education, experiences, currentSkills } = params;

  const currentSkillNames = currentSkills.map(s => s.name.toLowerCase());

  let context = '';
  
  if (targetPosition) {
    context += `Cargo desejado: ${targetPosition}\n`;
  }

  if (education.length > 0) {
    context += `Formação: ${education.map(e => e.course).join(', ')}\n`;
  }

  if (experiences.length > 0) {
    context += `Experiências: ${experiences.map(e => e.title).join(', ')}\n`;
  }

  if (currentSkills.length > 0) {
    context += `Habilidades atuais: ${currentSkillNames.join(', ')}\n`;
  }

  const prompt = `${SYSTEM_CONTEXT}

TAREFA: Sugira 5 habilidades relevantes para este candidato adicionar ao currículo.

CONTEXTO DO CANDIDATO:
${context || 'Jovem buscando primeiro emprego'}

REQUISITOS:
- Sugira apenas habilidades que NÃO estão na lista atual
- Inclua mix de habilidades técnicas e comportamentais
- Foque em habilidades valorizadas para vagas de entrada no Brasil
- Seja específico (ex: "Excel intermediário" ao invés de "informática")

Responda em formato JSON assim:
[
  {"name": "Nome da Habilidade", "category": "technical|soft|language|tool", "reason": "Motivo breve"}
]

Apenas o JSON, sem explicações.`;

  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text().trim();
    
    // Limpar possível markdown
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const suggestions = JSON.parse(text) as SuggestedSkill[];
    
    // Filtrar skills que já existem
    return suggestions.filter(
      s => !currentSkillNames.includes(s.name.toLowerCase())
    ).slice(0, 5);
  } catch (error) {
    console.error('Erro ao sugerir habilidades:', error);
    throw new Error('Não foi possível sugerir habilidades. Tente novamente.');
  }
}

// ============================================
// ANÁLISE DO CURRÍCULO
// ============================================

interface ResumeAnalysisParams {
  personalData: PersonalData;
  objective: ProfessionalObjective;
  education: Education[];
  experiences: Experience[];
  skills: Skill[];
}

interface ResumeAnalysis {
  strengths: string[];
  improvements: string[];
  tips: string[];
  overallFeedback: string;
}

export async function analyzeResume(params: ResumeAnalysisParams): Promise<ResumeAnalysis> {
  const { personalData, objective, education, experiences, skills } = params;

  const resumeContent = `
DADOS PESSOAIS:
- Nome: ${personalData.fullName || 'Não informado'}
- Email: ${personalData.email || 'Não informado'}
- Telefone: ${personalData.phone || 'Não informado'}
- Localização: ${personalData.city && personalData.state ? `${personalData.city} - ${personalData.state}` : 'Não informado'}
- LinkedIn: ${personalData.linkedin || 'Não informado'}

OBJETIVO:
${objective.text || 'Não informado'}

FORMAÇÃO (${education.length}):
${education.length > 0 
  ? education.map(e => `- ${e.course} em ${e.institution}`).join('\n')
  : 'Nenhuma formação cadastrada'}

EXPERIÊNCIAS (${experiences.length}):
${experiences.length > 0
  ? experiences.map(e => `- ${e.title}${e.company ? ` em ${e.company}` : ''}`).join('\n')
  : 'Nenhuma experiência cadastrada'}

HABILIDADES (${skills.length}):
${skills.length > 0
  ? skills.map(s => s.name).join(', ')
  : 'Nenhuma habilidade cadastrada'}
`;

  const prompt = `${SYSTEM_CONTEXT}

TAREFA: Analise este currículo de um jovem brasileiro buscando seu primeiro emprego e forneça feedback construtivo.

${resumeContent}

REQUISITOS:
- Seja encorajador mas honesto
- Foque em melhorias práticas
- Considere que é um candidato iniciante
- Dê dicas específicas para o mercado brasileiro

Responda em formato JSON assim:
{
  "strengths": ["Ponto forte 1", "Ponto forte 2", "Ponto forte 3"],
  "improvements": ["Melhoria 1", "Melhoria 2", "Melhoria 3"],
  "tips": ["Dica prática 1", "Dica prática 2"],
  "overallFeedback": "Feedback geral encorajador em 2-3 frases"
}

Apenas o JSON, sem explicações.`;

  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text().trim();
    
    // Limpar possível markdown
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    return JSON.parse(text) as ResumeAnalysis;
  } catch (error) {
    console.error('Erro ao analisar currículo:', error);
    throw new Error('Não foi possível analisar o currículo. Tente novamente.');
  }
}

// ============================================
// GERAÇÃO DE CARTA DE APRESENTAÇÃO
// ============================================

interface GenerateCoverLetterParams {
  personalData: PersonalData;
  objective: ProfessionalObjective;
  education: Education[];
  experiences: Experience[];
  skills: Skill[];
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
}

export async function generateCoverLetter(
  params: GenerateCoverLetterParams
): Promise<string> {
  const {
    personalData,
    objective,
    education,
    experiences,
    skills,
    jobTitle,
    companyName,
    jobDescription,
  } = params;

  const context = `
CANDIDATO:
- Nome: ${personalData.fullName}
- Objetivo: ${objective.text || 'Busca primeiro emprego'}
- Formação: ${education.length > 0 ? education[0].course : 'Ensino médio'}
- Experiências: ${experiences.length > 0 ? experiences.map(e => e.title).join(', ') : 'Nenhuma experiência prévia'}
- Habilidades: ${skills.slice(0, 5).map(s => s.name).join(', ')}

VAGA:
- Cargo: ${jobTitle}
- Empresa: ${companyName}
${jobDescription ? `- Descrição: ${jobDescription}` : ''}
`;

  const prompt = `${SYSTEM_CONTEXT}

TAREFA: Escreva uma carta de apresentação profissional para esta candidatura.

${context}

REQUISITOS:
- Entre 150 e 250 palavras
- Tom profissional mas autêntico
- Demonstre entusiasmo pela oportunidade
- Conecte habilidades/experiências com a vaga
- Se não houver experiência, foque em potencial e disposição
- Estrutura: Saudação, introdução, desenvolvimento, encerramento
- NÃO use "Prezados senhores" - use "Prezada equipe de recrutamento da ${companyName}"

Responda APENAS com a carta, sem explicações.`;

  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Erro ao gerar carta:', error);
    throw new Error('Não foi possível gerar a carta. Tente novamente.');
  }
}