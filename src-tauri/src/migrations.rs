use rusqlite::Connection;

pub fn init_db(conn: &Connection) {
    // Renomear dados_mensais → orcamento_mensal (instalações existentes)
    let has_dados_mensais: bool = conn
        .query_row(
            "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='dados_mensais'",
            [],
            |row| row.get::<_, i64>(0),
        )
        .unwrap_or(0) > 0;

    if has_dados_mensais {
        conn.execute_batch("ALTER TABLE dados_mensais RENAME TO orcamento_mensal;")
            .expect("Falha ao renomear tabela dados_mensais");
    }

    // Renomear planos_futuros → projetos_futuros (instalações existentes)
    let has_planos_futuros: bool = conn
        .query_row(
            "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='planos_futuros'",
            [],
            |row| row.get::<_, i64>(0),
        )
        .unwrap_or(0) > 0;

    if has_planos_futuros {
        conn.execute_batch("ALTER TABLE planos_futuros RENAME TO projetos_futuros;")
            .expect("Falha ao renomear tabela planos_futuros");
    }

    let has_old_data: bool = conn
        .query_row(
            "SELECT COUNT(*) FROM pragma_table_info('orcamento_mensal') WHERE name = 'data'",
            [],
            |row| row.get::<_, i64>(0),
        )
        .unwrap_or(0) > 0;

    if has_old_data {
        conn.execute_batch("ALTER TABLE orcamento_mensal RENAME COLUMN data TO data_vencimento;")
            .expect("Falha ao renomear coluna data");
    }

    let has_status_column: bool = conn
        .query_row(
            "SELECT COUNT(*) FROM pragma_table_info('orcamento_mensal') WHERE name = 'status_pagamento'",
            [],
            |row| row.get::<_, i64>(0),
        )
        .unwrap_or(0) > 0;

    if !has_status_column {
        conn.execute_batch("
            ALTER TABLE orcamento_mensal ADD COLUMN status_pagamento TEXT NOT NULL DEFAULT 'pendente';
            ALTER TABLE orcamento_mensal ADD COLUMN observacao TEXT;
        ").expect("Falha ao adicionar colunas de status");
    }

    let has_valor_total: bool = conn
        .query_row(
            "SELECT COUNT(*) FROM pragma_table_info('orcamento_mensal') WHERE name = 'valor_total'",
            [],
            |row| row.get::<_, i64>(0),
        )
        .unwrap_or(0) > 0;

    if !has_valor_total {
        conn.execute_batch("
            ALTER TABLE orcamento_mensal RENAME COLUMN valor TO valor_total;
            ALTER TABLE orcamento_mensal ADD COLUMN valor_realizado REAL NOT NULL DEFAULT 0;
            ALTER TABLE orcamento_mensal ADD COLUMN prioridade INTEGER NOT NULL DEFAULT 0;
        ").expect("Falha ao migrar colunas de valor e prioridade");
    }

    conn.execute_batch("
        CREATE TABLE IF NOT EXISTS orcamento_mensal (
            id                INTEGER PRIMARY KEY AUTOINCREMENT,
            periodo           TEXT    NOT NULL,
            tipo              TEXT    NOT NULL CHECK(tipo IN ('a_pagar', 'a_receber')),
            descricao         TEXT    NOT NULL,
            data_vencimento   TEXT    NOT NULL,
            valor_total       REAL    NOT NULL CHECK(valor_total > 0),
            valor_realizado   REAL    NOT NULL DEFAULT 0,
            prioridade        INTEGER NOT NULL DEFAULT 0,
            status_pagamento  TEXT    NOT NULL DEFAULT 'pendente' CHECK(status_pagamento IN ('pendente','parcial','quitado')),
            observacao        TEXT,
            criado_em         TEXT    NOT NULL DEFAULT (datetime('now')),
            alterado_em       TEXT    NOT NULL DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_orcamento_mensal_periodo ON orcamento_mensal(periodo);

        CREATE TABLE IF NOT EXISTS projetos_futuros (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao        TEXT    NOT NULL,
            periodo          TEXT,
            duracao_valor    TEXT,
            duracao_unidade  TEXT    CHECK(duracao_unidade IN ('dias','semanas','meses','anos')),
            valor            REAL,
            status           TEXT    NOT NULL DEFAULT 'ideia'
                                     CHECK(status IN ('ideia','planejando','em andamento','concluído')),
            criado_em        TEXT    NOT NULL DEFAULT (datetime('now')),
            alterado_em      TEXT    NOT NULL DEFAULT (datetime('now'))
        );
    ").expect("Falha ao inicializar banco de dados");
}
