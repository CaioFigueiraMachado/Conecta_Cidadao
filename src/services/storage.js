// storage.js — Conecta Cidadão
// Todas as funções são async e usam Supabase como backend.

import { supabase } from './supabase';

// ─── USUÁRIOS ────────────────────────────────────────────────

export const findUserByEmail = async (email) => {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  return data || null;
};

export const registerUser = async (userData) => {
  const existing = await findUserByEmail(userData.email);
  if (existing) throw new Error('E-mail já cadastrado.');

  const { data, error } = await supabase
    .from('users')
    .insert([{ ...userData, pontos: 0, status: 'Ativo' }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateUser = async (userId, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteUser = async (userId) => {
  const { error } = await supabase.from('users').delete().eq('id', userId);
  if (error) throw new Error(error.message);
};

export const getAllUsers = async () => {
  const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
  return data || [];
};

// ─── TRANSAÇÕES DE PONTOS (EXTRATO) ────────────────────────────

export const addPointsTransaction = async (transactionData) => {
  const { data, error } = await supabase
    .from('points_transactions')
    .insert([{
      user_id: transactionData.userId,
      tipo: transactionData.tipo, // 'credito' | 'debito'
      pontos: transactionData.pontos,
      descricao: transactionData.descricao,
      origem: transactionData.origem, // 'relatorio' | 'resgate' | 'ajuste' | 'bonus'
    }])
    .select()
    .single();
  if (error) {
    console.error('Erro ao registrar transação de pontos:', error);
    throw new Error(error.message);
  }
  return data;
};

export const getPointsTransactions = async (userId) => {
  const { data } = await supabase
    .from('points_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return data || [];
};

export const subscribeToPointsTransactions = (userId, callback) => {
  const channel = supabase
    .channel(`points-transactions-${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'points_transactions',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe();
  return () => supabase.removeChannel(channel);
};

// ─── FIM DAS TRANSAÇÕES DE PONTOS ───────────────────────────────

// ─── OCORRÊNCIAS (REPORTS) ───────────────────────────────────

export const getAllReports = async () => {
  const { data } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
  return data || [];
};

export const getReportsByUser = async (userId) => {
  const { data } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return data || [];
};

export const addReport = async (reportData) => {
  const { data, error } = await supabase
    .from('reports')
    .insert([{
      titulo: reportData.titulo,
      categoria: reportData.categoria,
      local: reportData.local,
      descricao: reportData.descricao,
      urgencia: reportData.urgencia || 'Média',
      status: 'Pendente',
      lat: reportData.lat,
      lng: reportData.lng,
      data: new Date().toLocaleDateString('pt-BR'),
      user_id: reportData.userId || null,
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateReportStatus = async (reportId, newStatus) => {
  // Fetch current report
  const { data: report } = await supabase
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .single();

  if (!report) return { report: null, pointsAwarded: false };

  const oldStatus = report.status;

  const { data: updated } = await supabase
    .from('reports')
    .update({ status: newStatus })
    .eq('id', reportId)
    .select()
    .single();

  let pointsAwarded = false;

   // Se mudou para Resolvido pela primeira vez, credita 50 pontos
   if (newStatus === 'Resolvido' && oldStatus !== 'Resolvido' && report.user_id) {
     const { data: citizen } = await supabase
       .from('users')
       .select('pontos')
       .eq('id', report.user_id)
       .single();

     if (citizen) {
       const newPoints = (citizen.pontos || 0) + 50;
       await supabase
         .from('users')
         .update({ pontos: newPoints })
         .eq('id', report.user_id);

       // Registra transação de crédito
       await addPointsTransaction({
         userId: report.user_id,
         tipo: 'credito',
         pontos: 50,
         descricao: `Pontos por resolver ocorrência: ${report.titulo || 'Ocorrência sem título'}`,
         origem: 'relatorio',
         referenciaId: reportId,
       });

       pointsAwarded = true;
     }
   }

  return { report: updated, pointsAwarded };
};

export const deleteReport = async (reportId) => {
  await supabase.from('reports').delete().eq('id', reportId);
};

// ─── BENEFÍCIOS ──────────────────────────────────────────────

export const getAllBenefits = async () => {
  const { data } = await supabase.from('benefits').select('*').order('created_at', { ascending: false });
  return data || [];
};

export const getBenefitsByPartner = async (partnerId) => {
  const { data } = await supabase
    .from('benefits')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });
  return data || [];
};

export const addBenefit = async (benefitData) => {
  const { data, error } = await supabase
    .from('benefits')
    .insert([{
      nome: benefitData.nome,
      categoria: benefitData.categoria,
      pontos: benefitData.pontos,
      empresa: benefitData.empresa,
      code: benefitData.code || '',
      imagem: benefitData.imagem || '',
      descricao: benefitData.descricao || '',
      partner_id: benefitData.partnerId || null,
    }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteBenefit = async (id) => {
  await supabase.from('benefits').delete().eq('id', id);
};

export const redeemBenefit = async (userId, benefit) => {
  // Gera código de 6 caracteres alfanuméricos
  const code = benefit.code || Math.random().toString(36).substring(2, 8).toUpperCase();
  const { data, error } = await supabase
    .from('redeemed')
    .insert([{
      user_id: userId,
      benefit_id: benefit.id,
      nome: benefit.nome,
      empresa: benefit.empresa,
      pontos: benefit.pontos,
      code: code,
      data: new Date().toLocaleDateString('pt-BR'),
    }])
    .select('*')
    .single();
  if (error) {
    console.error('Erro ao resgatar benefício:', error);
    throw new Error(error.message);
  }

  // Deduz pontos do saldo do usuário
  const { data: citizen } = await supabase
    .from('users')
    .select('pontos')
    .eq('id', userId)
    .single();

  if (citizen) {
    const newPoints = Math.max(0, (citizen.pontos || 0) - benefit.pontos);
    await supabase
      .from('users')
      .update({ pontos: newPoints })
      .eq('id', userId);
  }

  // Registra transação de débito
  await addPointsTransaction({
    userId: userId,
    tipo: 'debito',
    pontos: benefit.pontos,
    descricao: `Resgate: ${benefit.nome} - ${benefit.empresa}`,
    origem: 'resgate',
    referenciaId: data.id,
  });

  return data;
};

export const getRedeemedBenefits = async (userId) => {
  const { data } = await supabase
    .from('redeemed')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return data || [];
};

// ─── APROVAÇÕES DE PARCEIROS ─────────────────────────────────

export const addPartnerRequest = async (requestData) => {
  const { data, error } = await supabase
    .from('approvals')
    .insert([{
      empresa: requestData.empresa,
      email: requestData.email,
      cnpj: requestData.cnpj || '',
      status: 'Pendente',
      data_req: new Date().toLocaleDateString('pt-BR'),
      ...requestData,
    }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const getPartnerRequests = async () => {
  const { data } = await supabase.from('approvals').select('*').order('created_at', { ascending: false });
  return data || [];
};

export const resolvePartnerRequest = async (id, accept) => {
  await supabase
    .from('approvals')
    .update({ status: accept ? 'Aprovado' : 'Recusado' })
    .eq('id', id);

  if (accept) {
    const { data: req } = await supabase.from('approvals').select('*').eq('id', id).single();
    if (req) {
      await supabase.from('users').insert([{
        name: req.empresa,
        email: req.email,
        password: '123',
        role: 'parceiro',
        status: 'Ativo',
        pontos: 0,
      }]);
      // Força recarregamento do cache do PostgREST
      await supabase.from('users').select('id').eq('email', req.email).maybeSingle();
    }
  }
};

// ─── MENSAGENS (CHAT) ─────────────────────────────────────────

export const getMessagesByReport = async (reportId) => {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('report_id', reportId)
    .order('created_at', { ascending: true });
  return data || [];
};

export const addMessage = async (reportId, messageData) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{
      report_id: reportId,
      sender_id: messageData.senderId || null,
      sender_name: messageData.senderName,
      sender_role: messageData.role,
      content: messageData.text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// ─── CONFIGURAÇÕES DO SISTEMA ─────────────────────────────────

export const getSystemConfig = async () => {
  const defaults = {
    platformName: 'Conecta Cidadão',
    supportEmail: 'admin@conectacidadao.com',
    maintenanceMode: false,
    auditLogs: true,
    sessionTimeout: 60,
  };
  const { data } = await supabase.from('config').select('value').eq('key', 'system').single();
  return data ? { ...defaults, ...data.value } : defaults;
};

export const saveSystemConfig = async (newConfig) => {
  const current = await getSystemConfig();
  const merged = { ...current, ...newConfig };
  await supabase.from('config').upsert({ key: 'system', value: merged });
  return merged;
};

// ─── REALTIME SUBSCRIPTIONS (substitui o polling) ─────────────

export const subscribeToReports = (callback) => {
  const channel = supabase
    .channel('reports-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, callback)
    .subscribe();
  return () => supabase.removeChannel(channel);
};

export const subscribeToUser = (userId, callback) => {
  const channel = supabase
    .channel(`user-${userId}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${userId}` }, callback)
    .subscribe();
  return () => supabase.removeChannel(channel);
};

export const subscribeToMessages = (reportId, callback) => {
  const channel = supabase
    .channel(`messages-${reportId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `report_id=eq.${reportId}` }, callback)
    .subscribe();
  return () => supabase.removeChannel(channel);
};

// ─── REALTIME PARA BENEFÍCIOS ───────────────────────────────────

export const subscribeToBenefits = (callback) => {
  const channel = supabase
    .channel('benefits-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'benefits' }, callback)
    .subscribe();
  return () => supabase.removeChannel(channel);
};
