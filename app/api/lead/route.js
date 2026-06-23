// Webhook do CRM: recebe os leads do GPT Maker e grava na planilha.
// URL em produção: https://SEU-DOMINIO/api/lead
import { NextResponse } from "next/server";
import { appendLead } from "../../../lib/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ETAPAS = {
  1: "Entrou em contato",
  2: "Qualificado",
  3: "Evoluiu na conversa",
  4: "Agendou",
  5: "Fechou",
};

function agora() {
  return new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short",
  });
}

export async function POST(req) {
  // 1) Segurança: confere o segredo (header x-webhook-secret ou ?secret= na URL).
  const segredo = process.env.WEBHOOK_SECRET;
  if (segredo) {
    const enviado =
      req.headers.get("x-webhook-secret") ||
      new URL(req.url).searchParams.get("secret");
    if (enviado !== segredo) {
      return NextResponse.json({ ok: false, erro: "não autorizado" }, { status: 401 });
    }
  }

  // 2) Lê o corpo JSON.
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, erro: "JSON inválido" }, { status: 400 });
  }

  const etapaNum = parseInt(String(body.etapa ?? "1").trim(), 10) || 1;

  // 3) Monta a linha na ordem das colunas A–J da planilha.
  const linha = [
    String(body.telefone ?? "").replace(/\D/g, ""), // A  Telefone (só dígitos)
    body.nome ?? "",                                  // B  Nome
    body.dor ?? "",                                   // C  Dor / motivo do contato
    body.plano ?? "",                                 // D  Plano de saúde
    etapaNum,                                         // E  Etapa (nº)
    ETAPAS[etapaNum] ?? "",                            // F  Etapa (nome)
    body.motivo_nao_fechar ?? "",                     // G  Motivo de não fechar
    agora(),                                          // H  Carimbo do evento (1º contato = menor por lead)
    agora(),                                          // I  Atualizado em
    body.observacao ?? "",                            // J  Observação
  ];

  // 4) Grava.
  try {
    await appendLead(linha);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, erro: String(e?.message || e) },
      { status: 500 }
    );
  }
}

// Healthcheck simples para testar no navegador (GET).
export async function GET() {
  return NextResponse.json({ ok: true, servico: "webhook CRM Feitosa & Costa" });
}
