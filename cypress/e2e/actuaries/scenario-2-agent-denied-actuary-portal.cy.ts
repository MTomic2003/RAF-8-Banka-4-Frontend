import { agentUser, apiUrl, loginAs } from './helpers';


describe('Scenario 2: Agent nema pristup portalu za upravljanje aktuarima', () => {
  it('dobija odbijen pristup i tabela nije dostupna', () => {
    cy.intercept('GET', `${apiUrl()}/actuaries*`, {
      statusCode: 403,
      body: { error: 'Pristup je odbijen.' },
    }).as('getActuariesDenied');

    loginAs(agentUser, '/admin/actuaries');

    cy.wait('@getActuariesDenied').its('response.statusCode').should('eq', 403);
    cy.contains(/odbijen|403|greska|greška/i).should('be.visible');
    cy.get('table').should('not.exist');
  });
});
