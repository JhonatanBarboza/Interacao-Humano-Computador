# Patas que Acolhem — Protótipo de alta fidelidade

Protótipo navegável feito com React, Vite e React Router. Não há backend: os dados iniciais ficam em [`src/data/`](src/data) e as alterações feitas no painel da instituição, assim como os favoritos, são salvas no `localStorage` do navegador.

## Comandos

```bash
npm install       # instala as dependências
npm run dev       # servidor de desenvolvimento (http://localhost:5173)
npm run build     # gera a versão de produção em dist/
npm run preview   # serve localmente o build gerado
npm run lint      # roda o Oxlint
```

## Rotas

**Área pública**

| Rota | Tela |
| --- | --- |
| `/` | Home e busca de animais |
| `/animal/:id` | Perfil do animal |
| `/abrigos` | Lista de abrigos/ONGs |
| `/abrigo/:id` | Página institucional do abrigo |
| `/favoritos` | Animais favoritados |
| `/login` | Login da instituição |

**Painel da instituição**

| Rota | Tela |
| --- | --- |
| `/painel` | Visão geral |
| `/painel/animais` | Meus animais |
| `/painel/cadastro` | Cadastrar animal |
| `/painel/animais/:id/editar` | Editar animal |
| `/painel/pagina` | Editar página institucional |
| `/painel/posts` | Resgates e eventos |

## Estrutura de `src/`

- `pages/` — uma pasta por tela
- `components/` — componentes reutilizáveis (cards, botões, campos, mapa etc.)
- `data/` — dados de exemplo e persistência em `localStorage`
- `hooks/` — sessão e favoritos
- `styles/` — tokens de design e estilos base
- `utils/` — utilitários (ex.: redução de imagens)
