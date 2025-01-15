/*
UserStory:
UserStory 04

Test case:
allow a user to use a search request to find a Post
allow a user to filter out post using selected categories for filtering
allow a user to search for a post through pagination

*/

describe('Template Library Searcher', () => {
  beforeEach(() => {
    // Visit the page where the component is rendered
    cy.visit('/')
  })

  it('displays the loading state initially', () => {
    // Check if the loading message is shown initially
    cy.get('p').contains('Loading...')
  })

  it('displays posts correctly when data is fetched', () => {
    // Assuming the data for the first page is fetched and displayed after loading

    // Check that posts are displayed
    cy.get('.postContainer',{timeout:500}).should('have.length', 4)

    // Check the title and rating of the first post
    cy.get('.postContainer').first().within(() => {
      cy.get('h2').contains('Template Post Title 7')
      cy.get('p').contains('Rating: 5')
      cy.get('p').contains('Author: Eve')
      cy.get('p').contains('Categories: Education Finance')
    })
  })

  it('displays the error state when there is an error', () => {
    // Mock an error response using cy.intercept if necessary, or simulate a scenario where an error occurs
    cy.intercept('POST', '/graphql', { statusCode: 500, body: { error: 'Internal Server Error' } }).as('graphqlError')

    // Trigger a refetch or reload of the component to show the error state
    cy.reload()

    // Wait for the error response
    cy.wait('@graphqlError')

    // Check if the error message is displayed
    cy.get('p').contains('Error: Response not successful: Received status code 500')
  })

  it('verifies pagination works (next page)', () => {

    // Check initial page info (Page 1 of 2)
    cy.get('.pagination',{timeout:500}).contains('Page 1 of 2')

    // Click on the next page button
    cy.get('button').contains('Next').click()

    // Check if the page info updated to the next page (Page 2 of 2)
    cy.get('.pagination',{timeout:500}).contains('Page 2 of 2')

    // Optionally, check if the content is different (e.g., different posts for the second page)
    cy.get('.postContainer').first().within(() => {
      cy.get('h2').contains('Template Post Title 3') // Ensure this is a post from the next page
    })
  })

  it('verifies pagination works (previous page)', () => {
    // First, go to the second page to test the previous functionality
    cy.get('button').contains('Next').click()

    // Now click on the previous button
    cy.get('button',{timeout:500}).contains('Previous').click()

    // Check if the page info updated back to the first page (Page 1 of 2)
    cy.get('.pagination',{timeout:500}).contains('Page 1 of 2')
  })
})
