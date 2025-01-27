describe('Monthly Ticket Purchase Test', () => {
    beforeEach(() => {
      cy.visit('http://127.0.0.1:5500/stranice/monthly-ticket/monthly-ticket.html'); 
    });
  
    it('should allow user to purchase a monthly ticket successfully', () => {
      const plateNumber = 'AB123CD';
      const parkingLocation = 'Parking 3'; 
      const parkingDate = '2025-02-01'; 
      const cardNumber = '4111111111111111'; 
      const expiryDate = '12/25'; 
      const cvv = '123'; 
  
      
      cy.get('#plateNumber').type(plateNumber);
      cy.get('.next-step').first().click();
  
      
      cy.get('#parkingLocation').should('have.length.greaterThan', 0); 
      cy.get('#parkingLocation').select(parkingLocation); 
      cy.get('#parkingDate').type(parkingDate); 
      cy.get('.next-step').first().click({ force: true });
  
      
      cy.get('#cardNumber').type(cardNumber);
      cy.get('#expiryDate').type(expiryDate);
      cy.get('#cvv').type(cvv);
      cy.get('.submit-button').click(); 
  
      
      cy.get('#ticketVehicleId').should('have.text', plateNumber);
      cy.get('#ticketParkingId').should('not.be.empty');
      cy.get('#ticketExpiryDate').should('not.be.empty');
  
      
     
    });
  });
  describe('Invalid  Test', () => {
    beforeEach(() => {
      cy.visit('http://127.0.0.1:5500/stranice/monthly-ticket/monthly-ticket.html'); 
    });
  
    it('should not move to next step if no day is selected in the calendar', () => {
      const plateNumber = 'AB123CD'; 
      const parkingLocation = 'Select parking location'; 
      const parkingDate = '2025-02-01'; 
  
      
      cy.get('#plateNumber').type(plateNumber);
      cy.get('.next-step').first().click(); 
  
      
      cy.get('#parkingLocation').select(parkingLocation); 
      cy.get('#parkingDate').type(parkingDate); 
  
      
      cy.get('.next-step').first().click({ force: true });
  
      
      cy.url().should('include', 'monthly-ticket.html'); 
  
 
    });
  });
  
  describe('Invalid Parking Date Test with Parking 4', () => {
    beforeEach(() => {
      cy.visit('http://127.0.0.1:5500/stranice/monthly-ticket/monthly-ticket.html'); 
    });
  
    it('should not move to next step if no date is entered', () => {
      const plateNumber = 'AB123CD'; 
      const parkingLocation = 'Parking 4'; 
      const parkingDate = ''; 
  
      
      cy.get('#plateNumber').type(plateNumber); 
      cy.get('.next-step').first().click(); 
  
    
      cy.get('#parkingLocation').select(parkingLocation); 
      cy.get('#parkingDate').clear(); 
  
      
      cy.get('.next-step').first().click({ force: true });
  
   
      cy.url().should('include', 'monthly-ticket.html'); 
  
      
    });
  });
  describe('Invalid Test', () => {
    beforeEach(() => {
      cy.visit('http://127.0.0.1:5500/stranice/monthly-ticket/monthly-ticket.html'); 
    });
  
    it('should not move to next step if plate number is not entered', () => {
      const plateNumber = ''; 
          
      cy.get('.next-step').first().click({ force: true });
  
   
      cy.url().should('include', 'monthly-ticket.html'); 
  
      
    });
  });
  