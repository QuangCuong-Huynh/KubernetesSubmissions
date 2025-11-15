Feature: Kanban Board Management
  As a user
  I want to manage tasks on a Kanban board
  So that I can track my work progress

  Background:
    Given I am logged in as "test@example.com"
    And I am on the Kanban page

  Scenario: User creates a new task
    When I click the "Add Task" button
    And I fill in the task form with:
      | field       | value                    |
      | title       | Implement login feature  |
      | description | Add JWT authentication   |
      | priority    | high                     |
      | dueDate     | 2025-12-31              |
    And I submit the form
    Then I should see a success message "Task created successfully"
    And I should see the task "Implement login feature" in the "To Do" column
    And the task should have priority "high"

  Scenario: User drags task to different column
    Given there is a task "Write documentation" in the "To Do" column
    When I drag the task to the "In Progress" column
    Then the task "Write documentation" should appear in the "In Progress" column
    And the task should not appear in the "To Do" column
    And the task status should be updated to "inProgress"

  Scenario: User edits a task
    Given there is a task "Fix bug #123" visible
    When I click on the task "Fix bug #123"
    And I update the task with:
      | field       | value                |
      | title       | Fix critical bug #123|
      | priority    | urgent               |
    And I save the changes
    Then the task should display "Fix critical bug #123"
    And the task should have priority "urgent"

  Scenario: User deletes a task
    Given there is a task "Old task" visible
    When I click the delete button for task "Old task"
    And I confirm the deletion
    Then I should see a success message "Task deleted successfully"
    And the task "Old task" should not be visible

  Scenario: User filters tasks by priority
    Given there are tasks with different priorities:
      | title        | priority |
      | Task A       | high     |
      | Task B       | low      |
      | Task C       | high     |
    When I select "High" priority filter
    Then I should see 2 tasks
    And I should see task "Task A"
    And I should see task "Task C"
    And I should not see task "Task B"

  Scenario: User searches for a task
    Given there are multiple tasks:
      | title              |
      | Bug fix for login  |
      | Feature request    |
      | Bug fix for API    |
    When I enter "bug fix" in the search box
    Then I should see 2 tasks
    And I should see task "Bug fix for login"
    And I should see task "Bug fix for API"
    And I should not see task "Feature request"

  Scenario: User creates a new board
    When I click "Create Board"
    And I enter board name "Sprint 2024"
    And I submit the form
    Then I should see a success message "Board created successfully"
    And I should see "Sprint 2024" in the board list
    And the board should be selected

  Scenario: User switches between boards
    Given there are multiple boards:
      | name          |
      | Personal      |
      | Work Projects |
    And I am viewing "Personal" board
    When I select "Work Projects" board
    Then I should see tasks from "Work Projects" board
    And the board header should display "Work Projects"

  Scenario: User reorders tasks within a column
    Given there are tasks in "To Do" column:
      | title    | order |
      | Task 1   | 1     |
      | Task 2   | 2     |
      | Task 3   | 3     |
    When I drag "Task 3" above "Task 1"
    Then the task order should be:
      | title    | order |
      | Task 3   | 1     |
      | Task 1   | 2     |
      | Task 2   | 3     |

  Scenario: Task shows overdue indicator
    Given there is a task "Overdue task" with due date "2020-01-01"
    Then the task should display an overdue indicator
    And the task should be highlighted as overdue

  Scenario: User assigns task to team member
    Given there is a task "Review PR" visible
    And there are team members available
    When I click on the task "Review PR"
    And I assign the task to "John Doe"
    And I save the changes
    Then the task should show "John Doe" as assignee
    And "John Doe" should receive a notification