/*
  Describe Blocks : Your test is wrapped in a describe block. Takes two arguments: a string and a function. The string is the title of the test suite. The callback function that contains the test code.

  it Blocks (individual test) : Within the describe block, you have an it block. it blocks will be single tests ,Takes two arguments: a string and a function. The string is the title of the test case. The callback function contains the test code.

  Cypress commands : These are commands provided by Cypress that allow you to interact with the browser. In this case, cy.visit() is used to visit a URL.

  example describe block with it and different cypress commands: 
    describe('Network Request Test', () => {
      it('should intercept a network request', () => {
          cy.visit('http://localhost:3000');
          cy.intercept('GET', '/api/users', { fixture: 'users.json' }).as('getUsers');
          cy.get('button.load-users').click();
          cy.wait('@getUsers').its('response.statusCode').should('eq', 200);
          cy.get('ul.users').should('have.length', 3);
        });
    });

    cypress works like a promise chaining mechanism, so you can chain commands together.

  
*/

describe("Visiting the Home", () => {
   it("passes", () => {
      cy.visit("http://localhost:5173/");
   });
});
