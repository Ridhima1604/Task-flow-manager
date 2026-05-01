const mongoose = require('mongoose');

async function fixName() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to live DB...");
  const db = mongoose.connection;
  
  // Update User profile
  const users = db.collection('users');
  const userResult = await users.updateOne(
    { email: 'ridhima@teamtask.io' }, 
    { $set: { name: 'Ridhima Pandey' } }
  );
  console.log(`Updated user document: ${userResult.modifiedCount}`);
  
  // Update Activity Logs in Projects
  const projects = db.collection('projects');
  const projectResult = await projects.updateMany(
    { "activityLog.userName": "Ridhima Sharma" },
    { $set: { "activityLog.$[elem].userName": "Ridhima Pandey" } },
    { arrayFilters: [{ "elem.userName": "Ridhima Sharma" }] }
  );
  console.log(`Updated project activity logs: ${projectResult.modifiedCount}`);
  
  console.log("Instant fix complete!");
  process.exit(0);
}

fixName().catch(console.error);
