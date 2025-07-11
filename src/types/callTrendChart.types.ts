// Call data interfaces
export interface CallData {
    date: string;
    calls: number;
    answered: number;
    missed: number;
    rejected: number;
}

export interface PeakPerformanceData {
    timeSlot: string;
    label: string;
    value: string;
    type: 'answer-rate' | 'volume' | 'duration';
    percentage?: number;
}

export interface ChartConfig {
    calls: {
        label: string;
        color: string;
    };
    answered: {
        label: string;
        color: string;
    };
    missed: {
        label: string;
        color: string;
    };
    rejected: {
        label: string;
        color: string;
    };
}

export interface CallTrendChartProps {
    timeframe: string;
    campaign: string;
    data?: CallData[];
    peakPerformanceData?: PeakPerformanceData[];
}

export type ChartType = 'area' | 'line' | 'bar';

// API Response interfaces
export interface CallTrendResponse {
    data: CallData[];
    peakPerformance: PeakPerformanceData[];
    totalCalls: number;
    averageAnswerRate: number;
    timeframe: string;
}

export interface CallMetrics {
    totalCalls: number;
    answeredCalls: number;
    missedCalls: number;
    rejectedCalls: number;
    answerRate: number;
    missedRate: number;
    rejectedRate: number;
}