import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { userDetails, QuestionModel } from '../models/complaints.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SentimentModel } from '../models/sentiments.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public isAdmitted$: BehaviorSubject<boolean>;
  public isLoading$: BehaviorSubject<boolean>;
  public userDetails: userDetails;

  constructor(
    private http: HttpClient,
  ) {
    this.isAdmitted$ = new BehaviorSubject<boolean>(false);
    this.isLoading$ = new BehaviorSubject<boolean>(false);
  }

  /**   
   * @param isAdmitted must be a boolean value
   * publish isAdmitted value 
   */
  public publishIsAdmitted(isAdmitted: boolean) {
    this.isAdmitted$.next(isAdmitted);
  }

  /**
   * 
   * @param isLoading must be a boolean value
   * publish isLoading value
   */
  public publishIsLoading(isLoading: boolean) {
    this.isLoading$.next(isLoading);
  }

  /**
   * Fetch All Complaints
   */
  public fetchAllComplaints(): Observable<Array<QuestionModel>> {
    return this.http.get(`${environment.API_ENDPOINT}questions`)
      .pipe(map((list: Array<QuestionModel>) => {
        return list;
      }));
  }

  /**
   * Submit Sentiment Analysis Data
   */
  public submitSentimentalAnalysis(data: SentimentModel): Observable<any> {    
    const config = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(`${environment.SENTIMENT_PROCESS_API_ENDPOINT}sentiments`, data, config);
  }

  /**
   * Get Sentimet Analysis Data
   */
  public getSentimentalAnalysis(): Observable<any> {   
    return this.http.get(`${environment.SENTIMENT_PROCESS_API_ENDPOINT}sentiments`);
  }
}
