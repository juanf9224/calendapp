import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {IReminder} from '../shared/model/reminder.model';
import * as moment from 'moment';
import {DAY_TIME} from '../shared/constants/day-time';
import {ReminderService} from '../shared/service/reminder.service';
import {WeatherService} from '../provider/weather/weather.service';

@Component({
  selector: 'app-reminder-dialog',
  templateUrl: 'reminder-dialog.component.html'
})
export class ReminderDialogComponent implements OnInit {
  dayTime = DAY_TIME;
  currentDate = new Date();
  forecast: string;

  constructor(
    public dialogRef: MatDialogRef<ReminderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IReminder,
    private reminderService: ReminderService,
    private snackBar: MatSnackBar,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.city) {
      this.weatherService.getWeatherForeCast(this.data.city)
        .subscribe(w => this.forecast = w.body.weather.main);
    }
  }

  onAddClick(reminder: IReminder): void {
    if (reminder && reminder.date && moment(reminder.date).isSameOrAfter(moment(new Date()))) {
      this.reminderService.reminder = reminder;
      this.dialogRef.close();
    } else {
      this.snackBar.open('Could not create reminder', 'Ok', {duration: 4000});
    }
  }
}
