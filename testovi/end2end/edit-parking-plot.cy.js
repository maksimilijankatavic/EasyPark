describe('Edit Parking Lot Workflow', () => {
    it('Logs in and edits a parking lot', () => {
      
      cy.visit('http://127.0.0.1:5500/stranice/login/login.html');
  
      
      cy.get('#username').type('ime_admina'); 
      cy.get('#password').type('admin'); 
  
      
      cy.get('.login').click({force: true});
  
      
      cy.url().should('eq', 'http://127.0.0.1:5500/stranice/statistics/statistics.html');
  
      cy.get('a[href="../edit-parking-lot/edit-parking-lot.html"]').click({force: true});
  
     
      cy.visit( 'http://127.0.0.1:5500/stranice/edit-parking-lot/edit-parking-lot.html');
  
      
      cy.get('#parking-lot-select').select('Parking 7'); 
  
      
      cy.get('#capacity').type('100'); 
  
      
      cy.get('#location').select('2'); 
  
     
      cy.get('#zone').select('1'); 
  
      
      cy.get('.edit').click();
      
    });
  });
describe('Edit Parking Lot Workflow', () => {
    it('Logs in and edits a parking lot', () => {
      
      cy.visit('http://127.0.0.1:5500/stranice/login/login.html');
  
     
      cy.get('#username').type('ime_admina'); 
      cy.get('#password').type('admin'); 
  
     
      cy.get('.login').click({force: true});
  
      
      cy.url().should('eq', 'http://127.0.0.1:5500/stranice/statistics/statistics.html');
  
      
      cy.get('a[href="../edit-parking-lot/edit-parking-lot.html"]').click({force: true});
  
      
      cy.visit( 'http://127.0.0.1:5500/stranice/edit-parking-lot/edit-parking-lot.html');
  
      cy.get('#parking-lot-select').select('Select parking lot'); 
  
     
      cy.get('#capacity').type('100'); 
  
      
      cy.get('#location').select('2'); 
  
    
      cy.get('#zone').select('1'); 
  
      
      cy.get('.edit').click();
      cy.url().should('eq', 'http://127.0.0.1:5500/stranice/edit-parking-lot/edit-parking-lot.html');

      
    });
  });
  describe('Edit Parking Lot Workflow', () => {
    it('Logs in and edits a parking lot', () => {
     
      cy.visit('http://127.0.0.1:5500/stranice/login/login.html');
  
     
      cy.get('#username').type('ime_admina'); 
      cy.get('#password').type('admin'); 
  
    
      cy.get('.login').click({force: true});
  
      cy.url().should('eq', 'http://127.0.0.1:5500/stranice/statistics/statistics.html');
  
      
      cy.get('a[href="../edit-parking-lot/edit-parking-lot.html"]').click({force: true});
  
  
      cy.visit( 'http://127.0.0.1:5500/stranice/edit-parking-lot/edit-parking-lot.html');
  
     
      cy.get('#parking-lot-select').select('Parking 11'); 
  
      
      cy.get('#capacity').type('100'); 
  
     
      cy.get('#location').select('Select location'); 
  
      
      cy.get('#zone').select('1'); 
  
      
      cy.get('.edit').click();
      cy.url().should('eq', 'http://127.0.0.1:5500/stranice/edit-parking-lot/edit-parking-lot.html');

      
    });
  });
  
  describe('Edit Parking Lot Workflow', () => {
    it('Logs in and edits a parking lot', () => {
      
      cy.visit('http://127.0.0.1:5500/stranice/login/login.html');
  
      
      cy.get('#username').type('ime_admina'); 
      cy.get('#password').type('admin'); 
  
      
      cy.get('.login').click({force: true});
  
      cy.url().should('eq', 'http://127.0.0.1:5500/stranice/statistics/statistics.html');
  
      
      cy.get('a[href="../edit-parking-lot/edit-parking-lot.html"]').click({force: true});
  
      
      cy.visit( 'http://127.0.0.1:5500/stranice/edit-parking-lot/edit-parking-lot.html');
  
   
      cy.get('#parking-lot-select').select('Parking 18'); 
  
      
      cy.get('#capacity').type('100'); 
  
     
      cy.get('#location').select('Split');

      
      cy.get('#zone').select('Select zone'); 
  
      
      cy.get('.edit').click();
      cy.url().should('eq', 'http://127.0.0.1:5500/stranice/edit-parking-lot/edit-parking-lot.html');

      
    });
  });
  
  