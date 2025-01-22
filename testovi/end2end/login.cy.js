 describe('Sign Up Test', () => {

     beforeEach(() => {
       
       cy.visit('http://127.0.0.1:5500/login.html');
     });
  
     it('should allow user to sign up with valid username and password', () => {
       
       const username = 'testicc';
       cy.get('#username').type(username);
  
       const validPassword = 'Test@1234';
       cy.get('#password').type(validPassword);
  
       
       cy.get('.signup').click();
  
       
       cy.get('#message').should('have.text', 'Osoba uspješno dodana.');  
       cy.get('#message').should('have.css', 'color', 'rgb(0, 128, 0)');  
    });
  
 });
describe('Sign Up Test - Invalid Password', () => {

  beforeEach(() => {
    
    cy.visit('http://127.0.0.1:5500/login.html');
  });

  it('should show error message if password does not meet criteria', () => {
    
    const username = 'testuser';
    cy.get('#username').type(username);

    
    const invalidPassword = 'testpassword'; 
    cy.get('#password').type(invalidPassword);

    cy.get('.signup').click();

    
    cy.get('#message').should('have.text', 'Lozinka mora imati najmanje 8 znakova, barem jedno malo slovo, jedno veliko slovo i jedan simbol.');
    
  });

});

describe('Sign Up Test', () => {

    beforeEach(() => {
      
      cy.visit('http://127.0.0.1:5500/login.html');
    });
  
    it('should allow user to sign up with valid username and password', () => {
      
      const username = 'testuser';
      cy.get('#username').type(username);
  
     
      const validPassword = 'Test@1234';
      cy.get('#password').type(validPassword);
  
      cy.get('.signup').click();
  
      
      cy.get('#message').should('have.text', 'Greška pri dodavanju osobe.');  
     
    });
});  
describe('Sign Up and Login Test - Successful Sign Up, but No Admin Rights', () => {

    beforeEach(() => {
     
      cy.visit('http://127.0.0.1:5500/login.html');
    });
  
    it('should sign up with valid credentials and show "Prijava uspješna, ali nemate administratorska prava." on login', () => {
      
      cy.get('#username').type('IvaMar');
  
      
      cy.get('#password').type('Test@1234');
  
     
      cy.get('.signup').click();
  
      
      cy.get('#message').should('have.text', 'Osoba uspješno dodana.');  
  
    
      cy.visit('http://127.0.0.1:5500/login.html');
  
      
      cy.get('#username').type('IvaMar');
  
      cy.get('#password').type('Test@1234');
  
      cy.get('.login').click();
  
      cy.get('#message').should('have.text', 'Prijava uspješna, ali nemate administratorska prava.');
    });
  
  });
describe('Login Test - Invalid User', () => {

    beforeEach(() => {
     
      cy.visit('http://127.0.0.1:5500/login.html');
    });
  
    it('should show error "Korisnik ne postoji." when trying to log in with random username and password', () => {
     
      const randomUsername = 'RandomUser123';
      cy.get('#username').type(randomUsername);
  
    
      const randomPassword = 'RandomPassword!2024';
      cy.get('#password').type(randomPassword);
  
     
      cy.get('.login').click();
  
      cy.get('#message').should('have.text', 'Korisnik ne postoji.');
    });
  
  });
describe('Sign Up Test - Empty Username', () => {

    beforeEach(() => {
        
        cy.visit('http://127.0.0.1:5500/login.html');
    });

    it('should show error message when username is empty', () => {
        
        cy.get('#username').clear();

        
        cy.get('#password').type('Test@1234');

        cy.get('.signup').click();

        cy.get('#message').should('have.text', '');  
        
    });
});
describe('Login Test - Empty Username', () => {

    beforeEach(() => {
        
        cy.visit('http://127.0.0.1:5500/login.html');
    });

    it('should show error message when username is empty', () => {
       
        cy.get('#username').clear();

        cy.get('#password').type('Test@1234');

        cy.get('.login').click();

        cy.get('#message').should('have.text', '');  
        
    });
});

  