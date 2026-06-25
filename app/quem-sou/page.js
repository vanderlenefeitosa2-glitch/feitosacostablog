import Link from "next/link";

export const metadata = {
  title: "Quem sou",
  description:
    "Conheça a Dra. Vanderlene Feitosa — advogada em Direito da Saúde, dedicada a quem teve uma cirurgia negada pelo plano de saúde.",
};

export default function QuemSou() {
  return (
    <div className="container about">
      <div className="about-hero">
        <div className="about-photo">
          <img src="/vanderlene.jpg" alt="Dra. Vanderlene Feitosa" />
          <div className="about-figure-cap">Dra. Vanderlene Feitosa</div>
        </div>

        <div className="about-intro">
          <span className="about-role">Advogada · Direito da Saúde</span>
          <h1>Sou a Vanderlene Feitosa.</h1>

          <div className="about-prose">
            <p className="about-purpose">
              Defendo o direito da mulher de existir no seu próprio corpo.
            </p>
            <p>
              Atuo em Direito da Saúde, ao lado de pacientes que tiveram uma
              cirurgia reparadora negada pelo plano de saúde sob o argumento de
              que seria “estética”. Meu trabalho é esclarecer direitos sem
              juridiquês e oferecer acompanhamento sério a quem enfrenta essa
              situação.
            </p>
            <p>
              Acredito que toda mulher tem o direito de se reconhecer no próprio
              corpo, e que uma negativa de plano de saúde não pode ser a palavra
              final sobre a saúde e a dignidade de ninguém.
            </p>
            <p>
              Esse é o posicionamento da Feitosa &amp; Costa: informação clara,
              atuação responsável e o compromisso de que você não precisa
              enfrentar isso sozinha.
            </p>
          </div>

          <div className="creds">
            <div className="cred">
              <div className="k">Formação</div>
              <div className="v">Universidade do Grande Rio (Unigranrio)</div>
            </div>
            <div className="cred">
              <div className="k">Especialização</div>
              <div className="v">
                Especialista em Direito da Saúde, em atualização contínua por
                mentorias e masterminds na área
              </div>
            </div>
            <div className="cred">
              <div className="k">Registro</div>
              <div className="v">OAB/CE nº 57.395</div>
            </div>
            <div className="cred">
              <div className="k">Atuação</div>
              <div className="v">
                Tauá (CE), com atuação em todo o território nacional
              </div>
            </div>
          </div>

          <p style={{ marginTop: "32px" }}>
            <Link href="/" style={{ color: "var(--brand)", fontWeight: 600 }}>
              ← Voltar para os artigos
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
