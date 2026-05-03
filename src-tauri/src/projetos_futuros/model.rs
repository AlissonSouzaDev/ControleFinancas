use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ProjetoFuturo {
    pub id: i64,
    pub descricao: String,
    pub periodo: Option<String>,
    pub duracao_valor: Option<String>,
    pub duracao_unidade: Option<String>,
    pub valor: Option<f64>,
    pub status: String,
    pub prioridade: i64,
    pub observacao: Option<String>,
    pub criado_em: String,
    pub alterado_em: String,
}
