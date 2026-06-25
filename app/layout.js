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

const WPP_NUMBER = "558888592229";
const WPP_MSG = encodeURIComponent(
  "Olá! Vim pelo blog da Feitosa & Costa e gostaria de tirar uma dúvida sobre o meu caso."
);
const WPP_URL = `https://wa.me/${WPP_NUMBER}?text=${WPP_MSG}`;

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
              <Link href="/contato">Contato</Link>
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

        <a
          href={WPP_URL}
          className="wpp-float"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </body>
    </html>
  );
}
