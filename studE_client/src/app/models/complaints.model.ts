export enum SentimentLabel {
    Positive = 'positive',
    Neutral = 'neutral',
    Negative = 'negative',
}
export const sentimentColorList = ['#00e676', '#ffea00', '#ff1744'];
export const emontionList = ['anger', 'disgust', 'fear', 'joy', 'sadness'];
export const emontionColorList = ['#ff1744', '#00e676', '#343a40', '#ffea00', '#007bff'];

export const initialQuestionTime = 1 * 60 * 1000;
export const nextQuestionTime = 1 * 60 * 1000;
export const answerTime = 25 * 1000;
export const answerCheckTime = 10 * 1000;

/**
 * Answer Status Model
**/ 
export enum AnswerStatus {
    Pending = 'pending',
    Right = 'right',
    Wrong = 'wrong',
    Timeout = 'timeout',
}

/**************************** Model **********************************/

export class SentimentModel {
    public document: {
        score: number;
        label: SentimentLabel;
    };
    constructor() {
        this.document = {
            score: 0,
            label: SentimentLabel.Neutral,
        };
    }
}

/**
 * Emotion Model
**/ 
export class EmotionModel {
    public anger: number;
    public disgust: number;
    public fear: number;
    public joy: number;
    public sadness: number;
    constructor() {
        this.anger = 0;
        this.disgust = 0;
        this.fear = 0;
        this.joy = 0;
        this.sadness = 0;
    }
}

/**
 * Emotion Model
**/ 
export class KeyWordModel {
    public text: string;
    public emotion: EmotionModel;
}


/**
 * Category Model
**/ 
export class CategoryModel {
    public score: number;
    public label: string;
    public categoryStructure: Array<string>;
    public showLabel: string;
}

/**
 * TextInformation Model
**/ 
export class TextInformationModel {
    public _id: string;
    public sentiment: SentimentModel;
    public keywords: Array<KeyWordModel>;
    public emotion: {
        document: {
            emotion: EmotionModel,
        },
        emotionDataForChart: Array<number>,
        maximumEmotion: string,
    };
    public categories: Array<CategoryModel>;
    public analyzed_text: string;
}

/**
 * Statistics Model
**/ 
export class StatisticsModel {
    public sentiment: SentimentModel;
    public sentimentCountList: Array<number>;
    public emotion: {
        document: {
            emotion: EmotionModel,
        },
    };
    constructor() {
        this.sentiment = new SentimentModel();
        this.sentimentCountList = [];
        this.emotion = {
            document: {
                emotion: new EmotionModel(),
            },
        };
    }
}

/**
 * FilterItem Model
**/ 
export class FilterItemModel {
    public key: string;
    public label: string;
    public isChecked: boolean;
    public subFilter: Array<FilterItemModel>;
    constructor() {
        this.isChecked = true;
        this.subFilter = [];
    }
}

/**
 * UserDetails Model
**/ 
export class userDetails {
    public userName: string;
}


/**
 * Question Model
**/ 
export class QuestionModel {
    public className: string;
    public question: string;
    public answers: Array<string>;
    public rightAnswer: string;
}
