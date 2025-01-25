import { CalculatePartnersRequest } from '../models/request';
import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';

export class PartnerCalculationService {
    private danceStyles = ['Waltz', 'Tango', 'Foxtrot'];
    private db: Database | undefined;

    constructor() {
        this.initializeDatabase().then(() => {
            this.insertInitialData();
        }).catch(error => {
            console.error('Failed to initialize database:', error);
        });
    }

    public async initializeDatabase() {
        this.db = await open({
            filename: './dance-partner-calculator.db',
            driver: sqlite3.Database
        });

        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS dance_styles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                style TEXT NOT NULL,
                count INTEGER NOT NULL DEFAULT 0
            )
        `);
    }

    private async insertInitialData() {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const existingStyles = await this.db.all('SELECT style FROM dance_styles');
        const existingStyleNames = existingStyles.map((row: { style: string }) => row.style);

        for (const style of this.danceStyles) {
            if (!existingStyleNames.includes(style)) {
                await this.db.run('INSERT INTO dance_styles (style, count) VALUES (?, 0)', [style]);
            const randomCount = Math.floor(Math.random() * 10) + 1;
            await this.db.run('UPDATE dance_styles SET count = ? WHERE style = ?', [randomCount, style]);
            }
        }
    }
    public async closeDatabase(): Promise<void> {
        if (this.db) {
            await this.db.close();
            this.db = undefined;
        }
    }
    async calculateAveragePartners(request: CalculatePartnersRequest): Promise<number> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const { total_leaders, total_followers, leader_knowledge, follower_knowledge, dance_duration_minutes } = request;

        const danceTimePerDance = 5; // minutes
        const totalDances = Math.floor(dance_duration_minutes / danceTimePerDance);
        const dancesPerStyle = totalDances / this.danceStyles.length;

        const initializeParticipants = (totalLeaders: number, totalFollowers: number) => {
            let leaders: Record<number, string[]> = {};
            let followers: Record<string, string[]> = {};

            for (let i = 1; i <= totalLeaders; i++) {
                leaders[i] = leader_knowledge[i] || [];
            }
            for (let i = 1; i <= totalFollowers; i++) {
                followers[String.fromCharCode(64 + i)] = follower_knowledge[String.fromCharCode(64 + i)] || [];
            }

            return { leaders, followers };
        };

        const getStyleParticipants = (style: string, participants: Record<string | number, string[]>) => {
            return Object.entries(participants)
                .filter(([, styles]) => styles.includes(style))
                .map(([id]) => id);
        };

        const generateMatches = (leaders: Record<number, string[]>, followers: Record<string, string[]>) => {
            let matches: Record<string, { leader: string | number, follower: string }[]> = {};

            this.danceStyles.forEach(style => {
                const styleLeaders = getStyleParticipants(style, leaders);
                const styleFollowers = getStyleParticipants(style, followers);
                matches[style] = [];

                for (let i = 0; i < dancesPerStyle; i++) {
                    const leader = styleLeaders[Math.floor(Math.random() * styleLeaders.length)];
                    const follower = styleFollowers[Math.floor(Math.random() * styleFollowers.length)];
                    matches[style].push({ leader, follower });
                }
            });

            return matches;
        };

        const calculateAverageMatches = (matches: Record<string, { leader: string | number, follower: string }[]>) => {
            let totalLeaders = new Set<string | number>();
            let totalFollowers = new Set<string>();
            //console.log('Matches:', matches);
            Object.keys(matches).forEach(style => {
           // console.log(`Matches for ${style}:`, matches[style].length);
            matches[style].forEach(({ leader, follower }) => {
                totalLeaders.add(leader);
                totalFollowers.add(follower);
            });
            });

            const avgLeaderMatches = Array.from(totalLeaders).length / Object.keys(matches).length;
            const avgFollowerMatches = Array.from(totalFollowers).length / Object.keys(matches).length;
            const numMatch = Object.keys(matches).reduce((sum, style) => sum + matches[style].length, 0);
            const avgMatches = numMatch / this.danceStyles.length;
            return { avgLeaderMatches, avgFollowerMatches, numMatch, avgMatches };
        };

        const participants = initializeParticipants(total_leaders, total_followers);
        const matches = generateMatches(participants.leaders, participants.followers);
        const { avgLeaderMatches, avgFollowerMatches, numMatch,avgMatches } = calculateAverageMatches(matches);

        const totalAvgMatches = Math.ceil(avgLeaderMatches + avgFollowerMatches);
       // console.log('Matches:', matches);
        // Track dance styles in the database
        for (const style of this.danceStyles) {
            await this.trackDanceStyles(matches[style].map(match => style));
        }

        return Promise.resolve(avgMatches ?? 0);
    }

    public getDatabase(): Database | undefined {

        return this.db;
    
      }
    private async trackDanceStyles(danceStyles: string[]): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        for (const style of danceStyles) {
            const row = await this.db.get('SELECT * FROM dance_styles WHERE style = ?', [style]);
            if (row) {
                await this.db.run('UPDATE dance_styles SET count = count + 1 WHERE style = ?', [style]);
            } else {
                await this.db.run('INSERT INTO dance_styles (style, count) VALUES (?, 1)', [style]);
            }
        }
    }

    public async getDanceStyleCounts(): Promise<Record<string, number>> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const rows = await this.db.all('SELECT style, count FROM dance_styles');
        const danceStyleCounts: Record<string, number> = {};
        rows.forEach((row: { style: string; count: number }) => {
            danceStyleCounts[row.style] = row.count;
        });
        return danceStyleCounts;
    }
}