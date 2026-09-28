// Script to set up Back4App database schema automatically
// Run with: node setup-db.js
require('dotenv').config();
const Parse = require('parse/node');

// Initialize Parse with Master Key for schema operations
Parse.initialize(
  process.env.PARSE_APPLICATION_ID,
  process.env.PARSE_JAVASCRIPT_KEY,
  process.env.PARSE_MASTER_KEY
);
Parse.serverURL = process.env.PARSE_SERVER_URL;

async function setupDatabase() {
  console.log('Setting up Back4App database schema...\n');

  try {
    const schema = new Parse.Schema('Todo');

    // Check if the Todo class already exists
    let existing = null;
    try {
      existing = await schema.get({ useMasterKey: true });
    } catch (e) {
      // Class does not exist yet - that's fine
    }

    if (existing) {
      console.log('Todo class already exists. Checking columns...');
      const fields = existing.fields || {};

      if (!fields.text) {
        schema.addString('text');
        console.log('  + Adding "text" column');
      }
      if (!fields.completed) {
        schema.addBoolean('completed');
        console.log('  + Adding "completed" column');
      }
      if (!fields.userId) {
        schema.addString('userId');
        console.log('  + Adding "userId" column');
      }

      await schema.update({ useMasterKey: true });
      console.log('\nTodo class updated successfully!');
    } else {
      console.log('Creating Todo class with columns...');
      schema.addString('text');
      schema.addBoolean('completed');
      schema.addString('userId');

      await schema.save({ useMasterKey: true });
      console.log('  + text (String)');
      console.log('  + completed (Boolean)');
      console.log('  + userId (String)');
      console.log('\nTodo class created successfully!');
    }

    console.log('\nDatabase setup complete. You can now run the app with: npm run dev');
  } catch (error) {
    console.error('Error setting up database:', error.message);
    process.exit(1);
  }
}

setupDatabase();
