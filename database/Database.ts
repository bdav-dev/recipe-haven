import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabaseSync('recipe-haven');
export default database;

export async function initializeDatabase() {
    await database.execAsync("PRAGMA journal_mode = WAL;");
}