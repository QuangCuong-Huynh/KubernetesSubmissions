Feature: User Authentication

  Scenario: User logs in successfully
    Given I am on the login page
    When I enter valid credentials
    And I click the "Login" button
    Then I should be redirected to the Kanban page
    And I should see my username in the header

  Scenario: User logs in with invalid credentials
    Given I am on the login page
    When I enter invalid credentials
    And I click the "Login" button
    Then I should see an error message
    And I should remain on the login page

  Scenario: User registers a new account
    Given I am on the registration page
    When I fill in the registration form
    And I submit the form
    Then my account should be created
    And I should be redirected to the Kanban page

  Scenario: User logs out
    Given I am logged in
    When I click the logout button
    Then I should be logged out
    And I should be redirected to the login page

  Scenario: User resets password
    Given I am on the login page
    When I click "Forgot Password"
    And I enter my email
    And I submit the form
    Then I should receive a password reset email