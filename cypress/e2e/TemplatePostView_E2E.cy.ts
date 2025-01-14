/*
UserStory:
UserStory 03

Test case:
allow a user to view a post
a user should be able to see the details of the page: Title, Description, average Rating and Categories
a user should be able to see the related document on the page (PDF previewer)
a user should be able to see all the reviews/comments the post

*/

describe('Template Post Page', () => {
  beforeEach(() => {
    // Visit the page where the component is rendered. Replace with the actual URL.
    cy.visit('/Post/tempPost-id-1')  // Replace with the correct dynamic URL
  })


  it('displays the loading state initially', () => {
    // Verify the loading message is displayed
    cy.get('div.contentContainer').within(() => {
      cy.get('p').contains('Loading...');
    });
  });

  it('displays the template post details correctly when data is fetched', () => {
    // Wait for data to load
    cy.get('div.contentContainer').should('not.contain', 'Loading...');

    // Check if the template post details are displayed correctly
    cy.get('h2').should('contain', 'Template Post Title');
    cy.get('p').should('contain', 'rating:');
    cy.get('p').should('contain', 'Author: Alice');
    cy.get('p').should('contain', 'Description for template post 1');
    cy.get('i').should('contain', 'Created on: 2024-10-29');

    // Verify categories
    cy.get('div.categoryBody').within(() => {
      cy.get('div').should('contain', 'Technology');
      cy.get('div').should('contain', 'Health');
    });
  });

  it('displays the error state when there is an error fetching data', () => {
    // Mock an error response for the GraphQL request
    cy.intercept('POST', '/graphql', {
      statusCode: 500,
      body: { errors: [{ message: 'Internal Server Error' }] },
    }).as('graphqlError');

    // Reload the page to trigger the error state
    cy.reload();

    // Wait for the error response
    cy.wait('@graphqlError');

    // Verify the error message is displayed
    cy.get('div.contentContainer').within(() => {
      cy.get('p').contains('Error: Response not successful: Received status code 500');
    });
  });

  it('fetches and renders the PDF correctly', () => {
    // Ensure that the PDF container is visible
    cy.get('div.pdfContainer').should('be.visible');

    // Check if the PDF is rendered
    cy.get('.vue-pdf').should('exist');
    cy.get('.vue-pdf').should('have.length.greaterThan', 0);
  });

  it('displays a blank PDF container if no PDF is available', () => {
    // Mock a response with no PDF file
    cy.intercept('GET', '/get/nonexistent-file/pdf', {
      statusCode: 404,
      body: {},
    });

    // Ensure the PDF container exists but has no PDF rendered
    cy.get('div.pdfContainer').should('be.visible');
    cy.get('div.pdfContainer').should('not.have.descendants', '.vue-pdf');
  });
})
