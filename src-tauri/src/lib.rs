mod db;
mod migrations;
mod orcamento_mensal;
mod projetos_futuros;

pub use db::DbState;

use rusqlite::Connection;
use std::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db_dir = dirs::data_local_dir()
        .expect("Não foi possível obter o diretório de dados")
        .join("controlefinancas");
    std::fs::create_dir_all(&db_dir).expect("Falha ao criar diretório do banco");
    let conn = Connection::open(db_dir.join("db.sqlite3")).expect("Falha ao abrir banco de dados");

    migrations::init_db(&conn);

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(DbState(Mutex::new(conn)))
        .invoke_handler(tauri::generate_handler![
            orcamento_mensal::commands::criar_registro,
            orcamento_mensal::commands::listar_registros,
            orcamento_mensal::commands::alterar_registro,
            orcamento_mensal::commands::apagar_registro,
            orcamento_mensal::commands::apagar_todos_mes,
            orcamento_mensal::commands::alterar_status,
            orcamento_mensal::commands::alterar_prioridade,
            orcamento_mensal::commands::buscar_totais,
            projetos_futuros::commands::criar_projeto,
            projetos_futuros::commands::listar_projetos,
            projetos_futuros::commands::alterar_projeto,
            projetos_futuros::commands::alterar_prioridade_projeto,
            projetos_futuros::commands::apagar_projeto,
        ])
        .run(tauri::generate_context!())
        .expect("Erro ao executar aplicação Tauri");
}
