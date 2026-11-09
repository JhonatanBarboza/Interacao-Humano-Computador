import { useCallback, useRef, useState } from "react";
import { ImagePlus, Pencil, Send, Trash2, X } from "lucide-react";
import { PainelShell } from "../../components/PainelShell/PainelShell";
import { PainelCabecalho } from "../../components/PainelShell/PainelCabecalho";
import { Button } from "../../components/Button/Button";
import { Field } from "../../components/Field/Field";
import { controlClass } from "../../components/Field/controlClass";
import { FilterChip } from "../../components/FilterChip/FilterChip";
import { Toast } from "../../components/Toast/Toast";
import { TIPOS_POST, excluirPost, formatarData, getPosts, salvarPost, useDados } from "../../data";
import { lerImagemReduzida } from "../../utils/imagem";
import styles from "./PainelPosts.module.css";

const MAX_FOTOS = 4;

function hoje() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const novoPost = () => ({ tipo: "resgate", titulo: "", data: hoje(), descricao: "", fotos: [] });

function Posts({ abrigo }) {
  const dados = useDados();
  const posts = getPosts(dados, abrigo.id);
  const inputFotos = useRef(null);
  const formRef = useRef(null);
  const [form, setForm] = useState(novoPost);
  const [erros, setErros] = useState({});
  const [toast, setToast] = useState(null);
  const fecharToast = useCallback(() => setToast(null), []);
  const editando = !!form.id;

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: undefined }));
  }

  async function adicionarFotos(arquivos) {
    const novas = [];
    for (const arq of [...arquivos].slice(0, MAX_FOTOS - form.fotos.length)) {
      if (!arq.type.startsWith("image/")) continue;
      try {
        novas.push(await lerImagemReduzida(arq));
      } catch {
        /* imagem ilegível: ignorada */
      }
    }
    setForm((f) => ({ ...f, fotos: [...f.fotos, ...novas] }));
  }

  function editar(post) {
    setForm({ ...post, fotos: post.fotos ?? [] });
    setErros({});
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function excluir(post) {
    if (!window.confirm(`Excluir a publicação “${post.titulo}”?`)) return;
    excluirPost(post.id);
    if (form.id === post.id) setForm(novoPost());
    setToast({ mensagem: "Publicação excluída.", acao: { label: "Desfazer", onClick: () => salvarPost(post) } });
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = {};
    if (!form.titulo.trim()) e.titulo = "Dê um título à publicação.";
    if (!form.data) e.data = "Informe a data.";
    if (!form.descricao.trim()) e.descricao = "Escreva uma descrição.";
    setErros(e);
    if (Object.keys(e).length) {
      document.getElementById(`post-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    const salvo = salvarPost({ ...form, titulo: form.titulo.trim(), abrigoId: abrigo.id });
    if (!salvo) {
      setErros({ descricao: "Não foi possível salvar: armazenamento do navegador cheio. Remova algumas fotos." });
      return;
    }
    setToast({ mensagem: editando ? "Publicação atualizada." : "Publicado! Já aparece no feed da plataforma e na sua página." });
    setForm(novoPost());
  }

  return (
    <>
      <PainelCabecalho
        titulo="Resgates e eventos"
        descricao="Divulgue resgates, campanhas e eventos. As publicações aparecem no feed da página inicial e na sua página institucional."
      />

      <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.formTopo}>
          <h3>{editando ? "Editar publicação" : "Nova publicação"}</h3>
          {editando && (
            <Button variant="ghost" size="sm" onClick={() => setForm(novoPost())}>
              Cancelar edição
            </Button>
          )}
        </div>

        <div className={styles.tipos} role="group" aria-label="Tipo de publicação">
          {Object.entries(TIPOS_POST).map(([valor, label]) => (
            <FilterChip key={valor} selected={form.tipo === valor} onClick={() => set("tipo", valor)}>
              {label}
            </FilterChip>
          ))}
        </div>

        <div className={styles.duas}>
          <Field label="Título" htmlFor="post-titulo" required error={erros.titulo}>
            <input
              id="post-titulo"
              className={controlClass}
              placeholder="Ex.: Feira de adoção no sábado"
              value={form.titulo}
              onChange={(e) => set("titulo", e.target.value)}
            />
          </Field>
          <Field label="Data" htmlFor="post-data" required error={erros.data}>
            <input id="post-data" type="date" className={controlClass} value={form.data} onChange={(e) => set("data", e.target.value)} />
          </Field>
        </div>

        <Field label="Descrição" htmlFor="post-descricao" required error={erros.descricao}>
          <textarea
            id="post-descricao"
            className={controlClass}
            placeholder="Conte o que aconteceu ou o que vai acontecer, onde e como as pessoas podem participar."
            value={form.descricao}
            onChange={(e) => set("descricao", e.target.value)}
          />
        </Field>

        <div className={styles.fotos}>
          {form.fotos.map((foto, i) => (
            <div key={`${i}-${foto.slice(-24)}`} className={styles.thumb}>
              <img src={foto} alt={`Foto ${i + 1}`} />
              <button type="button" aria-label={`Remover foto ${i + 1}`} onClick={() => set("fotos", form.fotos.filter((_, j) => j !== i))}>
                <X size={12} />
              </button>
            </div>
          ))}
          {form.fotos.length < MAX_FOTOS && (
            <button type="button" className={styles.addFoto} onClick={() => inputFotos.current?.click()}>
              <ImagePlus size={20} /> Foto
            </button>
          )}
          <input
            ref={inputFotos}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              adicionarFotos(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        <div className={styles.formRodape}>
          <Button type="submit">
            <Send size={16} /> {editando ? "Salvar alterações" : "Publicar"}
          </Button>
        </div>
      </form>

      <h3 className={styles.listaTitulo}>Suas publicações ({posts.length})</h3>
      {posts.length === 0 ? (
        <p className={styles.vazio}>Você ainda não publicou nada.</p>
      ) : (
        <ul className={styles.lista}>
          {posts.map((post) => (
            <li key={post.id} className={[styles.item, form.id === post.id ? styles.itemEditando : ""].join(" ")}>
              <div className={styles.itemInfo}>
                <span className={styles.itemMeta}>
                  {TIPOS_POST[post.tipo]} · {formatarData(post.data).completa}
                </span>
                <strong>{post.titulo}</strong>
                <p>{post.descricao}</p>
              </div>
              <div className={styles.itemAcoes}>
                <button type="button" title="Editar" aria-label={`Editar ${post.titulo}`} onClick={() => editar(post)}>
                  <Pencil size={16} />
                </button>
                <button type="button" title="Excluir" aria-label={`Excluir ${post.titulo}`} onClick={() => excluir(post)}>
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

export function PainelPosts() {
  return <PainelShell>{(abrigo) => <Posts abrigo={abrigo} />}</PainelShell>;
}
