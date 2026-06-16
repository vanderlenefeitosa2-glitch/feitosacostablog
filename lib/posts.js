import fs from "fs";
import path from "path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

const postsDir = path.join(process.cwd(), "content", "posts");

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

// Ordem de exibição das categorias na home (segue a prioridade das teses)
export const CATEGORY_ORDER = [
  "Cirurgia Reparadora",
  "Lipedema",
  "Medicamentos Negados",
  "Reajuste Abusivo",
  "Seus Direitos no Plano",
];

export function getAllPosts() {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
    const { data } = matter(raw);
    return {
      slug,
      title: data.title || slug,
      date: data.date || "",
      excerpt: data.excerpt || "",
      category: data.category || "Seus Direitos no Plano",
      readTime: data.readTime || "",
    };
  });
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  const full = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(full)) return null;
  const raw = fs.readFileSync(full, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || slug,
    date: data.date || "",
    excerpt: data.excerpt || "",
    category: data.category || "Seus Direitos no Plano",
    readTime: data.readTime || "",
    html: md.render(content),
  };
}

export function getPostsByCategory() {
  const posts = getAllPosts();
  const grouped = {};
  for (const cat of CATEGORY_ORDER) grouped[cat] = [];
  for (const post of posts) {
    if (!grouped[post.category]) grouped[post.category] = [];
    grouped[post.category].push(post);
  }
  // Retorna só categorias que têm post, na ordem definida
  return CATEGORY_ORDER.filter((c) => grouped[c] && grouped[c].length).map(
    (c) => ({ category: c, posts: grouped[c] })
  );
}
