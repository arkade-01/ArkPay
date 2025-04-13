// Import your schemas here
import type { Connection } from 'mongoose'

export async function up(connection: Connection): Promise<void> {
  // Add resetToken and resetTokenExpiration fields to existing User documents
  await connection.collection('users').updateMany(
    {}, // Match all documents
    {
      $set: {
        resetToken: null,
        resetTokenExpiration: null
      }
    }
  );

  console.log('Migration completed: Added resetToken and resetTokenExpiration fields to User schema');
}

export async function down(connection: Connection): Promise<void> {
  // Remove the fields if you need to roll back
  await connection.collection('users').updateMany(
    {},
    {
      $unset: {
        resetToken: "",
        resetTokenExpiration: ""
      }
    }
  );

  console.log('Rollback completed: Removed resetToken and resetTokenExpiration fields from User schema');
}