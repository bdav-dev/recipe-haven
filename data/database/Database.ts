import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabaseSync('recipe-haven');
export default database;

export async function setDatabaseJournalingToWal() {
    await database.execAsync("PRAGMA journal_mode = WAL;");
}