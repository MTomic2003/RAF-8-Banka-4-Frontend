import {fillDateByLabel, fillInputByLabel, selectByLabel} from '../../support/formByLable';
import {fillLoginForm, submitLogin, visitEmployeeLogin} from "../../support/authHelpers";


it('Uspešno aktivira nalog', () => {
    // 1. Idemo na MailHog samo da pročitamo URL
    cy.intercept('POST', '**/auth/login').as('login');
    visitEmployeeLogin();
    fillLoginForm('admin@raf.rs', 'admin123');
    submitLogin();
    cy.wait('@login').its('response.statusCode').should('eq', 200);

    // intercept BEFORE submit
    cy.intercept('POST', '**/employees/register').as('registerEmployee');

    cy.visit('/employees/new');

    const ts = Date.now();
    const email = `e2e_emp_${ts}@raf.rs`;

    fillInputByLabel('Ime', 'E2E');
    fillInputByLabel('Prezime', 'Employee');
    fillInputByLabel('Email adresa', email);
    fillInputByLabel('Broj telefona', '+381601234567');
    fillInputByLabel('Adresa', 'Bulevar Kralja Aleksandra 1');
    fillDateByLabel('Datum rođenja', '1999-01-01');
    selectByLabel('Pol', 'F');

    fillInputByLabel('ID Pozicije', '1');
    fillInputByLabel('Departman', 'IT');

    // permissions: čekiraj "employee.view"
    cy.contains('label', 'employee.view')
        .find('input[type="checkbox"]')
        .check({ force: true });

    // Username (može i auto-gen, ali required je u validaciji)
    // posle Ime+Prezime auto-gen je "eemployee", ali mi možemo da ga postavimo eksplicitno:
    fillInputByLabel('Username', `e2e${ts}`);

    cy.contains('button[type="submit"]', 'Kreiraj zaposlenog').click();

    cy.wait('@registerEmployee').then(({ request, response }) => {
        expect([200, 201]).to.include(response?.statusCode);

        expect(request.body).to.include({
            active: true,
            address: 'Bulevar Kralja Aleksandra 1',
            department: 'IT',
            email,
            first_name: 'E2E',
            gender: 'F',
            last_name: 'Employee',
            phone_number: '+381601234567',
            position_id: 1,
            username: `e2e${ts}`,
        });

        // date_of_birth formatira u handleSubmit:
        expect(request.body.date_of_birth).to.eq('1999-01-01T00:00:00Z');

        // permissions array
        expect(request.body.permissions).to.deep.equal(['employee.view']);
    });

    // nakon uspeha navigira na /employees
    cy.url().should('include', '/employees');

    cy.origin('http://rafsi.davidovic.io:1080', { args: { email } }, ({ email }) => {
        cy.visit('/');
        cy.wait(3000);

        // Klik na najnoviji mejl
        cy.get('.email-list .email-item').first().should('contain', email).click();
        cy.wait(1500);


    });

});