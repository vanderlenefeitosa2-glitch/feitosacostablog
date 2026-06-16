import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "../../../lib/posts";

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

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="article">
      <div className="container">
        <div className="article-head">
          <Link href="/" className="back">
            ← Voltar
          </Link>
          <div className="badge">{post.category}</div>
          <h1>{post.title}</h1>
          <div className="meta">
            {formatDate(post.date)}
            {post.readTime ? ` · ${post.readTime} de leitura` : ""}
          </div>
        </div>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </article>
  );
}
