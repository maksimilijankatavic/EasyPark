describe('Cancel Ticket Test', () => {

    beforeEach(() => {
      
      cy.visit('http://127.0.0.1:5500/stranice/cancel-ticket/cancel-ticket.html');
    });
  
    it('should delete a ticket successfully with a valid vehicle ID', () => {
      const vehicleId = 'ST55895'; 
  
      cy.get('#vehicleIdDelete').type(vehicleId);
  
      cy.get('#vehicleIdDelete').should('have.value', vehicleId);
  
    
      cy.intercept('DELETE', `http://localhost:3000/kupljena-karta/${vehicleId}`, {
        statusCode: 200,
        body: { message: 'Ticket successfully deleted.' },  
      }).as('deleteTicket');
  
     
      cy.get('#deleteTicketButton').click();
  
      cy.wait('@deleteTicket');
  
      cy.get('#deleteMessage').should('have.text', 'Ticket successfully deleted.');
      cy.get('#deleteMessage').should('have.css', 'color', 'rgb(0, 128, 0)');  
    });
  
   
  
  });
  describe('Cancel Ticket Test - Vehicle ID Not Found', () => {

    beforeEach(() => {
      
      cy.visit('http://127.0.0.1:5500/stranice/cancel-ticket/cancel-ticket.html');
    });
  
    it('should show an error message if the vehicle ID is not found in the database', () => {
      const nonExistentVehicleId = 'XX99999';  
  
      cy.get('#vehicleIdDelete').type(nonExistentVehicleId);
  
    
      cy.get('#vehicleIdDelete').should('have.value', nonExistentVehicleId);
  
     
      cy.intercept('DELETE', `http://localhost:3000/kupljena-karta/${nonExistentVehicleId}`, {
        statusCode: 404,
        body: { message: 'Ticket doesnt exist.' },  
      }).as('deleteTicket');
  
      cy.get('#deleteTicketButton').click();
  
      cy.wait('@deleteTicket');
  
     
      cy.get('#deleteMessage').should('have.text', 'Ticket doesnt exist.');
      
    });
  
  });
  