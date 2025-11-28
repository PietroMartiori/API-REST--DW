/**
 * Utilitário para formatar mensagens de erro do backend
 * Converte mensagens de erro do Joi para mensagens mais amigáveis
 */

/**
 * Formata mensagem de erro do backend
 * @param {string} errorMessage - Mensagem de erro do backend
 * @returns {string} - Mensagem formatada e amigável
 */
export const formatErrorMessage = (errorMessage) => {
  if (!errorMessage) {
    return 'Erro desconhecido';
  }

  // Mensagens do Joi
  if (errorMessage.includes('is required')) {
    const field = errorMessage.match(/"([^"]+)"/)?.[1];
    if (field) {
      const fieldNames = {
        'name': 'Nome do projeto',
        'title': 'Título da tarefa',
        'projectId': 'Projeto'
      };
      return `${fieldNames[field] || field} é obrigatório`;
    }
  }

  if (errorMessage.includes('must be a string')) {
    const field = errorMessage.match(/"([^"]+)"/)?.[1];
    if (field) {
      return `${field} deve ser um texto`;
    }
  }

  if (errorMessage.includes('must be a number')) {
    const field = errorMessage.match(/"([^"]+)"/)?.[1];
    if (field) {
      return `${field} deve ser um número`;
    }
  }

  if (errorMessage.includes('must be one of')) {
    return 'Status inválido. Deve ser: Pendente, Em Andamento ou Concluída';
  }

  if (errorMessage.includes('must contain at least')) {
    return 'Pelo menos um campo deve ser fornecido para atualização';
  }

  // Mensagens de erro do backend (services)
  const backendMessages = {
    'Nome do projeto obrigatório': 'Nome do projeto é obrigatório',
    'Título da tarefa obrigatório': 'Título da tarefa é obrigatório',
    'Projeto obrigatório para a tarefa': 'Projeto é obrigatório para a tarefa',
    'Status inválido': 'Status inválido. Deve ser: Pendente, Em Andamento ou Concluída',
    'Projeto não encontrado': 'Projeto não encontrado',
    'Tarefa não encontrada': 'Tarefa não encontrada'
  };

  return backendMessages[errorMessage] || errorMessage;
};

