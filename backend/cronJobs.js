const dotenv = require('dotenv');
dotenv.config(); // Load environment variables first

const cron = require('node-cron');
const db = require('./config/db'); // Now db has access to environment variables

/**
 * Function to expire LoR requests
 */
const expireLorRequests = async () => {
  try {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

    // Update LoR requests that are PENDING or ACCEPTED and whose deadline has passed
    const updateQuery = `
      UPDATE lor_requests
      SET status = 'EXPIRED'
      WHERE status IN ('PENDING', 'ACCEPTED')
        AND deadline < ?
        AND status != 'EXPIRED'
      RETURNING request_id, status;
    `;

    const [results] = await db.execute(updateQuery, [today]);

    if (results.affectedRows > 0) {
      console.log(`Expired ${results.affectedRows} LoR request(s) on ${today}.`);
      // Optionally, log the expired request IDs
      // Note: MySQL doesn't support RETURNING clause in UPDATE statements.
      // You might need to perform a separate SELECT to retrieve updated rows if necessary.
    } else {
      console.log(`No LoR requests to expire on ${today}.`);
    }
  } catch (error) {
    console.error('Error expiring LoR requests:', error);
  }
};

/**
 * Schedule the task to run daily at midnight
 * Cron Expression: '0 0 * * *' => At 00:00 (midnight) every day
 */
const scheduleLorExpiration = () => {
  cron.schedule('0 0 * * *', () => {
    console.log('Running daily LoR expiration task...');
    expireLorRequests();
  }, {
    timezone: 'Asia/Kolkata', 
  });

  console.log('LoR expiration cron job scheduled.');
};

/**
 * Initialize cron jobs
 */
const initializeCronJobs = () => {
  scheduleLorExpiration();
};

module.exports = { initializeCronJobs };
