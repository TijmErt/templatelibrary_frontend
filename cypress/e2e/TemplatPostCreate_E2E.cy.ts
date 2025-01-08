/*
UserStory:
UserStory 01

Test case:
allow a user to create a post
a user should be allowed to upload a document (only a .pdf and .docx)
a user should be allowed to fill in the post details: Title, Description, categories

*/

describe('TemplatePost Form E2E Test', () => {

  beforeEach(() => {
    cy.visit('/Post/Creation'); // Replace with the actual route for the form
  })


  it('submits the form successfully with valid inputs', () => {
    // Fill the title field
    cy.get('input[placeholder="Title"]').type('Valid Title');

    // Fill the description field
    cy.get('textarea[placeholder="Description"]').type('This is a valid description with more than 11 characters.');

    // Fill the author ID field
    cy.get('input[placeholder="Author ID"]').type('user-id-1');

    // Upload a valid file
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/valid-file.docx`, { force: true });

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for redirection to the post view
    cy.url().should('match', /http:\/\/localhost:5173\/Post\/[a-f0-9\-]+$/);

    // Verify the new post is displayed
    cy.get('h2').contains('Valid Title');
    cy.get('p').contains('This is a valid description with more than 11 characters.')
    cy.get('p').contains('Author: Alice')

    cy.get('.pdfContainer',{timeout:8000}).should('be.visible')

    // Check if the PDF is displayed (this will depend on how the component renders the PDF pages)
    cy.get('.vue-pdf').should('have.length.greaterThan', 0) // Adjust the selector for VuePDF component
  });

});
