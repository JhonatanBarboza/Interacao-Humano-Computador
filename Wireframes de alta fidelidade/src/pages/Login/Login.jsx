import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, PawPrint } from "lucide-react";
import { Button } from "../../components/Button/Button";
import { Field } from "../../components/Field/Field";
import { controlClass } from "../../components/Field/controlClass";
import { useDados } from "../../data";
import { useSessao } from "../../hooks/useSessao";
import styles from "./Login.module.css";

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Login() {
  const dados = useDados();
  const { abrigoId, entrar } = useSessao();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState({});
  const [recuperacao, setRecuperacao] = useState("");

  if (abrigoId) return <Navigate to="/painel" replace />;

  function validar() {
    const e = {};
    if (!EMAIL_VALIDO.test(email.trim())) e.email = "Informe um e-mail válido, como contato@seuabrigo.org.br.";
    else if (!dados.abrigos.some((a) => a.email === email.trim().toLowerCase()))
      e.email = "Não encontramos uma instituição com este e-mail. Confira se digitou corretamente.";
    if (!senha) e.senha = "Informe sua senha.";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    if (Object.keys(e).length) return;
    const abrigo = dados.abrigos.find((a) => a.email === email.trim().toLowerCase());
    entrar(abrigo.id);
    navigate("/painel");
  }

  function esqueciSenha() {
    if (!EMAIL_VALIDO.test(email.trim())) {
      setErros({ email: "Digite seu e-mail institucional para recuperar a senha." });
      return;
    }
    setErros({});
    setRecuperacao(`Se ${email.trim()} estiver cadastrado, você receberá um link para criar uma nova senha.`);
  }

  return (
    <div className={styles.shell}>
      <main className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            <PawPrint size={24} />
          </span>
          <h1>Painel da Instituição</h1>
          <p>Acesse para gerenciar os animais e a página do seu abrigo.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <Field label="E-mail institucional" htmlFor="email" error={erros.email}>
            <input
              id="email"
              type="email"
              autoComplete="username"
              className={controlClass}
              placeholder="contato@seuabrigo.org.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!erros.email}
            />
          </Field>
          <Field label="Senha" htmlFor="senha" error={erros.senha}>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              className={controlClass}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              aria-invalid={!!erros.senha}
            />
          </Field>
          <div className={styles.linha}>
            <button type="button" className={styles.link} onClick={esqueciSenha}>
              Esqueci minha senha
            </button>
          </div>
          {recuperacao && (
            <p className={styles.sucesso} role="status">
              {recuperacao}
            </p>
          )}
          <Button type="submit" size="lg" block>
            <Lock size={16} /> Entrar no painel
          </Button>
        </form>

        <div className={styles.demo}>
          <strong>Protótipo — contas de demonstração</strong>
          <span>Clique para preencher (qualquer senha funciona):</span>
          <div className={styles.demoContas}>
            {dados.abrigos.map((a) => (
              <button
                type="button"
                key={a.id}
                onClick={() => {
                  setEmail(a.email);
                  setSenha("demo1234");
                  setErros({});
                }}
              >
                {a.nome}
              </button>
            ))}
          </div>
        </div>

        <Link to="/" className={styles.voltar}>
          <ArrowLeft size={15} /> Voltar para a busca de animais
        </Link>
      </main>
    </div>
  );
}
