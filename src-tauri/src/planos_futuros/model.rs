use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct PlanoFuturo {
    pub id: i64,
    pub descricao: String,
    pub periodo: Option<String>,
    pub duracao_valor: Option<String>,
    pub duracao_unidade: Option<String>,
    pub valor: Option<f64>,
    pub status: String,
    pub criado_em: String,
    pub alterado_em: String,
}
