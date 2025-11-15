import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { chromium } from '@playwright/test';

let browser;
let context;
let page;

Before(async function () {
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext();
  page = await context.newPage();
  this.page = page;
});

After(async function () {
  await context.close();
  await browser.close();
});

// Background Steps
Given('I am logged in as {string}', async function (email) {
  await page.goto('http://localhost:5173/login');
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/kanban');
});

Given('I am on the Kanban page', async function () {
  await page.goto('http://localhost:5173/kanban');
  await page.waitForLoadState('networkidle');
});

// Task Creation Steps
When('I click the {string} button', async function (buttonText) {
  await page.click(`button:has-text("${buttonText}")`);
});

When('I fill in the task form with:', async function (dataTable) {
  const data = dataTable.rowsHash();
  
  if (data.title) {
    await page.fill('[name="title"]', data.title);
  }
  if (data.description) {
    await page.fill('[name="description"]', data.description);
  }
  if (data.priority) {
    await page.selectOption('[name="priority"]', data.priority);
  }
  if (data.dueDate) {
    await page.fill('[name="dueDate"]', data.dueDate);
  }
});

When('I submit the form', async function () {
  await page.click('button[type="submit"]');
});

Then('I should see a success message {string}', async function (message) {
  const toast = await page.locator('[role="alert"]');
  await expect(toast).toContainText(message);
});

Then('I should see the task {string} in the {string} column', async function (taskTitle, columnName) {
  const column = page.locator(`[data-column="${columnName}"]`);
  const task = column.locator(`[data-task-title="${taskTitle}"]`);
  await expect(task).toBeVisible();
});

Then('the task should have priority {string}', async function (priority) {
  const priorityBadge = page.locator(`[data-priority="${priority}"]`);
  await expect(priorityBadge).toBeVisible();
});

// Drag and Drop Steps
Given('there is a task {string} in the {string} column', async function (taskTitle, columnName) {
  // This would typically seed test data via API
  await page.evaluate(({ title, column }) => {
    window.testUtils.createTask({ title, status: column });
  }, { title: taskTitle, column: columnName.toLowerCase().replace(' ', '') });
  await page.reload();
});

When('I drag the task to the {string} column', async function (targetColumn) {
  const task = page.locator('[data-task]').first();
  const target = page.locator(`[data-column="${targetColumn}"]`);
  
  await task.dragTo(target);
});

Then('the task {string} should appear in the {string} column', async function (taskTitle, columnName) {
  const column = page.locator(`[data-column="${columnName}"]`);
  const task = column.locator(`text=${taskTitle}`);
  await expect(task).toBeVisible();
});

Then('the task should not appear in the {string} column', async function (columnName) {
  const column = page.locator(`[data-column="${columnName}"]`);
  const tasks = await column.locator('[data-task]').count();
  expect(tasks).toBe(0);
});

Then('the task status should be updated to {string}', async function (status) {
  // Verify via API or local storage
  const taskData = await page.evaluate(() => {
    return window.localStorage.getItem('tasks');
  });
  const tasks = JSON.parse(taskData);
  expect(tasks[0].status).toBe(status);
});

// Edit Task Steps
Given('there is a task {string} visible', async function (taskTitle) {
  await page.evaluate((title) => {
    window.testUtils.createTask({ title });
  }, taskTitle);
  await page.reload();
});

When('I click on the task {string}', async function (taskTitle) {
  await page.click(`[data-task-title="${taskTitle}"]`);
});

When('I update the task with:', async function (dataTable) {
  const data = dataTable.rowsHash();
  
  if (data.title) {
    await page.fill('[name="title"]', data.title);
  }
  if (data.priority) {
    await page.selectOption('[name="priority"]', data.priority);
  }
});

When('I save the changes', async function () {
  await page.click('button:has-text("Save")');
});

Then('the task should display {string}', async function (expectedTitle) {
  const task = page.locator(`[data-task-title="${expectedTitle}"]`);
  await expect(task).toBeVisible();
});

// Delete Task Steps
When('I click the delete button for task {string}', async function (taskTitle) {
  const task = page.locator(`[data-task-title="${taskTitle}"]`);
  await task.locator('button[aria-label="Delete"]').click();
});

When('I confirm the deletion', async function () {
  await page.click('button:has-text("Confirm")');
});

Then('the task {string} should not be visible', async function (taskTitle) {
  const task = page.locator(`[data-task-title="${taskTitle}"]`);
  await expect(task).not.toBeVisible();
});

// Filter Steps
Given('there are tasks with different priorities:', async function (dataTable) {
  const tasks = dataTable.hashes();
  
  for (const task of tasks) {
    await page.evaluate((taskData) => {
      window.testUtils.createTask(taskData);
    }, task);
  }
  await page.reload();
});

When('I select {string} priority filter', async function (priority) {
  await page.selectOption('[name="priorityFilter"]', priority.toLowerCase());
});

Then('I should see {int} tasks', async function (count) {
  const tasks = await page.locator('[data-task]').count();
  expect(tasks).toBe(count);
});

Then('I should see task {string}', async function (taskTitle) {
  const task = page.locator(`[data-task-title="${taskTitle}"]`);
  await expect(task).toBeVisible();
});

Then('I should not see task {string}', async function (taskTitle) {
  const task = page.locator(`[data-task-title="${taskTitle}"]`);
  await expect(task).not.toBeVisible();
});

// Search Steps
Given('there are multiple tasks:', async function (dataTable) {
  const tasks = dataTable.hashes();
  
  for (const task of tasks) {
    await page.evaluate((taskData) => {
      window.testUtils.createTask(taskData);
    }, task);
  }
  await page.reload();
});

When('I enter {string} in the search box', async function (searchTerm) {
  await page.fill('[name="search"]', searchTerm);
  await page.waitForTimeout(500); // Debounce
});

// Board Management Steps
When('I enter board name {string}', async function (boardName) {
  await page.fill('[name="boardName"]', boardName);
});

Then('I should see {string} in the board list', async function (boardName) {
  const board = page.locator(`[data-board-name="${boardName}"]`);
  await expect(board).toBeVisible();
});

Then('the board should be selected', async function () {
  const activeBoard = page.locator('[data-board][data-active="true"]');
  await expect(activeBoard).toBeVisible();
});

Given('there are multiple boards:', async function (dataTable) {
  const boards = dataTable.hashes();
  
  for (const board of boards) {
    await page.evaluate((boardData) => {
      window.testUtils.createBoard(boardData);
    }, board);
  }
  await page.reload();
});

Given('I am viewing {string} board', async function (boardName) {
  await page.selectOption('[name="boardSelector"]', boardName);
});

When('I select {string} board', async function (boardName) {
  await page.selectOption('[name="boardSelector"]', boardName);
});

Then('I should see tasks from {string} board', async function (boardName) {
  const boardHeader = page.locator('[data-board-header]');
  await expect(boardHeader).toContainText(boardName);
});

Then('the board header should display {string}', async function (boardName) {
  const header = page.locator('h1');
  await expect(header).toContainText(boardName);
});

// Task Reordering Steps
Given('there are tasks in {string} column:', async function (columnName, dataTable) {
  const tasks = dataTable.hashes();
  
  for (const task of tasks) {
    await page.evaluate(({ taskData, column }) => {
      window.testUtils.createTask({ ...taskData, status: column });
    }, { taskData: task, column: columnName.toLowerCase().replace(' ', '') });
  }
  await page.reload();
});

When('I drag {string} above {string}', async function (sourceTask, targetTask) {
  const source = page.locator(`[data-task-title="${sourceTask}"]`);
  const target = page.locator(`[data-task-title="${targetTask}"]`);
  
  await source.dragTo(target, { targetPosition: { x: 0, y: -10 } });
});

Then('the task order should be:', async function (dataTable) {
  const expectedOrder = dataTable.hashes();
  const tasks = await page.locator('[data-task]').all();
  
  for (let i = 0; i < expectedOrder.length; i++) {
    const taskTitle = await tasks[i].getAttribute('data-task-title');
    expect(taskTitle).toBe(expectedOrder[i].title);
  }
});

// Overdue Task Steps
Given('there is a task {string} with due date {string}', async function (taskTitle, dueDate) {
  await page.evaluate(({ title, date }) => {
    window.testUtils.createTask({ title, dueDate: date });
  }, { title: taskTitle, date: dueDate });
  await page.reload();
});

Then('the task should display an overdue indicator', async function () {
  const indicator = page.locator('[data-overdue="true"]');
  await expect(indicator).toBeVisible();
});

Then('the task should be highlighted as overdue', async function () {
  const task = page.locator('[data-task][data-overdue="true"]');
  await expect(task).toHaveClass(/overdue/);
});

// Task Assignment Steps
Given('there are team members available', async function () {
  await page.evaluate(() => {
    window.testUtils.seedTeamMembers([
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ]);
  });
});

When('I assign the task to {string}', async function (memberName) {
  await page.click('[data-assignee-selector]');
  await page.click(`[data-member-name="${memberName}"]`);
});

Then('the task should show {string} as assignee', async function (memberName) {
  const assignee = page.locator('[data-assignee]');
  await expect(assignee).toContainText(memberName);
});

Then('{string} should receive a notification', async function (memberName) {
  // This would verify via API or mock notification service
  const notifications = await page.evaluate(() => {
    return window.testUtils.getNotifications();
  });
  
  expect(notifications).toContainEqual(
    expect.objectContaining({
      recipient: memberName,
      type: 'task_assigned',
    })
  );
});