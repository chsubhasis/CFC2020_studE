import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ComplaintsService } from 'src/app/services/complaints.service';
import { TextInformationModel, StatisticsModel, emontionList, SentimentLabel, CategoryModel, FilterItemModel, emontionColorList, sentimentColorList } from 'src/app/models/complaints.model';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {

  public list: Array<TextInformationModel> = [];
  public originalList: Array<TextInformationModel> = [];
  public statistics: StatisticsModel = new StatisticsModel();
  public isLoading: boolean = false;
  public filterOptions: Array<FilterItemModel> = [];
  public sidebarOpened: boolean = false;
  public selectedTab: string = 'dashboard';
  public selectedSentiment: string = '';

  // Common chart info
  public statisticsChartOptions: ChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      position: 'bottom',
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          return `${data.datasets[0].data[tooltipItem.index]}%`;
        },
      },
    },
  };
  public pieChartType: ChartType = 'pie';

  // sentiment chart info
  public sentimentLabels: Label[] = ['Positive', 'Neutral', 'Negative'];
  public sentimentData: SingleDataSet = [0, 0, 0];
  public originalSentimentData: SingleDataSet = [0, 0, 0];
  public sentimentColors = [{
    backgroundColor: sentimentColorList,
  }];
  public sentimentLegend = false;
  public sentimentPlugins = [];
  public sentimentChartOptions: ChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          return `${data.datasets[0].data[tooltipItem.index]}%`;
        },
      },
    },
  };

  // emotion chart info
  public emotiontOptions: ChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
  };
  public emotiontLabels: Label[] = emontionList.map((each) => this.toCapitalize(each));
  public emotiontData: SingleDataSet = [0, 0, 0, 0, 0];
  public emotiontColors = [{
    backgroundColor: emontionColorList,
  }];
  public emotiontType: ChartType = 'pie';
  public emotiontLegend = false;
  public emotiontPlugins = [];

  // complaint level emotion chart info
  public complaintEmotiontLegend = true;
  public complaintEmotiontOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right',
    },
    // tooltips
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          return `${data.datasets[0].data[tooltipItem.index]}%`;
        },
      },
    },
  };

  public get emontionList() { return emontionList; }
  public get SentimentLabel() { return SentimentLabel; }
  public isSentimentDataFetched: boolean;

  constructor(
    private complaintsService: ComplaintsService,
    private decimalPipe: DecimalPipe,
    private route: Router,
    private commonService: CommonService,
    private cd: ChangeDetectorRef
  ) {
    this.commonService.isLoading$.subscribe(isLoading => {
      this.isSentimentDataFetched = isLoading;
    })
   }

  ngOnInit() {
    // Call Complaint List
    this.fetchComplaintList();
    console.log(this.commonService.userDetails);
  }


  // Fetch Complaint List
  private fetchComplaintList() {
    this.isLoading = true;
    this.complaintsService.fetchAllComplaints()
      .subscribe((list: Array<TextInformationModel>) => {
        this.originalList = this.complaintsService.generateListData(list);
        this.originalList = JSON.parse(JSON.stringify(this.originalList));
        this.generateStatistics(list);
        this.generateFilterOptions(list);
        this.originalSentimentData = this.sentimentData;
      }, 
      () => { }, 
      () => { 
        this.isLoading = false; 
      });
  }

  /**
   * 
   * @param list TextInformationModel
   * Generate Statistics
   */
  private generateStatistics(list: Array<TextInformationModel>): void {
    this.list = this.complaintsService.generateListData(list);
    this.statistics = this.complaintsService.generateStatistics(list);
    this.sentimentData = this.statistics.sentimentCountList;
    const emotion = this.statistics.emotion.document.emotion;
    this.emotiontData = [
      Number(this.decimalPipe.transform((emotion.anger / this.list.length) * 100, '0.2-2')),
      Number(this.decimalPipe.transform((emotion.disgust / this.list.length) * 100, '0.2-2')),
      Number(this.decimalPipe.transform((emotion.fear / this.list.length) * 100, '0.2-2')),
      Number(this.decimalPipe.transform((emotion.joy / this.list.length) * 100, '0.2-2')),
      Number(this.decimalPipe.transform((emotion.sadness / this.list.length) * 100, '0.2-2'))];
  }

  /**
   * 
   * @param list TextInformationModel
   * Generate Filter Option
   */
  private generateFilterOptions(list: Array<TextInformationModel>): void {

    // Generate filters for Sentiment
    this.filterOptions = [];
    this.filterOptions.push({
      key: 'sentiment',
      label: 'Sentiment',
      isChecked: true,
      subFilter: [],
    });
    this.sentimentLabels.forEach((each) => {
      const filterOptions = new FilterItemModel();
      filterOptions.key = each.toString().toLowerCase();
      filterOptions.label = each.toString();
      this.filterOptions[0].subFilter.push(filterOptions);
    });

    // Generate filters for Emotion
    this.filterOptions.push({
      key: 'emotion',
      label: 'Emotion',
      isChecked: true,
      subFilter: [],
    });
    emontionList.forEach((each) => {
      const filterOptions = new FilterItemModel();
      filterOptions.key = each.toString().toLowerCase();
      filterOptions.label = this.toCapitalize(each).toString();
      this.filterOptions[1].subFilter.push(filterOptions);
    });
  }

  /**
   * Change Filter
   */
  public changeFilter(): void {
    let list: Array<TextInformationModel> = JSON.parse(JSON.stringify(this.originalList));
    const selectedSentiment = this.filterOptions[0].subFilter.filter((each) => each.isChecked).map((each) => each.key);

    const selectedEmotion = this.filterOptions[1].subFilter.filter((each) => each.isChecked).map((each) => each.key);

    // filter
    list = list.filter((each) => {
      let sentimentMatched = false;
      let emotionMatched = false;
      if (selectedSentiment.indexOf(each.sentiment.document.label) > -1) {
        sentimentMatched = true;
      }
      if (selectedEmotion.indexOf(each.emotion.maximumEmotion) > -1) {
        emotionMatched = true;
      }
      return sentimentMatched && emotionMatched;
    });
    this.generateStatistics(list);
  }

  /**
   * 
   * @param tabName must be a string
   * Change Tab
   */
  public changeTab(tabName: string) {
    this.selectedTab = tabName;
    this.clearFilter();
  }

  /**
   * 
   * @param key must be a string
   * Change Sentiment Filter
   */
  public changeSentimentFilter(key: string) {
    this.filterOptions[0].subFilter.forEach((each) => {
      each.isChecked = each.key === key;
    });
    this.selectedSentiment = key;
    this.changeFilter();
  }

  /**
   * Show Emotion Analysis Name
   */
  public showEmotionAnalysisName(): string {
    if (this.selectedSentiment === '') {
      return `Overall Emotions Analysis`;
    } else {
      const sentimentIndex = this.filterOptions[0].subFilter.findIndex((each) => each.key === this.selectedSentiment);
      return `Emotions Analysis of ${this.filterOptions[0].subFilter[sentimentIndex].label} Sentiment`;
    }
  }

  /**
   * Show Feedback List Name
   */
  public showFeedbackListName(): string {
    if (this.selectedSentiment === '' || this.selectedTab === 'feedback-list') {
      return `Feedback List`;
    } else {
      const sentimentIndex = this.filterOptions[0].subFilter.findIndex((each) => each.key === this.selectedSentiment);
      return `${this.filterOptions[0].subFilter[sentimentIndex].label} Feedback List `;
    }
  }

  /**
   * Clear Filter
   */
  public clearFilter() {
    this.selectedSentiment = '';
    this.list = JSON.parse(JSON.stringify(this.originalList));
    this.generateStatistics(this.list);
    this.generateFilterOptions(this.list);
  }

  /**
   * 
   * @param text must be a string
   * Capitalize a string
   */
  private toCapitalize(text: string) {
    if (text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    }
    return '';
  }

  /**
   * 
   * @param key is a string
   * GET Sentiment Color
   */
  public getSentimentColor(key: string) {
    if (key === SentimentLabel.Positive) {
      return sentimentColorList[0];
    } else if (key === SentimentLabel.Neutral) {
      return sentimentColorList[1];
    } else if (key === SentimentLabel.Negative) {
      return sentimentColorList[2];
    }
  }

  /**
   * 
   * @param key is a string
   * Get Emotion Color
   */
  public getEmotionColor(key: string) {
    const index = emontionList.indexOf(key);
    if (index > -1) {
      return emontionColorList[index];
    }
    return '';
  }

  /**
   * Go to Home Page
   */
  public goToHome() {
    if (this.commonService.userDetails) {
      this.route.navigate(['/join-us']);
    } else {
      this.route.navigate(['/']);
    }
  }

  /**
   * Detect changes
   */
  ngAfterViewInit() {
    this.cd.detectChanges();
  }

}
