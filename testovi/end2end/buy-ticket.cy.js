describe('Buy Parking Ticket Test', () => {
  
    beforeEach(() => {
      
      cy.visit('http://127.0.0.1:5500/stranice/buy-ticket/buy-ticket.html');
    });

    it('should allow user to select parking location and duration', () => {
      
      cy.get('#plateNumber').type('ZG12345');

     
      cy.get('.next-step').click({multiple: true});

      
      cy.get('#parkingLocation').select('2');  

     
      cy.get('#duration').select('day'); 

      
      cy.get('.next-step').filter(':visible') 
      .click();  

      
      cy.get('#parkingFee').should('not.contain.text', 'NaN');  
      cy.get('#totalPrice').should('not.contain.text', 'NaN');  
      cy.get('#parkingFee').should('contain.text', '$');  
      cy.get('#totalPrice').should('contain.text', '$');  

      
      cy.get('.submit-button')
      .filter(':visible')  
      .click();  
    
      cy.get('#cardNumber').should('be.visible');
      cy.get('#expiryDate').should('be.visible');
      cy.get('#cvv').should('be.visible');
    });
  });
 describe('Buy Parking Ticket Test', () => {

   beforeEach(() => {
     
     cy.visit('http://127.0.0.1:5500/stranice/buy-ticket/buy-ticket.html');
   });

   it('should prevent user from clicking Next without entering plate number', () => {

     cy.get('.next-step').filter(':visible').click();

  

     cy.get('.form-step.active')
       .should('have.length', 1); 
   });

 });
describe('Buy Parking Ticket Test', () => {

  beforeEach(() => {
    
    cy.visit('http://127.0.0.1:5500/stranice/buy-ticket/buy-ticket.html');
  });

  it('should trigger TypeError when attempting to proceed without selecting parking location', () => {
    
    cy.get('#plateNumber').type('ZG12345');

    cy.get('.next-step').click({ multiple: true });

   
    cy.get('#duration').select('day');

   
    cy.get('#parkingLocation').should('have.value', '');  

    
    cy.get('#parkingFee').should('contain.text', '$0.00');  
    cy.get('#totalPrice').should('contain.text', '$0.00');  

    
    cy.on('uncaught:exception', (err) => {
      
      expect(err.message).to.include('Cannot read properties of null (reading \'toFixed\')');
     
      return false;
    });

   
    cy.get('.next-step').filter(':visible').click();

  });
});


  describe('Buy Parking Ticket Test', () => {

    beforeEach(() => {
      
      cy.visit('http://127.0.0.1:5500/stranice/buy-ticket/buy-ticket.html');
    });

    it('should not allow user to proceed without selecting duration', () => {
     
      cy.get('#plateNumber').type('ZG12345');

      
      cy.get('.next-step').click({multiple: true});  
      
      cy.get('#parkingLocation').select('2');  

  
    

      
      cy.get('.next-step').filter(':visible').click();
    
    

      
      cy.get('#parkingFee').should('contain.text', '$0.00');
      cy.get('#totalPrice').should('contain.text', '$0.00');
    });
  });