use rusqlite::{Connection, params};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

pub struct DbState(pub Mutex<Connection>);

#[derive(Serialize, Deserialize)]
pub struct Registro {
    pub id: i64,
    pub periodo: String,
    pub tipo: String,
    pub descricao: String,
    pub data: String,
    pub valor: f64,
    pub criado_em: String,
    pub alterado_em: String,
}

#[derive(Serialize)]
pub struct Totais {
    pub total_pagar: f64,
    pub total_receber: f64,
    pub diferenca: f64,
}

fn init_db(conn: &Connection) {
    conn.execute_batch("
        CREATE TABLE IF NOT EXISTS registros (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            periodo     TEXT    NOT NULL,
            tipo        TEXT    NOT NULL CHECK(tipo IN ('a_pagar', 'a_receber')),
            descricao   TEXT    NOT NULL,
            data        TEXT    NOT NULL,
            valor       REAL    NOT NULL CHECK(valor > 0),
            criado_em   TEXT    NOT NULL DEFAULT (datetime('now')),
            alterado_em TEXT    NOT NULL DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_registros_periodo ON registros(periodo);
    ").expect("Falha ao inicializar banco de dados");
}

#[tauri::command]
fn criar_registro(
    state: State<DbState>,
    periodo: String,
    tipo: String,
    descricao: String,
    data: String,
    valor: f64,
) -> Result<i64, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO registros (periodo, tipo, descricao, data, valor) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![periodo, tipo, descricao, data, valor],
    ).map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn listar_registros(state: State<DbState>, periodo: String) -> Result<Vec<Registro>, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, periodo, tipo, descricao, data, valor, criado_em, alterado_em FROM registros WHERE periodo = ?1 ORDER BY tipo, criado_em")
        .map_err(|e| e.to_string())?;

    let registros = stmt.query_map(params![periodo], |row| {
        Ok(Registro {
            id: row.get(0)?,
            periodo: row.get(1)?,
            tipo: row.get(2)?,
            descricao: row.get(3)?,
            data: row.get(4)?,
            valor: row.get(5)?,
            criado_em: row.get(6)?,
            alterado_em: row.get(7)?,
        })
    })
    .map_err(|e| e.to_string())?
    .collect::<Result<Vec<_>, _>>()
    .map_err(|e| e.to_string())?;

    Ok(registros)
}

#[tauri::command]
fn alterar_registro(
    state: State<DbState>,
    id: i64,
    tipo: String,
    descricao: String,
    data: String,
    valor: f64,
) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE registros SET tipo = ?1, descricao = ?2, data = ?3, valor = ?4, alterado_em = datetime('now') WHERE id = ?5",
        params![tipo, descricao, data, valor, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn apagar_registro(state: State<DbState>, id: i64) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM registros WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn apagar_todos_mes(state: State<DbState>, periodo: String) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM registros WHERE periodo = ?1", params![periodo])
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn buscar_totais(state: State<DbState>, periodo: String) -> Result<Totais, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;

    let total_pagar: f64 = conn
        .query_row(
            "SELECT COALESCE(SUM(valor), 0) FROM registros WHERE periodo = ?1 AND tipo = 'a_pagar'",
            params![periodo],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    let total_receber: f64 = conn
        .query_row(
            "SELECT COALESCE(SUM(valor), 0) FROM registros WHERE periodo = ?1 AND tipo = 'a_receber'",
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db_dir = dirs::data_local_dir()
        .expect("Não foi possível obter o diretório de dados")
        .join("controlefinancas");
    std::fs::create_dir_all(&db_dir).expect("Falha ao criar diretório do banco");
    let conn = Connection::open(db_dir.join("db.sqlite3"))
        .expect("Falha ao abrir banco de dados");

    init_db(&conn);

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(DbState(Mutex::new(conn)))
        .invoke_handler(tauri::generate_handler![
            criar_registro,
            listar_registros,
            alterar_registro,
            apagar_registro,
            apagar_todos_mes,
            buscar_totais,
        ])
        .run(tauri::generate_context!())
        .expect("Erro ao executar aplicação Tauri");
}
