/**
 * Validações do frontend baseadas EXATAMENTE nas validações do backend (Joi)
 * Replicando as mesmas regras do backend/middlewares/validation.js
 */

/**
 * Valida dados de projeto (equivalente a validateProject do backend)
 * Schema Joi: { name: string.required(), description: string.allow(null, ""), status: string }
 * @param {Object} data - Dados do projeto { name, description?, status? }
 * @returns {{ isValid: boolean, error: string | null }}
 */
export const validateProject = (data) => {
  // name é obrigatório e deve ser string
  if (!data.name || typeof data.name !== 'string') {
    return {
      isValid: false,
      error: '"name" is required'
    };
  }

  // description pode ser null, string vazia ou string
  if (data.description !== undefined && data.description !== null && typeof data.description !== 'string') {
    return {
      isValid: false,
      error: '"description" must be a string'
    };
  }

  // status é opcional, mas se fornecido deve ser string
  if (data.status !== undefined && typeof data.status !== 'string') {
    return {
      isValid: false,
      error: '"status" must be a string'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Valida dados de tarefa (equivalente a validateTask do backend)
 * Schema Joi: { title: string.required(), description: string.allow(null, ""), status: valid("Pendente", "Em Andamento", "Concluída"), projectId: number.integer.required() }
 * @param {Object} data - Dados da tarefa { title, description?, status?, projectId }
 * @returns {{ isValid: boolean, error: string | null }}
 */
export const validateTask = (data) => {
  // title é obrigatório e deve ser string
  if (!data.title || typeof data.title !== 'string') {
    return {
      isValid: false,
      error: '"title" is required'
    };
  }

  // description pode ser null, string vazia ou string
  if (data.description !== undefined && data.description !== null && typeof data.description !== 'string') {
    return {
      isValid: false,
      error: '"description" must be a string'
    };
  }

  // status deve ser um dos valores válidos (se fornecido)
  const validStatuses = ['Pendente', 'Em Andamento', 'Concluída'];
  if (data.status !== undefined && !validStatuses.includes(data.status)) {
    return {
      isValid: false,
      error: `"status" must be one of [${validStatuses.map(s => `"${s}"`).join(', ')}]`
    };
  }

  // projectId é obrigatório e deve ser número inteiro
  if (data.projectId === undefined || data.projectId === null) {
    return {
      isValid: false,
      error: '"projectId" is required'
    };
  }

  const projectIdNum = typeof data.projectId === 'number' ? data.projectId : parseInt(data.projectId);
  if (isNaN(projectIdNum) || !Number.isInteger(projectIdNum)) {
    return {
      isValid: false,
      error: '"projectId" must be a number'
    };
  }

  return { isValid: true, error: null };
};

/**
 * Valida atualização de tarefa (equivalente a validateTaskUpdate do backend)
 * Schema Joi: { title: string, description: string.allow(null, ""), status: valid(...), projectId: number.integer }.min(1)
 * @param {Object} data - Dados da tarefa para atualizar
 * @returns {{ isValid: boolean, error: string | null }}
 */
export const validateTaskUpdate = (data) => {
  // Deve ter pelo menos um campo para atualizar (.min(1))
  const hasFields = data.title !== undefined || 
                    data.description !== undefined || 
                    data.status !== undefined || 
                    data.projectId !== undefined;

  if (!hasFields) {
    return {
      isValid: false,
      error: '"value" must contain at least 1 keys'
    };
  }

  // Se title for fornecido, deve ser string
  if (data.title !== undefined && typeof data.title !== 'string') {
    return {
      isValid: false,
      error: '"title" must be a string'
    };
  }

  // Se description for fornecido, deve ser string ou null
  if (data.description !== undefined && data.description !== null && typeof data.description !== 'string') {
    return {
      isValid: false,
      error: '"description" must be a string'
    };
  }

  // Se status for fornecido, deve ser válido
  const validStatuses = ['Pendente', 'Em Andamento', 'Concluída'];
  if (data.status !== undefined && !validStatuses.includes(data.status)) {
    return {
      isValid: false,
      error: `"status" must be one of [${validStatuses.map(s => `"${s}"`).join(', ')}]`
    };
  }

  // Se projectId for fornecido, deve ser número inteiro
  if (data.projectId !== undefined) {
    const projectIdNum = typeof data.projectId === 'number' ? data.projectId : parseInt(data.projectId);
    if (isNaN(projectIdNum) || !Number.isInteger(projectIdNum)) {
      return {
        isValid: false,
        error: '"projectId" must be a number'
      };
    }
  }

  return { isValid: true, error: null };
};
