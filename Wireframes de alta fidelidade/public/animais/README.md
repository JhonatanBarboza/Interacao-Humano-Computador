# Fotos dos animais

Cada animal tem uma pasta com o mesmo `id` usado em `src/data/animais.js`.
As fotos são nomeadas em sequência, começando em `foto1`:

```
public/animais/thor/foto1.png
public/animais/bento/foto1.png
public/animais/bento/foto2.png
public/animais/bento/foto3.png
```

A quantidade de fotos varia por animal — o campo `fotos` em cada registro
de `animais.js` lista os caminhos (a primeira é a foto principal do card).

Pastas atuais: `thor`, `luna`, `bento`, `mia`, `toby`, `nina`, `mel`,
`gaia`, `pit`.

- Formato: `.png`.
- Se adicionar mais fotos a um animal (ou um animal novo), atualize
  `fotos` (e, se for animal novo, crie o registro completo) em
  `src/data/animais.js`.
- Animais cadastrados pelo painel da instituição guardam as fotos
  enviadas no localStorage do navegador, não nesta pasta.
