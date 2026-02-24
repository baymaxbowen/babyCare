import Dexie, { Table } from 'dexie';
import type { Movement, MovementSession } from '../types/movement';
import type { Checkup } from '../types/checkup';

export class BabyDB extends Dexie {
  movements!: Table<Movement, number>;
  movementSessions!: Table<MovementSession, string>;
  checkups!: Table<Checkup, number>;

  constructor() {
    super('BabyMovementDB');

    this.version(1).stores({
      movements: '++id, sessionId, timestamp',
      movementSessions: 'id, date, startTime, completed',
      checkups: '++id, date, type, completed, createdAt'
    });
  }
}

export const db = new BabyDB();
