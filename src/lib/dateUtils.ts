/**
 * Converte uma data no formato brasileiro para timestamp MySQL
 * @param dateString - Data no formato "DD/MM/YYYY - HH:MM" ou "DD/MM/YYYY"
 * @returns Timestamp no formato MySQL DATETIME (YYYY-MM-DD HH:MM:SS)
 */
export function convertToTimestamp(dateString: string): string {
  if (!dateString || dateString.trim() === '') {
    const now = new Date();
    return formatToMySQLDateTime(now);
  }

  try {
    // Remove espaços extras
    const cleanDate = dateString.trim();
    
    // Regex para capturar DD/MM/YYYY - HH:MM ou DD/MM/YYYY
    const dateTimeRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s*-\s*(\d{1,2}):(\d{2}))?$/;
    const match = cleanDate.match(dateTimeRegex);
    
    if (!match) {
      console.warn('Invalid date format:', dateString);
      const now = new Date();
      return formatToMySQLDateTime(now);
    }
    
    const [, day, month, year, hours = '23', minutes = '59'] = match;
    
    // Criar data no fuso horário local
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1, // Mês é 0-indexed
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
      0,
      0
    );
    
    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      console.warn('Invalid date created:', dateString);
      const now = new Date();
      return formatToMySQLDateTime(now);
    }
    
    return formatToMySQLDateTime(date);
  } catch (error) {
    console.error('Error converting date:', error);
    const now = new Date();
    return formatToMySQLDateTime(now);
  }
}

/**
 * Formata uma data para o formato MySQL DATETIME
 * @param date - Objeto Date
 * @returns String no formato YYYY-MM-DD HH:MM:SS
 */
function formatToMySQLDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Converte uma data no formato brasileiro para ISO string
 * @param dateString - Data no formato "DD/MM/YYYY - HH:MM" ou "DD/MM/YYYY"
 * @returns Data em formato ISO string
 */
export function convertToISOString(dateString: string): string {
  const timestamp = convertToTimestamp(dateString);
  return new Date(timestamp).toISOString();
}

/**
 * Valida se uma data está no formato brasileiro correto
 * @param dateString - Data para validar
 * @returns true se válida
 */
export function isValidBrazilianDate(dateString: string): boolean {
  if (!dateString || dateString.trim() === '') {
    return true; // Data vazia é considerada válida (opcional)
  }
  
  const dateTimeRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s*-\s*(\d{1,2}):(\d{2}))?$/;
  const match = dateString.trim().match(dateTimeRegex);
  
  if (!match) {
    return false;
  }
  
  const [, day, month, year, hours = '0', minutes = '0'] = match;
  
  // Validações básicas
  const dayNum = parseInt(day);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  const hoursNum = parseInt(hours);
  const minutesNum = parseInt(minutes);
  
  if (dayNum < 1 || dayNum > 31) return false;
  if (monthNum < 1 || monthNum > 12) return false;
  if (yearNum < 2000 || yearNum > 2100) return false;
  if (hoursNum < 0 || hoursNum > 23) return false;
  if (minutesNum < 0 || minutesNum > 59) return false;
  
  // Verificar se a data é válida criando um objeto Date
  try {
    const date = new Date(yearNum, monthNum - 1, dayNum, hoursNum, minutesNum);
    return date.getFullYear() === yearNum && 
           date.getMonth() === monthNum - 1 && 
           date.getDate() === dayNum;
  } catch {
    return false;
  }
}