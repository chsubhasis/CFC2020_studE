import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { CommonService } from 'src/app/services/common.service';
import { sentimentBackgroundColors, sentimentBorderColors } from 'src/app/models/sentiments.model';

@Component({
  selector: 'app-sentiment-analysis',
  templateUrl: './sentiment-analysis.component.html',
  styleUrls: ['./sentiment-analysis.component.css']
})
export class SentimentAnalysisComponent implements OnInit {

  public backgroundColor: Array<string>;
  public barChartOptions: ChartOptions;
  public barChartLabels: Label[];
  public barChartType: ChartType = 'bar';
  public barChartData: ChartDataSets[];
  @Output() isLoading = new EventEmitter<boolean>();

  constructor(
    private commonService: CommonService
  ) {
    this.barChartLabels = [];
    this.backgroundColor = [];
  }

  ngOnInit() {
    // get data
    this.getSentimentAnalysisData();
  }

  /**
   * Fetch data
   */
  private getSentimentAnalysisData(): void {    
    this.commonService.publishIsLoading(true);
    // subscribe to API
    this.commonService.getSentimentalAnalysis().subscribe((response) => {
      // Group Data based on sentiment and count it
      let chartData = response.reduce((a, b) => {
        let sentimentName = b.sentiment;
        if (!a.hasOwnProperty(sentimentName)) {
          a[sentimentName] = 0;
        }
        a[sentimentName]++;
        return a;
      }, {});
      // Group Data based on sentiment and count it

      let sentimentsCountArr: Array<number> = [];
      let borderColor: Array<string> = [];

      // create labels
      for(let key of Object.keys(chartData)) {
        this.barChartLabels.push(key.charAt(0).toUpperCase() + key.slice(1));
        sentimentsCountArr.push(chartData[`${key}`]);
        this.backgroundColor.push(sentimentBackgroundColors[`${key}`]); 
        borderColor.push(sentimentBorderColors[`${key}`]);        
      }
      // prepare chart data and styling
      this.barChartData = [{
        data: sentimentsCountArr, 
        backgroundColor: this.backgroundColor,
        borderColor,
        borderWidth: 1,
        hoverBackgroundColor: borderColor,
        hoverBorderColor: borderColor
      }];

      // calculate step size
      const stepSize = Math.round((Math.max(...sentimentsCountArr) - Math.min(...sentimentsCountArr))/10);

      // styling & animation
      this.barChartOptions = {
          responsive: true,
          scales: { 
              xAxes: [{
            }], 
            yAxes: [{
              ticks: {
                stepSize
              }
            }] 
          },
          hover: {
            animationDuration: 0
          },
          animation: {
            onComplete: function() {
              var chartInstance = this.chart,
                ctx = chartInstance.ctx;        
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';

              this.data.datasets.forEach(function(dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                meta.data.forEach(function(bar, index) {
                  var data = dataset.data[index];
                  ctx.fillText(data, bar._model.x, bar._model.y - 5);
                });
              });
            }
          },
          tooltips: {
            enabled: false
          },
          plugins: {
            datalabels: {
              anchor: 'end',
              align: 'end',
            }
          },
          legend:{
            display: false
          },
          layout: {
            padding: {
                top: 30,
                right: 30
            }
          }
        };
    },
      () => {}, 
      () => {       
        // publish isLoading  
        this.commonService.publishIsLoading(false);
    });
    
  }

}
