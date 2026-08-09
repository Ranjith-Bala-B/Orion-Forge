import { initialHackathons, initialHistoryEntries, initialNotifications } from '../data/vaultInitialData';
import { vaultService } from '../services/vaultService';
import { authService } from '../services/authService';

/**
 * Migration Script
 * 
 * Usage:
 * Call this function from the browser console or a temporary button in the UI
 * to push all local initial data to Supabase.
 * Make sure you are logged in to the Vault first so RLS allows writes!
 */
export const migrateVaultDataToSupabase = async () => {
  console.log('Starting Vault Migration...');

  // Ensure authenticated
  if (!authService.isAuthenticated()) {
    console.error('Migration failed: You must be logged into the Vault first.');
    return;
  }

  try {
    // 1. Migrate Hackathons
    console.log(`Migrating ${initialHackathons.length} hackathons...`);
    for (const hackathon of initialHackathons) {
      await vaultService.saveHackathonItem(hackathon);
      console.log(`- Saved Hackathon: ${hackathon.name}`);
    }

    // 2. Migrate History
    console.log(`Migrating ${initialHistoryEntries.length} history entries...`);
    for (const entry of initialHistoryEntries) {
      await vaultService.saveHistoryItem(entry);
      console.log(`- Saved History Entry: ${entry.projectName}`);
    }

    // 3. Migrate Notifications
    console.log(`Migrating ${initialNotifications.length} notifications...`);
    await vaultService.saveNotifications(initialNotifications);
    console.log('- Saved Notifications');

    console.log('Migration Complete! All data has been successfully pushed to Supabase.');
  } catch (error) {
    console.error('Migration encountered an error:', error);
  }
};
