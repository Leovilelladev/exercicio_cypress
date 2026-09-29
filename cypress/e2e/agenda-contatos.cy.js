describe('Agenda de contatos', () => {
  const urlApi = Cypress.env('apiUrl');
  let idContatoCriado;

  const criarContato = (tipo) => {
    const identificador = `${tipo}-${Date.now()}`;

    return {
      nome: `Contato Cypress ${identificador}`,
      email: `cypress.${identificador}@example.com`,
      telefone: '11999999999',
    };
  };

  const preencherFormulario = (contato) => {
    cy.get('input[placeholder="Nome"]').clear().type(contato.nome);
    cy.get('input[placeholder="E-mail"]').clear().type(contato.email);
    cy.get('input[placeholder="Telefone"]').clear().type(contato.telefone);
  };

  const adicionarContato = (contato) => {
    cy.intercept('POST', urlApi).as('adicionarContato');

    preencherFormulario(contato);
    cy.contains('button', 'Adicionar').click();

    cy.wait('@adicionarContato').then(({ response }) => {
      expect(response.statusCode).to.be.oneOf([200, 201]);
      const contacts = response.body.data;
      const contatoCriado = contacts.find(({ email }) => email === contato.email);

      expect(contatoCriado, 'contato criado pela API').to.exist;
      idContatoCriado = contatoCriado.id;
    });
  };

  const localizarContato = (contato) => cy.contains('.contato', contato.email);

  beforeEach(() => {
    idContatoCriado = undefined;
    cy.visit('/');
    cy.get('h1').should('contain.text', 'Agenda de').and('contain.text', 'contatos');
  });

  afterEach(() => {
    if (idContatoCriado) {
      cy.request({
        method: 'DELETE',
        url: urlApi,
        body: JSON.stringify({ id: idContatoCriado }),
        headers: {
          'content-type': 'text/plain;charset=UTF-8',
        },
      }).its('status').should('be.oneOf', [200, 204]);
    }
  });

  it('inclui um contato', () => {
    const contato = criarContato('inclusao');

    adicionarContato(contato);

    localizarContato(contato).within(() => {
      cy.get('li').eq(0).should('have.text', contato.nome);
      cy.get('li').eq(1).should('have.text', contato.telefone);
      cy.get('li').eq(2).should('have.text', contato.email);
    });
  });

  it('altera um contato', () => {
    const contatoOriginal = criarContato('alteracao');
    const contatoAlterado = {
      ...contatoOriginal,
      nome: `${contatoOriginal.nome} Atualizado`,
      email: contatoOriginal.email.replace('@example.com', '.atualizado@example.com'),
      telefone: '11888888888',
    };

    adicionarContato(contatoOriginal);

    localizarContato(contatoOriginal).within(() => {
      cy.contains('button', 'Editar').click();
    });

    cy.get('input[placeholder="Nome"]').should('have.value', contatoOriginal.nome);
    cy.get('input[placeholder="E-mail"]').should('have.value', contatoOriginal.email);
    cy.get('input[placeholder="Telefone"]').should('have.value', contatoOriginal.telefone);

    cy.intercept('PUT', urlApi).as('alterarContato');
    preencherFormulario(contatoAlterado);
    cy.contains('button', 'Salvar').click();

    cy.wait('@alterarContato').then(({ response }) => {
      expect(response.statusCode).to.be.oneOf([200, 201]);
    });

    localizarContato(contatoAlterado).within(() => {
      cy.get('li').eq(0).should('have.text', contatoAlterado.nome);
      cy.get('li').eq(1).should('have.text', contatoAlterado.telefone);
      cy.get('li').eq(2).should('have.text', contatoAlterado.email);
    });
    cy.contains('.contato', contatoOriginal.email).should('not.exist');
  });

  it('remove um contato', () => {
    const contato = criarContato('remocao');

    adicionarContato(contato);

    cy.intercept('DELETE', urlApi).as('removerContato');
    localizarContato(contato).within(() => {
      cy.contains('button', 'Deletar').click();
    });

    cy.wait('@removerContato').then(({ response }) => {
      expect(response.statusCode).to.be.oneOf([200, 204]);
    });
    cy.contains('.contato', contato.email).should('not.exist');

    idContatoCriado = undefined;
  });
});
