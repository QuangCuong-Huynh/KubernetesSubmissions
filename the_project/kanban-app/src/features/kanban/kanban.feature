Feature: Kanban Board Management

  Scenario: User creates a new task
    Given I am on the Kanban page
    When I click the "Add Task" button
    And I fill in the task form with valid data
    And I submit the form
    Then I should see the new task in the "To Do" column

  Scenario: User drags task to different column
    Given I am on the Kanban page
    And there is a task in the "To Do" column
    When I drag the task to the "In Progress" column
    Then the task should appear in the "In Progress" column
    And the task status should be updated

  Scenario: User edits a task
    Given I am on the Kanban page
    And there is a task visible
    When I click on the task
    And I update the task details
    And I save the changes
    Then the task should display updated information

  Scenario: User deletes a task
    Given I am on the Kanban page
    And there is a task visible
    When I click the delete button
    And I confirm the deletion
    Then the task should be removed from the board

  Scenario: User filters tasks by priority
    Given I am on the Kanban page
    And there are tasks with different priorities
    When I select "High" priority filter
    Then I should only see high priority tasks

  Scenario: User searches for a task
    Given I am on the Kanban page
    And there are multiple tasks
    When I enter "Bug fix" in the search box
    Then I should only see tasks matching "Bug fix"

  Scenario: User creates a new board
    Given I am on the Kanban page
    When I click "Create Board"
    And I enter a board name
    And I submit the form
    Then I should see the new board in the board list

  Scenario: User switches between boards
    Given I am on the Kanban page
    And there are multiple boards
    When I select a different board
    Then I should see tasks from that board