# Exercício EBAC — Cypress

Projeto de testes E2E separado para validar a aplicação publicada em:

<https://ebac-agenda-contatos-tan.vercel.app/>

## Cenários cobertos

- inclusão de um contato;
- alteração dos dados de um contato;
- remoção de um contato.

Os dados usados nos testes recebem um identificador único e são removidos ao final de cada cenário para não deixar resíduos na agenda compartilhada.

## Como executar

```bash
npm install
npm run cy:run
```

Para abrir o Cypress em modo interativo:

```bash
npm run cy:open
```
