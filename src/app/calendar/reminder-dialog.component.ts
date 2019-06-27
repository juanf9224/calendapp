import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {IReminder, Reminder} from '../shared/model/reminder.model';
import * as moment from 'moment';
import {ReminderService} from '../shared/service/reminder.service';
import {WeatherService} from '../provider/weather/weather.service';

@Component({
  selector: 'app-reminder-dialog',
  templateUrl: 'reminder-dialog.component.html',
  styleUrls: ['reminder-dialog.component.scss']
})
export class ReminderDialogComponent implements OnInit {
  currentDate = new Date();
  forecast: any;
  reminderData: IReminder;

  constructor(
    public dialogRef: MatDialogRef<ReminderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IReminder,
    private reminderService: ReminderService,
    private snackBar: MatSnackBar,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.city) {
      this.reminderData = Object.assign({}, this.data);
      this.weatherService.fetchWeatherForeCast(this.reminderData.city)
        .subscribe(w => this.lookupForecast(w.body.list, this.reminderData.date || moment()));
    } else {
      this.reminderData = new Reminder();
    }
  }

  private lookupForecast(list: any[], date: moment.Moment) {
    this.forecast = list.find(f => this.isSameDate(moment(f.dt_txt), date)).weather[0];
  }

  onAddClick(reminder: IReminder): void {
    console.log('reminder from output', reminder);
    if (reminder && reminder.date) {
      const hours = parseInt(`${reminder.time}`.substring(0, reminder.time.indexOf(':')), 10);
      const minutes = parseInt(`${reminder.time}`.substring(reminder.time.indexOf(':'), reminder.time.length), 10);
      // reminder.date = moment(`${reminder.date}`).add(hours, 'hours').add(minutes, 'minutes');
      const reminderDatetime = this.createDateTime(reminder, hours, minutes);
      console.log('rem date vs moment: ', reminderDatetime, moment());
      if (moment(reminderDatetime).isSameOrAfter(moment())) {
        this.reminderService.reminder = this.reminderData;
        this.dialogRef.close();
      } else {
        this.handleError(`
          Could not create reminder, date should not be a past date time:
          actual: ${moment()} reminder: ${reminderDatetime}`);
      }
    }
  }

  private createDateTime(rem: IReminder, hours: number, minutes: number): moment.Moment {
    const reminderDateTime: moment.Moment = moment(rem.date);
    console.log('reminderDateTime', reminderDateTime);
    return moment(reminderDateTime).hour(hours).minutes(minutes);
  }

  clearReminder(): void {
    this.reminderService.reminder = null;
  }

  private handleError(msg: string, action?: string, waitTime?: number) {
    this.snackBar
      .open(msg,
        action || 'Ok', {duration: waitTime || 4000});
  }

  private isSameDate(a: moment.Moment, b: moment.Moment): boolean {
      return moment(a).month() === moment(b).month() && moment(a).date() === moment(b).date();
  }
}
