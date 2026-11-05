import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, Pencil, PawPrint, Plus, Search, Trash2, TriangleAlert } from "lucide-react";
import { PainelShell } from "../../components/PainelShell/PainelShell";
import { PainelCabecalho } from "../../components/PainelShell/PainelCabecalho";
import { Button } from "../../components/Button/Button";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { Toast } from "../../components/Toast/Toast";
import { controlClass } from "../../components/Field/controlClass";
import {
  STATUS_LABEL,
  alterarStatusAnimal,
  cadastroIncompleto,
  excluirAnimal,
  getAnimaisPorAbrigo,
  salvarAnimal,
  useDados,
} from "../../data";
import styles from "./PainelAnimais.module.css";

const STATUS_OPCOES = ["disponivel", "em_processo", "adotado"];
const STATUS_CURTO = { disponivel: "Disponível", em_processo: "Em processo", adotado: "Adotado" };

function ListaAnimais({ abrigo }) {
  const dados = useDados();
  const location = useLocation();
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  // aviso vindo do formulário de cadastro/edição (via state da navegação)
  const [toast, setToast] = useState(location.state?.toast ?? null);
  const fecharToast = useCallback(() => setToast(null), []);

  const todos = getAnimaisPorAbrigo(dados, abrigo.id);
  const animais = todos.filter(
    (a) => (!filtroStatus || a.status === filtroStatus) && a.nome.toLowerCase().includes(busca.trim().toLowerCase()),
  );

  function mudarStatus(animal, novo) {
    const anterior = animal.status;
    alterarStatusAnimal(animal.id, novo);
    setToast({
      mensagem: `${animal.nome}: status alterado para “${STATUS_LABEL[novo]}”.`,
      acao: { label: "Desfazer", onClick: () => alterarStatusAnimal(animal.id, anterior) },
    });
  }

  function excluir(animal) {
    if (!window.confirm(`Excluir o cadastro de ${animal.nome}? Ele deixará de aparecer na plataforma.`)) return;
    excluirAnimal(animal.id);
    setToast({
      mensagem: `Cadastro de ${animal.nome} excluído.`,
      acao: { label: "Desfazer", onClick: () => salvarAnimal(animal) },
    });
  }

  return (
    <>
      <PainelCabecalho
        titulo="Meus animais"
        descricao={`Gerencie os animais cadastrados pelo ${abrigo.nome}. Altere o status direto na lista.`}
        acao={
          <Button to="/painel/cadastro">
            <Plus size={16} /> Cadastrar animal
          </Button>
        }
      />

      <div className={styles.toolbar}>
        <div className={styles.busca}>
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            className={controlClass}
            placeholder="Buscar por nome..."
            aria-label="Buscar por nome"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <select className={controlClass} aria-label="Filtrar por status" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
          <option value="">Todos os status ({todos.length})</option>
          {STATUS_OPCOES.map((s) => (
            <option key={s} value={s}>
              {STATUS_CURTO[s]} ({todos.filter((a) => a.status === s).length})
            </option>
          ))}
        </select>
      </div>

      {animais.length === 0 ? (
        <EmptyState
          title={todos.length ? "Nenhum animal encontrado" : "Você ainda não cadastrou animais"}
          description={todos.length ? "Ajuste a busca ou o filtro de status." : "Comece cadastrando o primeiro animal do abrigo."}
          action={
            <Button to="/painel/cadastro">
              <Plus size={16} /> Cadastrar animal
            </Button>
          }
        />
      ) : (
        <ul className={styles.lista}>
          {animais.map((animal) => (
            <li key={animal.id} className={styles.linha}>
              <div className={styles.foto}>
                {animal.fotos?.[0] ? <img src={animal.fotos[0]} alt="" /> : <PawPrint size={22} aria-hidden="true" />}
              </div>
              <div className={styles.info}>
                <strong>{animal.nome}</strong>
                <span>
                  {animal.especie} · {animal.porte} · {animal.sexo} · {animal.idade}
                </span>
                {cadastroIncompleto(animal) && (
                  <span className={styles.incompleto}>
                    <TriangleAlert size={13} aria-hidden="true" /> Cadastro incompleto
                  </span>
                )}
              </div>
              <div className={styles.status} role="group" aria-label={`Status de ${animal.nome}`}>
                {STATUS_OPCOES.map((s) => (
                  <button
                    type="button"
                    key={s}
                    className={[styles.statusBtn, styles[`status-${s}`], animal.status === s ? styles.statusAtivo : ""].join(" ")}
                    aria-pressed={animal.status === s}
                    onClick={() => animal.status !== s && mudarStatus(animal, s)}
                  >
                    {STATUS_CURTO[s]}
                  </button>
                ))}
              </div>
              <div className={styles.acoes}>
                <button type="button" className={styles.iconBtn} title="Editar" aria-label={`Editar ${animal.nome}`} onClick={() => navigate(`/painel/animais/${animal.id}/editar`)}>
                  <Pencil size={16} />
                </button>
                <a className={styles.iconBtn} href={`/animal/${animal.id}`} target="_blank" rel="noreferrer" title="Ver perfil público" aria-label={`Ver perfil público de ${animal.nome}`}>
                  <Eye size={16} />
                </a>
                <button type="button" className={[styles.iconBtn, styles.perigo].join(" ")} title="Excluir" aria-label={`Excluir ${animal.nome}`} onClick={() => excluir(animal)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Toast mensagem={toast?.mensagem} acao={toast?.acao} onClose={fecharToast} />
    </>
  );
}

export function PainelAnimais() {
  return <PainelShell>{(abrigo) => <ListaAnimais abrigo={abrigo} />}</PainelShell>;
}
