use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Registro {
    pub id: i64,
    pub periodo: String,
    pub tipo: String,
    pub descricao: String,
    pub data_vencimento: String,
    pub valor_total: f64,
    pub valor_realizado: f64,
    pub prioridade: bool,
    pub status_pagamento: String,
    pub observacao: Option<String>,
    pub criado_em: String,
    pub alterado_em: String,
}

#[derive(Serialize)]
pub struct Totais {
    pub total_pagar: f64,
    pub total_receber: f64,
    pub diferenca: f64,
}
