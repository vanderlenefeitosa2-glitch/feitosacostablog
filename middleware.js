// Protege a página /painel com senha (Basic Auth).
// Defina PAINEL_USER e PAINEL_SENHA nas variáveis de ambiente.
import { NextResponse } from "next/server";

export const config = { matcher: ["/painel"] };

export function middleware(req) {
  const user = process.env.PAINEL_USER || "feitosa";
  const senha = process.env.PAINEL_SENHA;

  // Sem senha configurada, o painel fica aberto — configure PAINEL_SENHA antes de divulgar.
  if (!senha) return NextResponse.next();

  const auth = req.headers.get("authorization") || "";
  const [scheme, encoded] = auth.split(" ");
  if (scheme === "Basic" && encoded) {
    const decoded = atob(encoded);
    const i = decoded.indexOf(":");
    const u = decoded.slice(0, i);
    const p = decoded.slice(i + 1);
    if (u === user && p === senha) return NextResponse.next();
  }

  return new NextResponse("Autenticação necessária", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Painel Feitosa & Costa"' },
  });
}
