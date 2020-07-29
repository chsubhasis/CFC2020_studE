import { Component, OnInit, ElementRef, ViewChild, Renderer2, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import * as RTCMultiConnection from 'rtcmulticonnection';
import { SocketioService } from 'src/app/services/socketio.service';
import { DOCUMENT } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
import { languageList } from 'src/app/models/language.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ComplaintsService } from 'src/app/services/complaints.service';
import SpeechToText from 'speech-to-text';
import { SendReminderPopupComponent } from 'src/app/components/send-reminder-popup/send-reminder-popup.component';
import { CreateComplaintPopupComponent } from 'src/app/components/create-complaint-popup/create-complaint-popup.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { QuestionModel, initialQuestionTime, nextQuestionTime, answerTime, AnswerStatus, answerCheckTime } from 'src/app/models/complaints.model';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { SentimentModel } from 'src/app/models/sentiments.model';

@Component({
  selector: 'app-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.css']
})
export class MeetComponent implements OnInit, OnDestroy {
  // loacal video container
  @ViewChild('localVideoContainer', { static: false }) private localVideoContainer: ElementRef;
  // remote video container
  @ViewChild('remoteVideoContainer', { static: false }) private remoteVideoContainer: ElementRef;
  
  public hasJoined: boolean;
  private connection: RTCMultiConnection;
  public roomName: string;
  public isSharingScreen: boolean;
  private streamId: any;
  public userName: string;

  // speech to text
  public sourceLanguageKey: string = 'english';
  public targetLanguageKey: string = 'english';
  public convertedText: Array<string> = [];
  private listener;
  public listening: boolean = false;
  public isCCShowing: boolean = false;
  public get languageList() { return languageList; }

  // complaint
  private sendReminderPopup: BsModalRef;
  private complaintPopup: BsModalRef;

  // Questions
  public questionList: Array<QuestionModel> = [];
  public originalQuestionList: Array<QuestionModel> = [];
  public currentQuestionIndex: number = -1;
  public showQuestion: boolean = false;
  public selectedAnswer: string = '';
  public isLoading: boolean = false;
  public answerStatus: AnswerStatus = AnswerStatus.Pending;
  public initialQuestionTimeout;
  public nextQuestionInterval;
  public answerTimeout;
  public answerCheckTimeout;
  public get AnswerStatus() { return AnswerStatus; }
  // Modd Analysis URL
  public url: string = "https://demowebcam20200619103233.azurewebsites.net/";
  public urlSafe: SafeResourceUrl;

  constructor(
    private socketService: SocketioService,
    private renderer2: Renderer2,
    private commonService: CommonService,
    @Inject(DOCUMENT) private document,
    public changeDetector: ChangeDetectorRef,
    public complaintsService: ComplaintsService,
    private modalServicePopup: BsModalService,
    private route: Router,
    public sanitizer: DomSanitizer
  ) {
    this.hasJoined = false;
    this.isSharingScreen = false;
    if (this.commonService.userDetails) {
      this.userName = this.commonService.userDetails.userName;
    }
    // Sanitize url
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    // this.insertSentimentData();
  }

  ngOnInit(): void {
    // We have used a static room name as of now, this can be edited through the input box.
    this.roomName = 'physics_class4_secA';
  }

  ngOnDestroy() {
    if (this.complaintPopup) {
      this.complaintPopup.hide();
    }
    if (this.sendReminderPopup) {
      this.sendReminderPopup.hide();
    }
    this.removeWatsonChatbot();
    if (this.initialQuestionTimeout) {
      clearTimeout(this.initialQuestionTimeout);
    }
    if (this.nextQuestionInterval) {
      clearInterval(this.nextQuestionInterval);
    }
    if (this.answerTimeout) {
      clearTimeout(this.answerTimeout);
    }
    if (this.answerCheckTimeout) {
      clearTimeout(this.answerCheckTimeout);
    }
  }

  /**
   * Watson Chatbot
   */
  public watsonChatbot() {
    // chatbot
    const script = this.renderer2.createElement('script');
    script.onload = this.loadNextScript.bind(this);
    script.type = 'text/javascript';
    script.src = 'https://web-chat.global.assistant.watson.appdomain.cloud/loadWatsonAssistantChat.js';
    this.renderer2.appendChild(this.document.body, script);
    // chatbot

  }

  /**
   * Insert Sentiment Data
   */
  private insertSentimentData() {
    window.addEventListener("message", (event) => {
      if (event.data.v3 === 200) {
        const data = JSON.parse(JSON.parse(event.data.v4));
        const hasRecognized = data.images[0].classifiers[0].classes.length > 0 ? true : false;
        if (hasRecognized) {
          const requestData: SentimentModel =  {
            studentName: this.commonService.userDetails.userName,
            sentiment: data.images[0].classifiers[0].classes[0].class,
            score: data.images[0].classifiers[0].classes[0].score,
            dateTime: new Date().toDateString(),
            imageName: data.images[0].image     
          };
          this.commonService.submitSentimentalAnalysis(requestData).subscribe((response) => {
            console.log(response);
          });
        }
        
      }
    });
  }  

  /**
   * Remove Watson Chatbot
   */
  public removeWatsonChatbot() {
    let elements = document.getElementsByClassName('WatsonAssistantChatHost');
    if (elements && elements.length) {
      while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
      }
    }
  }

  /**
   * Join Room
   */
  public joinRoom(): void {
    // webRTC
    this.connection = new RTCMultiConnection();
    // socket URL
    this.connection.socketURL = `${environment.API_ENDPOINT}`;
    
    if (this.connection.isLowBandwidth === true) {
      alert('You are low bandwidth');
    }
    this.connection.session = {
      audio: true,
      data: true,
      video: true,
    };
    this.connection.bandwidth = {
      audio: 50,  // 50 kbps
      video: 256 // 256 kbps
    };
    this.connection.extra = this.commonService.userDetails;

    // event binding
    this.connection.onstream = (event) => {
      this.streamId = event.streamid;
      this.onstream(event);
    };

    // event attched
    this.connection.onstreamended = (event) => { this.onstreamended(event); };
    this.connection.onmessage = (event) => { this.onmessage(event); };

    // const predefinedRoomId = prompt('Please enter room-id', 'demo-room');
    this.connection.openOrJoin(this.roomName);
    // webRTC
    this.socketService.setupSocketConnection(this.roomName);
    this.hasJoined = true;
    this.startListening();
    this.convertedText = [];
    this.isCCShowing = false;
    this.watsonChatbot();
    this.fetchAllQuestions();
  }


  // Share Screen Feature
  public shareScreen(): void {
    this.isSharingScreen = true;
    const video = document.getElementById(this.streamId);
    this.connection.addStream({
      screen: true
    });
  }

  // Drop call
  public leaveRoom(): void {
    this.hasJoined = false;
    // disconnect with all users
    this.connection.getAllParticipants().forEach(pid => {
      this.connection.disconnectWith(pid);
    });
    // stop all local cameras
    this.connection.attachStreams.forEach(localStream => {
      localStream.stop();
    });
    // close socket.io connection
    this.connection.closeSocket();
    // remove item on leave
    this.stopListening();
    this.removeWatsonChatbot();
    this.showQuestion = false;
    this.currentQuestionIndex = -1;
    if (this.initialQuestionTimeout) {
      clearTimeout(this.initialQuestionTimeout);
    }
    if (this.nextQuestionInterval) {
      clearInterval(this.nextQuestionInterval);
    }
    if (this.answerTimeout) {
      clearTimeout(this.answerTimeout);
    }
    if (this.answerCheckTimeout) {
      clearTimeout(this.answerCheckTimeout);
    }
  }

  /**
   * Load Watson Assistant Chat
   */
  public loadNextScript() {
    const script = this.renderer2.createElement('script');
    script.text = `
    window.loadWatsonAssistantChat({
        integrationID: 'e9126565-d03b-437d-9d6e-05a5234e8d0e',
        region: 'eu-gb',
        serviceInstanceID: '0afa34f4-3756-4970-a741-93c1222c749c',
    }).then(function (instance) {
        instance.render();
    });`;
    this.renderer2.appendChild(this.document.body, script);
  }

  /**
   * 
   * @param event 
   * On Streaming add video element
   */
  private onstream(event) {
    event.mediaElement.controls = false;
    // add local video stream
    if (event.type === 'local') {
      const containerDiv = document.createElement('div');
      const nameTag = document.createElement('p');
      const userName = event.extra === undefined ? 'Guest' : event.extra.userName;
      const text = document.createTextNode(`${userName}`);
      nameTag.appendChild(text);
      containerDiv.appendChild(nameTag);

      containerDiv.appendChild(event.mediaElement);
      this.localVideoContainer.nativeElement.appendChild(containerDiv);
    } else if (event.type === 'remote') { // add remote video element
      const containerDiv = document.createElement('div');
      containerDiv.className = 'col-md-5';
      containerDiv.id = 'con' + event.userid;
      const nameTag = document.createElement('p');
      const userName = event.extra === undefined ? 'Guest' : event.extra.userName;
      const text = document.createTextNode(`${userName}`);
      nameTag.appendChild(text);
      containerDiv.appendChild(nameTag);

      containerDiv.appendChild(event.mediaElement);
      this.remoteVideoContainer.nativeElement.appendChild(containerDiv);
    }
  }


  /**
   * 
   * @param event 
   * Remove username label
   */
  private onstreamended(event) {
    const video = document.getElementById(event.streamid);
    if (video && video.parentNode) {
      video.parentNode.removeChild(video);
      document.getElementById('con' + event.userid).remove();
    }
  }

  /**
   * onmessage -> handle message received from remote
   * @param event event info
   */
  private onmessage(event) {
    if (this.isCCShowing && event.data && event.data.text && event.data.remoteLanguageKey) {
      console.log('remote data ---> ', event.data);
      if (this.languageList[this.sourceLanguageKey].key === this.languageList[this.targetLanguageKey].key) {
        this.convertedText.push(event.data.text);
      } else {
        this.complaintsService.convertText(event.data.text,
           this.languageList[this.sourceLanguageKey].textTranslateKey, this.languageList[this.targetLanguageKey].textTranslateKey)
        .subscribe((result: any) => {
          this.convertedText.push(JSON.parse(result.msg).translations[0].translation);
          this.changeDetector.detectChanges();
        });
      }
    }
  }

  /**
   * On Mute
   * TODO - This will be implemented later
   */
  goOnMute() {
    this.connection.onmute = function (event) {
      console.log(event.userid);
    };
  }

  /*************************** Speect To Text Section *********************************** */
  public changeLanguage() {
    this.convertedText = [];
  }


  // start Listening to words
  public startListening() {
    try {
      this.listener = new SpeechToText(
        this.onFinalised,
        this.onEndEvent,
        this.onAnythingSaid,
        this.languageList[this.sourceLanguageKey].speechToTextKey,
      );
      this.listener.startListening();
      this.listening = true;
    } catch (err) {
      console.log(err);
    }
  }


  public onFinalised = (text: string) => {
    console.log('onFinalised fired ->', text);
    if (this.languageList[this.sourceLanguageKey].key === this.languageList[this.targetLanguageKey].key) {
      this.convertedText.push(text);
    } else {
      this.convertText(text);
    }
    this.connection.send({
      remoteLanguageKey: this.languageList[this.sourceLanguageKey].key,
      text,
    });
    this.changeDetector.detectChanges();
  }

  // On anything said
  public onAnythingSaid = (text: string) => {
    // this.changeDetector.detectChanges();
  }

  // on end event
  public onEndEvent = () => {
    if (this.listening) {
      this.startListening();
    }
  }

  // stop listening
  public stopListening = () => {
    console.log('stopListening fired ->');
    this.listener.stopListening();
    this.listening = false;
    this.changeDetector.detectChanges();
  }

  // convert text
  private convertText(text: string) {
    this.complaintsService.convertText(text, this.languageList[this.sourceLanguageKey].textTranslateKey, this.languageList[this.targetLanguageKey].textTranslateKey)
      .subscribe((result: any) => {
        this.convertedText.push(JSON.parse(result.msg).translations[0].translation);
        this.changeDetector.detectChanges();
      });
  }

  // sent reminder text to student
  public sendReminderToStudent() {
    const config = {
      ignoreBackdropClick: true,
      keyboard: true,
      class: 'modal-md modal-dialog-centered'
    };
    this.sendReminderPopup = this.modalServicePopup.show(SendReminderPopupComponent, config);
  }

  // Open complaint box
  public openComplaintBox(): void {
    const config = {
      ignoreBackdropClick: true,
      keyboard: true,
      class: 'modal-md modal-dialog-centered'
    };
    this.complaintPopup = this.modalServicePopup.show(CreateComplaintPopupComponent, config);
  }

  // Navigate to admin
  public goToAdmin() {
    if (this.hasJoined) {
      this.leaveRoom();
    }
    this.route.navigate(['/admin']);
  }

  // Go to slack
  public goToSlack() {
    var win = window.open('https://app.slack.com/client/TAHDYCZ6H/D017PLAURJL', '_blank');
    win.focus();
  }

  /*************************** Speect To Text Section End *********************************** */
  /*************************** Question Section *********************************** */

  private fetchAllQuestions() {
    this.isLoading = true;
    this.commonService.fetchAllComplaints()
      .subscribe((list) => {
        this.questionList = list;
        this.originalQuestionList = JSON.parse(JSON.stringify(list));
        this.isLoading = false;
        this.initialQuestionTimeout = setTimeout(() => {
          this.startQuestionTimer();
        }, initialQuestionTime);
      }, () => {
        this.isLoading = false;
      });
  }

  /**
   * Question Timer
   */
  private startQuestionTimer() {
    this.showNextQuestion();
    this.nextQuestionInterval = setInterval(() => {
      this.showNextQuestion();
    }, nextQuestionTime);
  }

  /**
   * Show Next Question
   */
  public showNextQuestion() {
    this.currentQuestionIndex++;
    this.selectedAnswer = '';
    this.showQuestion = true;
    this.answerStatus = AnswerStatus.Pending;
    this.answerTimeout = setTimeout(() => {
      this.submit(false);
    }, answerTime);
    if (this.currentQuestionIndex + 1 >= this.questionList.length) {
      if (this.nextQuestionInterval) {
        clearInterval(this.nextQuestionInterval);
      }
    }
  }

  /**
   * 
   * @param submitted must be a boolean value
   * Submit your answer
   */

  public submit(submitted: boolean) {
    if (submitted && this.selectedAnswer) {
      if (this.selectedAnswer.toString() === this.questionList[this.currentQuestionIndex].rightAnswer.toString()) {
        this.answerStatus = AnswerStatus.Right;
      } else if (this.selectedAnswer.toString() !== this.questionList[this.currentQuestionIndex].rightAnswer.toString()) {
        this.answerStatus = AnswerStatus.Wrong;
      }
    } else {
      this.answerStatus = AnswerStatus.Timeout;
    }
    if (this.answerTimeout) {
      clearTimeout(this.answerTimeout);
    }
    this.answerCheckTimeout = setTimeout(() => {
      this.showQuestion = false;
    }, answerCheckTime);
  }

  /**
   * Close Question
   */
  public closeQuestion() {
    this.showQuestion = false;
    if (this.answerCheckTimeout) {
      clearTimeout(this.answerCheckTimeout);
    }
  }
  /*************************** Question Section End ************************************/

}
