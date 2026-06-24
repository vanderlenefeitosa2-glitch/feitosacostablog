import "./globals.css";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

export const metadata = {
  title: {
    default: "Feitosa & Costa — Direito da Saúde",
    template: "%s · Feitosa & Costa",
  },
  description:
    "Conteúdo sobre seus direitos no plano de saúde: cirurgia reparadora, lipedema, medicamentos negados e reajuste abusivo. Informação clara, com acolhimento.",
};

// Evita o "flash" de tema errado: aplica o tema salvo antes da página pintar
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="brand-mark" aria-label="Feitosa & Costa - início">
              <span className="name">Feitosa &amp; Costa</span>
              <span className="tag">Direito da Saúde</span>
            </Link>
            <nav className="site-nav">
              <Link href="/">Artigos</Link>
              <Link href="/quem-sou">Quem sou</Link>
            </nav>
            <ThemeToggle />
          </div>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="container">
            <div className="disclaimer">
              Este blog tem caráter exclusivamente informativo e educativo. O
              conteúdo não constitui consulta nem garante resultado. Cada caso
              deve ser analisado individualmente.
            </div>
            <div>© Feitosa &amp; Costa · Direito da Saúde</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
