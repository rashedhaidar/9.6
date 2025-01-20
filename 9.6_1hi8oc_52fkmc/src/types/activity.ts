export interface Activity {
      id: string;
      title: string;
      domainId: string;
      description?: string;
      targetCount?: number;
      currentCount?: number;
      reminder?: {
        time: string;
        date: string;
        days: number[];
      };
      notes?: string;
      createdAt: string;
      weekNumber: number;
      year: number;
      allowSunday: boolean;
      selectedDays: number[];
      completedDays?: {
        [dayIndex: number]: boolean;
      };
      positiveNotes?: string[];
    }

    export interface WeeklySchedule {
      [key: string]: Activity[];
    }
