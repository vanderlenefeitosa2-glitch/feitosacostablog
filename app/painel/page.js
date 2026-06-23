// Painel do funil de atendimento — lê a planilha do CRM e mostra as métricas.
// Protegido por senha (Basic Auth) no middleware.js.
import { getRows } from "../../lib/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // sempre lê os dados mais recentes
export const metadata = { title: "Painel do funil", robots: { index: false } };

// Junta as linhas por telefone: mantém a maior etapa, o 1º contato mais antigo
// e os dados mais recentes de cada lead.
function consolidar(rows) {
  const mapa = new Map();
  for (const r of rows) {
    const tel = String(r[0] || "").trim();
    if (!tel) continue;
    const etapa = parseInt(r[4] || "0", 10) || 0;
    const atual = mapa.get(tel);
    if (!atual) {
      mapa.set(tel, {
        tel,
        nome: r[1] || "",
        dor: r[2] || "",
        plano: r[3] || "",
        etapa,
        etapaNome: r[5] || "",
        motivo: r[6] || "",
        primeiro: r[7] || "",
        atualizado: r[8] || "",
      });
    } else {
      if (etapa >= atual.etapa) {
        atual.etapa = etapa;
        atual.etapaNome = r[5] || atual.etapaNome;
        if (r[2]) atual.dor = r[2];
        if (r[3]) atual.plano = r[3];
        if (r[8]) atual.atualizado = r[8];
      }
      if (r[6]) atual.motivo = r[6];
      if (!atual.nome && r[1]) atual.nome = r[1];
    }
  }
  return [...mapa.values()];
}

function tally(items) {
  const m = new Map();
  for (const it of items) {
    if (!it) continue;
    m.set(it, (m.get(it) || 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function Card({ rotulo, valor, destaque }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ fontSize: 13, color: "var(--muted)" }}>{rotulo}</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4, color: destaque ? "var(--brand)" : "var(--text)" }}>{valor}</div>
    </div>
  );
}

function Barras({ titulo, dados, cor }) {
  const max = Math.max(1, ...dados.map((d) => d[1]));
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>{titulo}</div>
      {dados.length === 0 && <div style={{ color: "var(--muted)", fontSize: 14 }}>Sem dados ainda.</div>}
      {dados.map(([nome, n]) => (
        <div key={nome} style={{ display: "flex", alignItems: "center", gap: 10, margin: "8px 0" }}>
          <div style={{ width: 150, fontSize: 13, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nome}</div>
          <div style={{ flex: 1, background: "var(--border)", borderRadius: 6, height: 16 }}>
            <div style={{ width: `${(n / max) * 100}%`, background: cor || "var(--brand)", height: 16, borderRadius: 6 }} />
          </div>
          <div style={{ width: 28, textAlign: "right", fontSize: 13, fontWeight: 700 }}>{n}</div>
        </div>
      ))}
    </div>
  );
}

export default async function Painel() {
  let leads = [];
  let erro = null;
  try {
    leads = consolidar(await getRows());
  } catch (e) {
    erro = String(e?.message || e);
  }

  if (erro) {
    return (
      <div className="container" style={{ padding: "48px 24px", maxWidth: 720 }}>
        <h1>Painel do funil</h1>
        <p style={{ color: "var(--muted)" }}>
          O painel ainda não consegue ler a planilha. Verifique as variáveis de ambiente na Vercel
          (conta de serviço e ID da planilha). Detalhe técnico:
        </p>
        <pre style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 12, fontSize: 13, whiteSpace: "pre-wrap" }}>{erro}</pre>
      </div>
    );
  }

  const emContato = leads.length;
  const semPlano = leads.filter((l) => l.plano === "Não tem").length;
  const evoluiram = leads.filter((l) => l.etapa >= 3).length;
  const agendaram = leads.filter((l) => l.etapa >= 4).length;
  const fecharam = leads.filter((l) => l.etapa >= 5).length;

  const dores = tally(leads.map((l) => l.dor).filter(Boolean));
  const planos = tally(leads.map((l) => l.plano).filter(Boolean));
  const motivos = tally(leads.filter((l) => l.etapa < 5).map((l) => l.motivo).filter(Boolean));

  const recentes = [...leads].reverse().slice(0, 12);
  const planilhaUrl = process.env.CRM_SHEET_URL || `https://docs.google.com/spreadsheets/d/${process.env.CRM_SHEET_ID || ""}/edit`;

  return (
    <div className="container" style={{ padding: "40px 24px", maxWidth: 980 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Funil de atendimento</h1>
        <a href={planilhaUrl} target="_blank" rel="noopener" style={{ fontSize: 14 }}>Abrir planilha completa ↗</a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 28 }}>
        <Card rotulo="Em contato" valor={emContato} />
        <Card rotulo="Sem plano" valor={semPlano} />
        <Card rotulo="Evoluíram" valor={evoluiram} />
        <Card rotulo="Agendaram" valor={agendaram} />
        <Card rotulo="Fecharam" valor={fecharam} destaque />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 16 }}>
        <Barras titulo="Dores mais comuns" dados={dores} cor="var(--brand)" />
        <Barras titulo="Situação do plano" dados={planos} cor="var(--brand-soft)" />
      </div>

      <div style={{ marginBottom: 24 }}>
        <Barras titulo="Por que não fecharam (objeções)" dados={motivos} cor="var(--accent)" />
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Últimos leads</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ color: "var(--muted)", textAlign: "left" }}>
                <th style={{ padding: "6px 8px", fontWeight: 400 }}>Nome</th>
                <th style={{ padding: "6px 8px", fontWeight: 400 }}>Dor</th>
                <th style={{ padding: "6px 8px", fontWeight: 400 }}>Plano</th>
                <th style={{ padding: "6px 8px", fontWeight: 400 }}>Etapa</th>
                <th style={{ padding: "6px 8px", fontWeight: 400 }}>Não fechou</th>
              </tr>
            </thead>
            <tbody>
              {recentes.length === 0 && (
                <tr><td colSpan={5} style={{ padding: "10px 8px", color: "var(--muted)" }}>Nenhum lead ainda. Assim que o GPT Maker registrar o primeiro, ele aparece aqui.</td></tr>
              )}
              {recentes.map((l, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "8px" }}>{l.nome || "—"}</td>
                  <td style={{ padding: "8px" }}>{l.dor || "—"}</td>
                  <td style={{ padding: "8px" }}>{l.plano || "—"}</td>
                  <td style={{ padding: "8px" }}>{l.etapaNome || "—"}</td>
                  <td style={{ padding: "8px", color: l.motivo ? "var(--accent)" : "var(--muted)" }}>{l.motivo || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
