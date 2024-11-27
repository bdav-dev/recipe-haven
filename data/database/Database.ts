import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabaseSync('recipe-haven');
export default database;

export function setDatabaseJournalingToWal() {
    database.execSync("PRAGMA journal_mode = WAL;");
}