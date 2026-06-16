import Link from "next/link";
import { getAllPosts, getPostsByCategory } from "../lib/posts";

function formatDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

export default function Home() {
  const all = getAllPosts();
  const featured = all[0];
  const sections = getPostsByCategory();

  return (
    <div className="container">
      <section className="hero">
        <h1>Seus direitos no plano de saúde, explicados com clareza.</h1>
        <p>
          Negativa de cirurgia reparadora, lipedema, medicamento negado,
          reajuste abusivo. Aqui você entende o seu direito sem juridiquês — e
          descobre que não está sozinha.
        </p>
      </section>

      {featured && (
        <Link href={`/blog/${featured.slug}`} className="featured">
          <span className="kicker">Em destaque · {featured.category}</span>
          <h2>{featured.title}</h2>
          <p>{featured.excerpt}</p>
          <span className="read">Ler o artigo →</span>
        </Link>
      )}

      {sections.map(({ category, posts }) => (
        <section className="cat-section" key={category}>
          <h2 className="cat-title">{category}</h2>
          <div className="grid">
            {posts.map((post) => (
              <article className="card" key={post.slug}>
                <span className="badge">{post.category}</span>
                <h3>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p>{post.excerpt}</p>
                <div className="meta">
                  {formatDate(post.date)}
                  {post.readTime ? ` · ${post.readTime}` : ""}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      {all.length === 0 && (
        <p style={{ color: "var(--muted)", padding: "40px 0" }}>
          Nenhum artigo publicado ainda. Use a skill <code>/blog-artigos</code>{" "}
          para criar o primeiro.
        </p>
      )}
    </div>
  );
}
