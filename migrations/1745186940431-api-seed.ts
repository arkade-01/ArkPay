// Import your schemas here
import type { Connection } from 'mongoose'

export async function up(connection: Connection): Promise<void> {
  // Add resetToken and resetTokenExpiration fields to existing User documents
  await connection.collection('users').updateMany(
    {}, // Match all documents
    {
      $set: {
        apiKey: null,
        apiUsage: {
          dates: {},
          totalCalls: 0
        }
      }
    }
  );

  console.log('Migration completed: Added apiKey field to User schema');
}

export async function down(connection: Connection): Promise<void> {
  // Remove the fields if you need to roll back
  await connection.collection('users').updateMany(
    {},
    {
      $unset: {
        apiKey: "",
        apiUsage: ""
      }
    }
  );

  console.log('Rollback completed: Removed apiKey field from User schema');
}