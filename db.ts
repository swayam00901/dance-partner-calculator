import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const initializeDatabase = async () => {
    const db = await open({
        filename: './dance-partner-calculator.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS dance_styles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            style TEXT NOT NULL,
            count INTEGER NOT NULL DEFAULT 0
        )
    `);

    return db;
};