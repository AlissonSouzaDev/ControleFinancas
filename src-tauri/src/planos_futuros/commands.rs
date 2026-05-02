use super::model::PlanoFuturo;
use crate::db::DbState;
use rusqlite::params;
use tauri::State;

#[tauri::command]
pub fn criar_plano(
    state: State<DbState>,
    descricao: String,
    periodo: Option<String>,
    duracao_valor: Option<String>,
    duracao_unidade: Option<String>,
    valor: Option<f64>,
    status: String,
) -> Result<i64, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO projetos_futuros (descricao, periodo, duracao_valor, duracao_unidade, valor, status)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![descricao, periodo, duracao_valor, duracao_unidade, valor, status],
    ).map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn listar_planos(state: State<DbState>) -> Result<Vec<PlanoFuturo>, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT id, descricao, periodo, duracao_valor, duracao_unidade, valor, status, criado_em, alterado_em
             FROM projetos_futuros ORDER BY criado_em DESC",
        )
        .map_err(|e| e.to_string())?;

    let planos = stmt
        .query_map([], |row| {
            Ok(PlanoFuturo {
                id: row.get(0)?,
                descricao: row.get(1)?,
                periodo: row.get(2)?,
                duracao_valor: row.get(3)?,
                duracao_unidade: row.get(4)?,
                valor: row.get(5)?,
                status: row.get(6)?,
                criado_em: row.get(7)?,
                alterado_em: row.get(8)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(planos)
}

#[tauri::command]
pub fn alterar_plano(
    state: State<DbState>,
    id: i64,
    descricao: String,
    periodo: Option<String>,
    duracao_valor: Option<String>,
    duracao_unidade: Option<String>,
    valor: Option<f64>,
    status: String,
) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE projetos_futuros
         SET descricao = ?1, periodo = ?2, duracao_valor = ?3, duracao_unidade = ?4,
             valor = ?5, status = ?6, alterado_em = datetime('now')
         WHERE id = ?7",
        params![
            descricao,
            periodo,
            duracao_valor,
            duracao_unidade,
            valor,
            status,
            id
        ],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn apagar_plano(state: State<DbState>, id: i64) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM projetos_futuros WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}
