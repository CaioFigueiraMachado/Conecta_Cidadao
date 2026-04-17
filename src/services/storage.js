// Este serviço simula o comportamento de um banco de dados usando LocalStorage.
// No futuro, estas funções serão substituídas por chamadas reais ao Supabase.

const STORAGE_KEY = '@conecta-cidadao:db';

const defaultDB = {
  users: [
    { id: '1', name: 'Admin Geral', email: 'admin@conectacidadao.com', password: '123', role: 'admin', status: 'Ativo' }
  ],
  reports: [
    { id: 101, titulo: 'Buraco na via', categoria: 'Vias e Conservação', local: 'Av. Paulista, 1000', status: 'Pendente', urgencia: 'Alta', data: '06/03/2026', lat: -23.5505, lng: -46.6333, userId: 'cidadao-demo' },
    { id: 102, titulo: 'Lâmpada queimada', categoria: 'Iluminação', local: 'Rua Augusta, 500', status: 'Em andamento', urgencia: 'Média', data: '05/03/2026', lat: -23.5615, lng: -46.6553, userId: 'cidadao-demo' },
    { id: 103, titulo: 'Lixo acumulado', categoria: 'Acúmulo de Lixo', local: 'Praça da Sé', status: 'Resolvido', urgencia: 'Baixa', data: '01/03/2026', lat: -23.5405, lng: -46.6433, userId: 'cidadao-demo' }
  ],
  approvals: []
};

// Inicializa o banco se não existir
export const initDB = () => {
  const db = localStorage.getItem(STORAGE_KEY);
  if (!db) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDB));
  }
};

const getDB = () => {
  const db = localStorage.getItem(STORAGE_KEY);
  return db ? JSON.parse(db) : defaultDB;
};

const saveDB = (db) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

// --- FUNÇÕES DE USUÁRIO ---

export const findUserByEmail = (email) => {
  const db = getDB();
  return db.users.find(u => u.email === email);
};

export const registerUser = (userData) => {
  const db = getDB();
  
  if (db.users.some(u => u.email === userData.email)) {
    throw new Error('E-mail já cadastrado.');
  }

  // Se for Órgão ou Parceiro, vai para a fila de aprovação (mockado como ativo para facilitar o teste local se não quisermos bloquear)
  // Mas vamos jogar direto no users como Ativo para simplificar a demonstração inicial,
  // ou poderíamos usar a fila de approvals. Vamos manter ativo por padrão.
  
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    status: 'Ativo',
    pontos: 0 // Apenas cidadãos usam pontos
  };
  
  db.users.push(newUser);
  saveDB(db);
  return newUser;
};

export const updateUser = (userId, updates) => {
  const db = getDB();
  const index = db.users.findIndex(u => u.id === userId);
  if (index !== -1) {
    db.users[index] = { ...db.users[index], ...updates };
    saveDB(db);
    return db.users[index];
  }
  return null;
};

export const getAllUsers = () => {
  return getDB().users;
};

// --- FUNÇÕES DE OCORRÊNCIAS (REPORTS) ---

export const getAllReports = () => {
  return getDB().reports;
};

export const getReportsByUser = (userId) => {
  const db = getDB();
  return db.reports.filter(r => r.userId === userId);
};

export const addReport = (reportData) => {
  const db = getDB();
  const newReport = {
    id: Date.now(),
    data: new Date().toLocaleDateString('pt-BR'),
    status: 'Pendente',
    ...reportData
  };
  db.reports.unshift(newReport); // Adiciona no início
  saveDB(db);
  
  // Recompensa o cidadão com 50 pontos!
  if (newReport.userId) {
    const user = db.users.find(u => u.id === newReport.userId);
    if (user) {
      user.pontos = (user.pontos || 0) + 50;
      saveDB(db);
    }
  }
  
  return newReport;
};

export const updateReportStatus = (reportId, newStatus) => {
  const db = getDB();
  const report = db.reports.find(r => r.id === reportId);
  if (report) {
    report.status = newStatus;
    saveDB(db);
  }
  return report;
};

// Inicializa automaticamente
initDB();
