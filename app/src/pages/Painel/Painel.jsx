import { ArrowRight, Megaphone, PawPrint, Plus, RefreshCw, RotateCcw, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { PainelShell } from "../../components/PainelShell/PainelShell";
import { PainelCabecalho } from "../../components/PainelShell/PainelCabecalho";
import { Button } from "../../components/Button/Button";
import { cadastroIncompleto, getAnimaisPorAbrigo, restaurarDadosIniciais, useDados } from "../../data";
import styles from "./Painel.module.css";

function motivoIncompleto(animal) {
  if (!animal.fotos?.length) return "sem fotos";
  return "descrição muito curta";
}

export function Painel() {
  const dados = useDados();

  return (
    <PainelShell>
      {(abrigo) => {
        const animais = getAnimaisPorAbrigo(dados, abrigo.id);
        const incompletos = animais.filter(cadastroIncompleto);
        const stats = [
          { valor: animais.length, label: "animais cadastrados" },
          { valor: animais.filter((a) => a.status === "disponivel").length, label: "disponíveis para adoção" },
          { valor: animais.filter((a) => a.status === "em_processo").length, label: "em processo de adoção" },
          { valor: animais.filter((a) => a.status === "adotado").length, label: "adotados" },
        ];

        return (
          <>
            <PainelCabecalho titulo={`Olá, ${abrigo.nome}!`} descricao="O que você quer fazer hoje?" />

            <div className={styles.acoes}>
              <Link to="/painel/cadastro" className={[styles.acao, styles.acaoPrincipal].join(" ")}>
                <Plus size={26} aria-hidden="true" />
                <strong>Cadastrar animal</strong>
                <span>Nome, fotos e descrição em poucos minutos.</span>
              </Link>
              <Link to="/painel/animais" className={styles.acao}>
                <RefreshCw size={26} aria-hidden="true" />
                <strong>Atualizar status</strong>
                <span>Marque como adotado direto na lista, sem abrir o formulário.</span>
              </Link>
              <Link to="/painel/posts" className={styles.acao}>
                <Megaphone size={26} aria-hidden="true" />
                <strong>Publicar resgate ou evento</strong>
                <span>Aparece no feed da plataforma e na sua página.</span>
              </Link>
            </div>

            <div className={styles.stats}>
              {stats.map((s) => (
                <div key={s.label} className={styles.stat}>
                  <strong>{s.valor}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            <section className={styles.atencao}>
              <h3>
                <TriangleAlert size={18} aria-hidden="true" /> Cadastros que precisam de atenção
              </h3>
              {incompletos.length === 0 ? (
                <p className={styles.tudoCerto}>Todos os cadastros estão completos. Ótimo trabalho!</p>
              ) : (
                <ul>
                  {incompletos.map((a) => (
                    <li key={a.id}>
                      <PawPrint size={16} aria-hidden="true" />
                      <span>
                        <strong>{a.nome}</strong> — {motivoIncompleto(a)}
                      </span>
                      <Button to={`/painel/animais/${a.id}/editar`} variant="secondary" size="sm">
                        Completar <ArrowRight size={14} />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className={styles.rodape}>
              <button
                type="button"
                className={styles.restaurar}
                onClick={() => {
                  if (window.confirm("Restaurar os dados de demonstração? Todas as alterações feitas no protótipo serão perdidas.")) {
                    restaurarDadosIniciais();
                  }
                }}
              >
                <RotateCcw size={13} /> Restaurar dados de demonstração
              </button>
            </div>
          </>
        );
      }}
    </PainelShell>
  );
}
