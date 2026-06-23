// Acesso à planilha do CRM (Google Sheets) via conta de serviço.
// Configurado pelas variáveis de ambiente — ver .env.example e SETUP-CRM.md.
import { google } from "googleapis";

const SHEET_ID = process.env.CRM_SHEET_ID;
const SHEET_NAME = process.env.CRM_SHEET_NAME || "Página1";

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // A chave privada vem com "\n" escapado nas variáveis de ambiente da Vercel.
  const key = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  if (!email || !key || !SHEET_ID) {
    throw new Error(
      "CRM não configurado: faltam GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY ou CRM_SHEET_ID."
    );
  }
  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function client() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

// Adiciona uma linha no fim da planilha (modelo append-only:
// cada atualização de lead é uma linha; a deduplicação acontece no painel).
export async function appendLead(row) {
  await client().spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A:J`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}

// Lê todas as linhas de dados (sem o cabeçalho).
export async function getRows() {
  const res = await client().spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:J`,
  });
  return res.data.values || [];
}
