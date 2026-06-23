# CRM + Painel no seu domínio — guia de configuração

O blog agora tem duas peças novas:

- **Webhook** `https://SEU-DOMINIO/api/lead` — recebe os leads do GPT Maker e grava na planilha.
- **Painel** `https://SEU-DOMINIO/painel` — dashboard do funil, protegido por senha.

Os dados ficam na sua planilha do Google (id `1IkkZDfr2VPGAK5g3ZySwvXWjpdbuAaQFb0ekuaMBImQ`).

Siga na ordem. Faça uma vez só.

---

## 1. Criar a conta de serviço do Google (acesso à planilha)

1. Acesse https://console.cloud.google.com → crie um projeto (ex: "crm-feitosa").
2. Menu → **APIs e serviços → Biblioteca** → busque **Google Sheets API** → **Ativar**.
3. Menu → **APIs e serviços → Credenciais** → **Criar credenciais → Conta de serviço**.
   - Nome: `crm-webhook` → **Concluir**.
4. Clique na conta criada → aba **Chaves** → **Adicionar chave → Criar nova chave → JSON**. Baixa um arquivo `.json` — guarde.
5. Abra o `.json`: você vai usar dois campos:
   - `client_email` → vira `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → vira `GOOGLE_PRIVATE_KEY`

## 2. Dar acesso da conta de serviço à planilha

1. Abra a planilha **CRM Feitosa & Costa — Leads (oficial)**.
2. Botão **Compartilhar** → cole o `client_email` (ex: `crm-webhook@crm-feitosa.iam.gserviceaccount.com`) → permissão **Editor** → enviar.

## 3. Configurar as variáveis na Vercel

Em **Project → Settings → Environment Variables**, adicione (ver `.env.example`):

| Variável | Valor |
|---|---|
| `CRM_SHEET_ID` | `1IkkZDfr2VPGAK5g3ZySwvXWjpdbuAaQFb0ekuaMBImQ` |
| `CRM_SHEET_NAME` | `Página1` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | o `client_email` do JSON |
| `GOOGLE_PRIVATE_KEY` | o `private_key` do JSON (cole inteiro, com as `\n`) |
| `WEBHOOK_SECRET` | invente um segredo longo |
| `PAINEL_USER` | `feitosa` (ou o que quiser) |
| `PAINEL_SENHA` | a senha do painel |

> A `GOOGLE_PRIVATE_KEY` deve ficar entre aspas e com `\n` no lugar das quebras de linha — é como aparece no JSON.

Depois de salvar, faça **Redeploy** do projeto.

## 4. Apontar o GPT Maker pro seu webhook

Na intenção **"Atualizar CRM do lead"** do GPT Maker:

- **Método:** `POST`
- **URL:** `https://SEU-DOMINIO/api/lead`
- **Header:** `x-webhook-secret` = o mesmo valor de `WEBHOOK_SECRET`
- **Corpo (JSON):**
```json
{
  "telefone": "@telefone_do_contato",
  "nome": "{{nome}}",
  "dor": "{{dor}}",
  "plano": "{{plano}}",
  "etapa": "{{etapa}}",
  "motivo_nao_fechar": "{{motivo_nao_fechar}}",
  "observacao": "{{observacao}}"
}
```

Escala da etapa: **1** entrou em contato · **2** qualificado · **3** evoluiu · **4** agendou · **5** fechou.

## 5. Testar

- Abra `https://SEU-DOMINIO/api/lead` no navegador → deve responder `{"ok":true,...}` (healthcheck GET).
- Dispare uma conversa de teste no WhatsApp → a linha deve aparecer na planilha.
- Abra `https://SEU-DOMINIO/painel` → pede usuário/senha → mostra o funil.

---

### Como funciona por dentro
- O webhook é **append-only**: cada atualização do agente vira uma linha. O painel junta por telefone (mantém a maior etapa e o 1º contato mais antigo), então o funil fica sempre correto mesmo com várias linhas do mesmo lead.
- O painel lê a planilha a cada acesso (sem cache), então está sempre atualizado.
