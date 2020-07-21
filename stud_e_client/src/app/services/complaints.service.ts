import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { TextInformationModel, StatisticsModel, SentimentLabel, CategoryModel } from '../models/complaints.model';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsService {

  constructor(
    private http: HttpClient,
    private decimalPipe: DecimalPipe,
  ) { }

  /**
   * Fetch All Complaints
   */
  public fetchAllComplaints(): Observable<Array<TextInformationModel>> {
    return this.http.get(`${environment.API_ENDPOINT}complaints`)
      .pipe(map((list: Array<TextInformationModel>) => {
        return list;
      }));
  }

  /**
   * 
   * @param list TextInformationModel
   * Generate List Data
   */
  public generateListData(list: Array<TextInformationModel>): Array<TextInformationModel> {
    list.forEach((each) => {
      let maxEmotion = '';
      let maxEmotionPer = 0;
      let totalEmotion = 0;
      Object.keys(each.emotion.document.emotion).forEach((eachEmotion) => {
        if (maxEmotionPer <= each.emotion.document.emotion[eachEmotion]) {
          maxEmotionPer = each.emotion.document.emotion[eachEmotion];
          maxEmotion = eachEmotion;
        }
        totalEmotion = totalEmotion + each.emotion.document.emotion[eachEmotion];
      });
      each.emotion.maximumEmotion = maxEmotion;

      each.emotion.emotionDataForChart = [
        Number(this.decimalPipe.transform((each.emotion.document.emotion.anger / totalEmotion) * 100, '0.2-2')),
        Number(this.decimalPipe.transform((each.emotion.document.emotion.disgust / totalEmotion) * 100, '0.2-2')),
        Number(this.decimalPipe.transform((each.emotion.document.emotion.fear / totalEmotion) * 100, '0.2-2')),
        Number(this.decimalPipe.transform((each.emotion.document.emotion.joy / totalEmotion) * 100, '0.2-2')),
        Number(this.decimalPipe.transform((each.emotion.document.emotion.sadness / totalEmotion) * 100, '0.2-2')),
      ];

    });
    /******************************* Category analyze **********************/
    list.forEach((each: TextInformationModel) => {
      each.categories.forEach((item: CategoryModel) => {
        item.categoryStructure = item.label.split('/');
        item.categoryStructure.shift();
        item.showLabel = item.categoryStructure.join(' -> ');
      });
    });
    return list;
  }

  /**
   * 
   * @param list TextInformationModel
   * Generate Statistics
   */
  public generateStatistics(list: Array<TextInformationModel>): StatisticsModel {
    const statistics = new StatisticsModel();

    /******************************* sentiment analyze **********************/
    statistics.sentiment.document.score = 0;
    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;
    list.forEach((each: TextInformationModel) => {
      statistics.sentiment.document.score += each.sentiment.document.score;
      if (each.sentiment.document.label === SentimentLabel.Positive) {
        positiveCount++;
      } else if (each.sentiment.document.label === SentimentLabel.Neutral) {
        neutralCount++;
      } else if (each.sentiment.document.label === SentimentLabel.Negative) {
        negativeCount++;
      }
    });
    statistics.sentimentCountList = [
      Number(this.decimalPipe.transform((positiveCount / list.length) * 100, '0.2-2')),
      Number(this.decimalPipe.transform((neutralCount / list.length) * 100, '0.2-2')),
      Number(this.decimalPipe.transform((negativeCount / list.length) * 100, '0.2-2')),
    ];
    if (list.length) {
      statistics.sentiment.document.score = statistics.sentiment.document.score / list.length;
    }
    if (statistics.sentiment.document.score <= 1 && statistics.sentiment.document.score > 0.33) {
      statistics.sentiment.document.label = SentimentLabel.Positive;
    } else if (statistics.sentiment.document.score <= 0.33 && statistics.sentiment.document.score > -0.66) {
      statistics.sentiment.document.label = SentimentLabel.Neutral;
    } else {
      statistics.sentiment.document.label = SentimentLabel.Negative;
    }

    /******************************* Emotion analyze **********************/

    list.forEach((each: TextInformationModel) => {
      statistics.emotion.document.emotion[each.emotion.maximumEmotion]++;
    });

    return statistics;
  }

  /**
   * 
   * @param text is a string
   * Submit Feedback
   */
  public submitFeedback(text: string): Observable<any> {
    const data = {
      mydata: text,
    };
    const config = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(`${environment.COMPLAINT_PROCESS_API_ENDPOINT}suggestionbox/postme`, data, config)
      .pipe(mergeMap((result: any) => {
        console.log(JSON.parse(result.msg));
        return this.http.post(`${environment.API_ENDPOINT}complaints`, JSON.parse(result.msg), config);
      }));
  }

  /**
   * 
   * @param text string
   * @param sourceLanguage string
   * @param targetLanguage string
   * Convert Text
   */
  public convertText(text: string, sourceLanguage: string, targetLanguage: string) {
    const config = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(`${environment.COMPLAINT_PROCESS_API_ENDPOINT}translator/translate`, {
      mydata: text,
      modelid: `${sourceLanguage}-${targetLanguage}`
    }, config);
  }

  /**
   * 
   * @param text string
   * Send Message
   */
  public sendReminderMessage(text: string): Observable<any> {
    const data = {
      mydata: text,
    };
    const config = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(`${environment.COMPLAINT_PROCESS_API_ENDPOINT}notification/sendsms`, data, config);
  }

}
