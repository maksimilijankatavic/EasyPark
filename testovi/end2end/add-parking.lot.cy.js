describe('Login and Add New Parking Lot Test', () => {
    it('should login and add a new parking lot successfully', () => {
      
      cy.visit('http://127.0.0.1:5500/stranice/login/login.html');
      
      
      cy.get('#username').type('Petra');
      cy.get('#password').type('Admin@1234');
      
      
      cy.get('.login').click();  
      cy.visit('http://127.0.0.1:5500/stranice/add-parking-lot/add-parking-lot.html');
      
      const capacity = 100; 
      const location = '2'; 
      const zone = '1';
      
    
      cy.get('#capacity').type(capacity);
      
     
      cy.get('#location').select(location);
      
     
      cy.get('#zone').select(zone);
     
      cy.get('#add-parking-lot-form').submit();
      
     
    });
  
});
describe('Login and Add New Parking Lot with Empty Capacity Field Test', () => {
    it('should show an error message when capacity field is empty', () => {
   
      cy.visit('http://127.0.0.1:5500/stranice/login/login.html');
      
    
      cy.get('#username').type('Petra');
      cy.get('#password').type('Admin@1234');
      
      cy.get('.login').click();
      
     
      
      cy.visit('http://127.0.0.1:5500/stranice/add-parking-lot/add-parking-lot.html');
      
    
      cy.get('#capacity').should('be.empty'); 
      
      
      const location = '2'; 
      const zone = '1'; 
      
      
      cy.get('#location').select(location);
      
      
      cy.get('#zone').select(zone);
      
     
      cy.get('#add-parking-lot-form').submit();
      
     
      cy.get('#capacity').then(($input) => {
          const validity = $input[0].validity;
          expect(validity.valueMissing).to.be.true; 
      });
  
    });
  });
describe('Add New Parking Lot with Missing Zone Test', () => {
    it('should show an error message when zone is not selected', () => {
 
      cy.visit('http://127.0.0.1:5500/stranice/login/login.html');
      
    
      cy.get('#username').type('Petra');
      cy.get('#password').type('Admin@1234');
     
      cy.get('.login').click();
      
  
      
      cy.visit('http://127.0.0.1:5500/stranice/add-parking-lot/add-parking-lot.html');
      
     
      
      const zone = 'Select zone';
      const capacity = '50'; 
      const location = 'Zagreb'; 
      
      
      cy.get('#capacity').type(capacity);
      cy.get('#zone').select(zone);
      
     
      cy.get('#location').select(location);
      
      cy.get('#add-parking-lot-form').submit();
      
      
     
      cy.get('#zone').then(($input) => {
          const validity = $input[0].validity;
          expect(validity.valueMissing).to.be.true; 
      });
  
     
    });
  });
describe('Add New Parking Lot with Missing Location Test', () => {
    it('should show an error message when zone is not selected', () => {
      
      cy.visit('http://127.0.0.1:5500/stranice/login/login.html');
      
      cy.get('#username').type('Petra');
      cy.get('#password').type('Admin@1234');
      
      
      cy.get('.login').click();
      
    
   
      cy.visit('http://127.0.0.1:5500/stranice/add-parking-lot/add-parking-lot.html');
      
      
      const capacity = '50'; 
      
      const location = 'Select location'; 
      const zone = '1'; 
      
     
      cy.get('#capacity').type(capacity);
      
      
      cy.get('#location').select(location);
      cy.get('#zone').select(zone);
      
      
      cy.get('#add-parking-lot-form').submit();
      
      cy.get('#location').then(($input) => {
          const validity = $input[0].validity;
          expect(validity.valueMissing).to.be.true;
      });
  
   
    });
  });
  