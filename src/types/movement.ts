export interface MovementSession {
  id: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  count: number;
  duration?: number; // in minutes
  completed: boolean;
}

export interface Movement {
  id?: number;
  sessionId: string;
  timestamp: Date;
}

export interface MovementStats {
  totalSessions: number;
  averageCount: number;
  mostActiveTime?: string;
  weeklyAverage: number;
}
