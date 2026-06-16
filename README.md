# Blog Feitosa & Costa — Direito da Saúde

Blog corporativo em Next.js. Cada artigo é um arquivo Markdown em `content/posts/`.
Publicar = adicionar um `.md` e dar `git push` (a Vercel publica sozinha).

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em http://localhost:3000

## Publicar um artigo

1. A skill `/blog-artigos` cria o arquivo em `content/posts/{slug}.md`.
2. `npm run build` (valida).
3. `git add . && git commit -m "novo artigo" && git push`.
4. A Vercel detecta o push e publica em alguns minutos.

## Trocar as cores da marca

Edite as variáveis no topo de `app/globals.css` (bloco `:root`).

## Estrutura

- `content/posts/*.md` — os artigos (frontmatter: title, date, excerpt, category, readTime)
- `app/page.js` — home (destaque + grade por categoria)
- `app/blog/[slug]/page.js` — página do artigo
- `app/globals.css` — identidade visual
- `lib/posts.js` — leitura dos artigos

Categorias: Cirurgia Reparadora · Lipedema · Medicamentos Negados · Reajuste Abusivo · Seus Direitos no Plano
