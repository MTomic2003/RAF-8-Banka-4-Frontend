import { loginAs, supervisorUser } from './helpers';

describe('Scenario 9: Supervizor koji nije admin ne dobija admin prava', () => {
  it('ne moze da pristupi portalu za upravljanje zaposlenima', () => {
    loginAs(supervisorUser, '/employees');

    cy.location('pathname', { timeout: 15000 }).should('not.eq', '/employees');
    cy.location('pathname').should((path) => {
      expect(['/admin', '/login']).to.include(path);
    });
  });
});

