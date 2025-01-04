describe('Template Post Page', () => {
  beforeEach(() => {
    // Visit the page where the component is rendered. Replace with the actual URL.
    cy.visit('/Post/tempPost-id-1')  // Replace with the correct dynamic URL
  })

  it('displays the loading state initially', () => {
    // Check if the loading message is displayed initially
    cy.get('p').contains('Loading...')
  })

  it('displays the template post details correctly when data is fetched', () => {

    // Check if the template post details are displayed correctly
    cy.get('h2').contains('Template Post Title')
    cy.get('p').contains('Description for template post 1')
    cy.get('p').contains('Author: Alice')
    cy.get('p').contains('Created on: 2024-10-29')
    cy.get('div').contains('Technology')
    cy.get('div').contains('Health')
  })

  it('displays the error state when there is an error fetching data', () => {
    // Mock an error response for the GraphQL request
    cy.intercept('POST', '/graphql', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('graphqlError')

    // Trigger a refetch or reload of the component to show the error state
    cy.reload()

    // Wait for the error response
    cy.wait('@graphqlError')

    // Check if the error message is displayed
    cy.get('p').contains('Error: Response not successful: Received status code 500')
  })

  it('fetches and renders the PDF correctly', () => {

    // Ensure that the PDF container is visible
    cy.get('.pdfContainer').should('be.visible')

    // Check if the PDF is displayed (this will depend on how the component renders the PDF pages)
    cy.get('.vue-pdf').should('have.length.greaterThan', 0) // Adjust the selector for VuePDF component
  })

  it('displays the PDF loader or blank if no PDF is available', () => {
    // Test case when no PDF is available, ensure it does not render anything
    cy.get('.pdfContainer').should('not.have.descendants', '.vue-pdf')
  })
})
