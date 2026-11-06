import { useCallback, useState } from "react";
import { ExternalLink, Save } from "lucide-react";
import { PainelShell } from "../../components/PainelShell/PainelShell";
import { PainelCabecalho } from "../../components/PainelShell/PainelCabecalho";
import { Button } from "../../components/Button/Button";
import { Field } from "../../components/Field/Field";
import { controlClass } from "../../components/Field/controlClass";
import { Toast } from "../../components/Toast/Toast";
import { salvarAbrigo } from "../../data";
import styles from "./PainelPagina.module.css";

const OBRIGATORIOS = { nome: "Informe o nome da instituição.", sobre: "Conte um pouco sobre a instituição.", telefone: "Informe um telefone/WhatsApp para contato." };

function FormPagina({ abrigo }) {
  const [form, setForm] = useState(abrigo);
  const [erros, setErros] = useState({});
  const [toast, setToast] = useState(null);
  const fecharToast = useCallback(() => setToast(null), []);
  const alterado = JSON.stringify(form) !== JSON.stringify(abrigo);

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: undefined }));
  }

  function setImpacto(campo, valor) {
    setForm((f) => ({ ...f, impacto: { ...f.impacto, [campo]: Math.max(0, Number(valor) || 0) } }));
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = {};
    for (const [campo, msg] of Object.entries(OBRIGATORIOS)) if (!String(form[campo] ?? "").trim()) e[campo] = msg;
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail inválido.";
    if (form.linkDoacao && !/^https?:\/\//.test(form.linkDoacao)) e.linkDoacao = "O link deve começar com https://";
    setErros(e);
    if (Object.keys(e).length) {
      document.getElementById(Object.keys(e)[0])?.focus();
      return;
    }
    const normalizado = { ...form, instagram: (form.instagram ?? "").replace(/^@/, "").trim() };
    salvarAbrigo(normalizado);
    setForm(normalizado);
    setToast({ mensagem: "Página institucional atualizada." });
  }

  const input = (campo, props = {}) => (
    <input id={campo} className={controlClass} value={form[campo] ?? ""} onChange={(e) => set(campo, e.target.value)} {...props} />
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <PainelCabecalho
        titulo="Página institucional"
        descricao="Essas informações aparecem na página pública do abrigo e ajudam a gerar confiança e doações."
        acao={
          <Button href={`/abrigo/${abrigo.id}`} target="_blank" rel="noreferrer" variant="ghost" size="sm">
            Ver página pública <ExternalLink size={14} />
          </Button>
        }
      />

      <section className={styles.secao}>
        <h3>Identificação</h3>
        <div className={styles.duas}>
          <Field label="Nome da instituição" htmlFor="nome" required error={erros.nome}>
            {input("nome")}
          </Field>
          <Field label="Cidade" htmlFor="cidade" hint="Formato: Cidade - UF">
            {input("cidade")}
          </Field>
        </div>
        <Field label="Frase de apresentação" htmlFor="slogan" hint="Aparece no topo da página, abaixo do nome.">
          {input("slogan", { maxLength: 90 })}
        </Field>
        <Field label="Sobre a instituição" htmlFor="sobre" required error={erros.sobre}>
          <textarea id="sobre" className={controlClass} value={form.sobre} onChange={(e) => set("sobre", e.target.value)} />
        </Field>
      </section>

      <section className={styles.secao}>
        <h3>Contato e redes sociais</h3>
        <Field label="Endereço" htmlFor="endereco">
          {input("endereco")}
        </Field>
        <div className={styles.duas}>
          <Field label="Telefone / WhatsApp" htmlFor="telefone" required error={erros.telefone} hint="Usado no botão “Falar com o abrigo”.">
            {input("telefone", { type: "tel", placeholder: "(16) 99999-9999" })}
          </Field>
          <Field label="E-mail" htmlFor="email" error={erros.email}>
            {input("email", { type: "email" })}
          </Field>
        </div>
        <Field label="Instagram" htmlFor="instagram" hint="Só o nome de usuário, sem @.">
          {input("instagram", { placeholder: "seuabrigo" })}
        </Field>
      </section>

      <section className={styles.secao}>
        <h3>Como ajudar</h3>
        <Field
          label="Link para doação"
          htmlFor="linkDoacao"
          error={erros.linkDoacao}
          hint="Página externa de doação (PIX, vaquinha etc.). A plataforma não processa pagamentos."
        >
          {input("linkDoacao", { type: "url", placeholder: "https://" })}
        </Field>
        <div className={styles.duas}>
          <Field label="Itens que vocês aceitam" htmlFor="itensDoacao">
            <textarea id="itensDoacao" className={controlClass} value={form.itensDoacao ?? ""} onChange={(e) => set("itensDoacao", e.target.value)} />
          </Field>
          <Field label="Como ser voluntário" htmlFor="voluntariado">
            <textarea id="voluntariado" className={controlClass} value={form.voluntariado ?? ""} onChange={(e) => set("voluntariado", e.target.value)} />
          </Field>
        </div>
      </section>

      <section className={styles.secao}>
        <h3>Pré-requisitos para adoção</h3>
        <Field htmlFor="requisitos" hint="Um por linha. Aparecem no perfil de cada animal, antes do botão de contato — assim você recebe menos dúvidas básicas.">
          <textarea id="requisitos" className={controlClass} value={form.requisitos ?? ""} onChange={(e) => set("requisitos", e.target.value)} />
        </Field>
      </section>

      <section className={styles.secao}>
        <h3>Nosso impacto</h3>
        <div className={styles.tres}>
          <Field label="Animais resgatados" htmlFor="resgatados">
            <input id="resgatados" type="number" min="0" className={controlClass} value={form.impacto.resgatados} onChange={(e) => setImpacto("resgatados", e.target.value)} />
          </Field>
          <Field label="Adoções realizadas" htmlFor="adocoes">
            <input id="adocoes" type="number" min="0" className={controlClass} value={form.impacto.adocoes} onChange={(e) => setImpacto("adocoes", e.target.value)} />
          </Field>
          <Field label="Voluntários ativos" htmlFor="voluntarios">
            <input id="voluntarios" type="number" min="0" className={controlClass} value={form.impacto.voluntarios} onChange={(e) => setImpacto("voluntarios", e.target.value)} />
          </Field>
        </div>
      </section>

      <div className={styles.rodape}>
        <Button variant="secondary" onClick={() => setForm(abrigo)} disabled={!alterado}>
          Descartar alterações
        </Button>
        <Button type="submit" disabled={!alterado}>
          <Save size={16} /> Salvar página
        </Button>
      </div>

      <Toast mensagem={toast?.mensagem} onClose={fecharToast} />
    </form>
  );
}

export function PainelPagina() {
  return <PainelShell>{(abrigo) => <FormPagina key={abrigo.id} abrigo={abrigo} />}</PainelShell>;
}
