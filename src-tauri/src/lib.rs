mod db;
mod migrations;
mod registros;
mod planos_futuros;

pub use db::DbState;

use rusqlite::Connection;
use std::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db_dir = dirs::data_local_dir()
        .expect("Não foi possível obter o diretório de dados")
        .join("controlefinancas");
    std::fs::create_dir_all(&db_dir).expect("Falha ao criar diretório do banco");
    let conn = Connection::open(db_dir.join("db.sqlite3"))
        .expect("Falha ao abrir banco de dados");

    migrations::init_db(&conn);

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(DbState(Mutex::new(conn)))
        .invoke_handler(tauri::generate_handler![
            registros::commands::criar_registro,
            registros::commands::listar_registros,
            registros::commands::alterar_registro,
            registros::commands::apagar_registro,
            registros::commands::apagar_todos_mes,
            registros::commands::alterar_status,
            registros::commands::alterar_prioridade,
            registros::commands::buscar_totais,
            planos_futuros::commands::criar_plano,
            planos_futuros::commands::listar_planos,
            planos_futuros::commands::alterar_plano,
            planos_futuros::commands::apagar_plano,
        ])
        .run(tauri::generate_context!())
        .expect("Erro ao executar aplicação Tauri");
}
