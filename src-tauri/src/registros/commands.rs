use rusqlite::params;
use tauri::State;
use crate::db::DbState;
use super::model::{Registro, Totais};

#[tauri::command]
pub fn criar_registro(
    state: State<DbState>,
    periodo: String,
    tipo: String,
    descricao: String,
    data_vencimento: String,
    valor_total: f64,
    valor_realizado: Option<f64>,
) -> Result<i64, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO dados_mensais (periodo, tipo, descricao, data_vencimento, valor_total, valor_realizado)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![periodo, tipo, descricao, data_vencimento, valor_total, valor_realizado.unwrap_or(0.0)],
    ).map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn listar_registros(state: State<DbState>, periodo: String) -> Result<Vec<Registro>, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT id, periodo, tipo, descricao, data_vencimento, valor_total, valor_realizado, prioridade,
                    status_pagamento, observacao, criado_em, alterado_em
             FROM dados_mensais WHERE periodo = ?1 ORDER BY tipo, criado_em",
        )
        .map_err(|e| e.to_string())?;

    let registros = stmt.query_map(params![periodo], |row| {
        Ok(Registro {
            id: row.get(0)?,
            periodo: row.get(1)?,
            tipo: row.get(2)?,
            descricao: row.get(3)?,
            data_vencimento: row.get(4)?,
            valor_total: row.get(5)?,
            valor_realizado: row.get(6)?,
            prioridade: row.get(7)?,
            status_pagamento: row.get(8)?,
            observacao: row.get(9)?,
            criado_em: row.get(10)?,
            alterado_em: row.get(11)?,
        })
    })
    .map_err(|e| e.to_string())?
    .collect::<Result<Vec<_>, _>>()
    .map_err(|e| e.to_string())?;

    Ok(registros)
}

#[tauri::command]
pub fn alterar_registro(
    state: State<DbState>,
    id: i64,
    tipo: String,
    descricao: String,
    data_vencimento: String,
    valor_total: f64,
    valor_realizado: Option<f64>,
) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE dados_mensais
         SET tipo = ?1, descricao = ?2, data_vencimento = ?3, valor_total = ?4, valor_realizado = ?5,
             alterado_em = datetime('now')
         WHERE id = ?6",
        params![tipo, descricao, data_vencimento, valor_total, valor_realizado.unwrap_or(0.0), id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn apagar_registro(state: State<DbState>, id: i64) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM dados_mensais WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn apagar_todos_mes(state: State<DbState>, periodo: String) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM dados_mensais WHERE periodo = ?1", params![periodo])
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn alterar_status(
    state: State<DbState>,
    id: i64,
    status_pagamento: String,
    valor_realizado: Option<f64>,
    observacao: Option<String>,
) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE dados_mensais
         SET status_pagamento = ?1, valor_realizado = ?2, observacao = ?3, alterado_em = datetime('now')
         WHERE id = ?4",
        params![status_pagamento, valor_realizado.unwrap_or(0.0), observacao, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn alterar_prioridade(state: State<DbState>, id: i64, prioridade: bool) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE dados_mensais SET prioridade = ?1, alterado_em = datetime('now') WHERE id = ?2",
        params![prioridade, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn buscar_totais(state: State<DbState>, periodo: String) -> Result<Totais, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;

    let total_pagar: f64 = conn
        .query_row(
            "SELECT COALESCE(SUM(valor_total), 0) FROM dados_mensais WHERE periodo = ?1 AND tipo = 'a_pagar'",
            params![periodo],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    let total_receber: f64 = conn
        .query_row(
            "SELECT COALESCE(SUM(valor_total), 0) FROM dados_mensais WHERE periodo = ?1 AND tipo = 'a_receber'",
            params![periodo],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    Ok(Totais {
        total_pagar,
        total_receber,
        diferenca: total_receber - total_pagar,
    })
}
