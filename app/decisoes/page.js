import Link from "next/link";
import { getDecisionPosts } from "../../lib/posts";

export const metadata = {
  title: "Decisões · O Que a Justiça Tem Decidido",
  description:
    "Decisões públicas dos tribunais sobre negativas de plano de saúde, explicadas em linguagem clara. Cada caso é avaliado individualmente.",
};

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

export default function Decisoes() {
  const posts = getDecisionPosts();

  return (
    <div className="container">
      <section className="hero">
        <h1>O que a Justiça tem decidido</h1>
        <p>
          Decisões públicas dos tribunais sobre negativas de plano de saúde,
          explicadas em linguagem de gente. Nenhuma delas é caso deste
          escritório. Elas mostram como a Justiça brasileira tem tratado quem
          teve um direito negado.
        </p>
      </section>

      <section className="cat-section">
        <div className="decisoes-grid">
          {posts.map((post) => (
            <article className="decisao-card" key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="decisao-link">
                {post.image && (
                  <img
                    className="decisao-arte"
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                  />
                )}
                <div className="decisao-body">
                  <p>{post.excerpt}</p>
                  <span className="decisao-meta">
                    {formatDate(post.date)}
                    {post.readTime ? ` · ${post.readTime}` : ""}
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="empty-note">
            Em breve, as primeiras decisões comentadas aparecem aqui.
          </p>
        )}
      </section>

      <section className="decisoes-aviso">
        <p>
          Cada caso é avaliado individualmente. As decisões reunidas aqui têm
          finalidade informativa e não representam promessa de resultado. Se
          você teve uma cobertura negada, reúna a negativa por escrito, o laudo
          do seu médico e os documentos do plano, e procure uma advogada de sua
          confiança, com atuação em Direito da Saúde.
        </p>
      </section>
    </div>
  );
}
