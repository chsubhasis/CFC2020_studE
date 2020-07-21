/**
 * Sentiment Model
**/ 
export class SentimentModel {
    public studentName: string;
    public sentiment: string;
    public score: number;
    public dateTime: string;
    public imageName: string; 
}

/**
 * Chart Border Colors Model
**/ 
export enum sentimentBorderColors {
    'angry' = '#ff1744',   
    'disgusted' = '#00e676',
    'fearful' = '#343a40',
    'happy' = '#ffea00',
    'neutral' = '#18ffff ',
    'sad' = '#007bff',
    'surprised' = '#ff6f00'
}

/**
 * Chart Background Color Model
**/ 
export enum sentimentBackgroundColors {
    'angry' = 'rgb(255, 23, 68, 0.4)',   
    'disgusted' = 'rgb(0, 230, 118, 0.4)',
    'fearful' = 'rgb(52, 58, 64, 0.4)',
    'happy' = 'rgb(255, 234, 0, 0.4)',
    'neutral' = 'rgb(24, 255, 255, 0.4)',
    'sad' = 'rgb(0, 123, 255, 0.4)',
    'surprised' = 'rgb(255, 111, 0, 0.4)'
}