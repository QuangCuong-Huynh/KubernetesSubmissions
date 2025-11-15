Feature: User Settings

  Scenario: User updates profile information
    Given I am on the settings page
    When I update my name
    And I save the changes
    Then my profile should be updated
    And I should see a success message

  Scenario: User changes theme
    Given I am on the settings page
    When I select "Dark" theme
    Then the application should switch to dark mode
    And my preference should be saved

  Scenario: User enables notifications
    Given I am on the settings page
    When I enable email notifications
    And I save the changes
    Then I should receive email notifications for task updates