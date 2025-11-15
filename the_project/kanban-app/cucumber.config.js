export default {
  default: {
    require: ['tests/integration/features/step_definitions/**/*.js'],
    requireModule: ['@babel/register'],
    format: [
      'progress-bar',
      'html:coverage/cucumber-report.html',
      'json:coverage/cucumber-report.json',
      '@cucumber/pretty-formatter',
    ],
    paths: ['tests/integration/features/**/*.feature'],
    publishQuiet: true,
  },
};