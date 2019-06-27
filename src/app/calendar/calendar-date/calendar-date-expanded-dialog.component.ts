import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatDialog, MatDialogConfig} from '@angular/material';
import {IReminder, Reminder} from '../../shared/model/reminder.model';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';

import { CalendarDate } from 'src/app/shared/model/calendar-date.model';
import {DAY_TIME, BULK_CITIES} from '../../shared/constants';
import {ReminderService} from '../../shared/service/reminder.service';
import {WeatherService} from '../../provider/weather/weather.service';
import { ReminderDialogComponent } from '../reminder-dialog.component';
import * as fromCalendar from '../../store/reducers/calendar.reducer';
import * as calendarActions from '../../store/actions/calendar.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-reminder-dialog',
  templateUrl: 'calendar-date-expanded-dialog.component.html',
  styleUrls: ['calendar-date-expanded-dialog.component.scss']
})
export class CalendarDateExpandedDialogComponent implements OnInit {
  dayTime = DAY_TIME;
  currentDate = moment();
  forecast: any;
  selectedCalendarDate: string;
  filteredOptions: Observable<string[]>;
  reminders: IReminder[];
  expanded = false;
  calendar: CalendarDate[];
  day: CalendarDate;

  constructor(
    public dialogRef: MatDialogRef<CalendarDateExpandedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {day: CalendarDate, calendar: CalendarDate[]},
    private reminderService: ReminderService,
    private weatherService: WeatherService,
    private store: Store<fromCalendar.CalendarState>,
  ) {}

  ngOnInit(): void {
    this.day = this.data.day;
    this.calendar = this.data.calendar;
    this.selectedCalendarDate = `${this.day.date.month()}-${this.day.date.date()}-${this.day.date.year()}`;
    console.log(this.data);
    if (this.day && this.day.reminder && this.day.reminder.length > 0) {
      this.reminders = Object.assign([], this.day.reminder);
    } else {
      this.reminders = [];
      console.log(this.reminders);
    }
  }

  fetchForecast(reminder: IReminder) {
    this.weatherService.fetchWeatherForeCast(reminder.city)
    .subscribe(w => this.lookupForecast(w.body.list, reminder.date || moment()));
  }

  private lookupForecast(list: any[], date: moment.Moment) {
    this.forecast = list.find(f => this.isSameDate(moment(f.dt_txt), date)).weather[0];
    console.log(this.forecast);
  }

  updateReminder(rem: IReminder): void {
      const reminder = rem;
      if (reminder && reminder.date) {
        const date = this.calendar.find(c => c.date.isSame(reminder.date));

        if (date) {
          const remi = date.reminder.find(r => r.id === reminder.id);
          remi.date = moment(reminder.date).isSame(remi.date) ? remi.date : reminder.date;
          remi.time = reminder.time === remi.time ? remi.time : reminder.time;
          remi.color = reminder.color === remi.color ? remi.color : reminder.color;
          remi.city = reminder.city === remi.city ? remi.city : reminder.city;
          remi.description = reminder.description === remi.description ? remi.description : reminder.description;
        } else {
          return;
        }
        console.log('date and reminder: ', date, reminder);
        this.store.dispatch(calendarActions.addReminderToCalendar(date));
      }
  }

  clearReminder(): void {
    this.reminderService.reminder = null;
  }

  private isSameDate(a: moment.Moment, b: moment.Moment): boolean {
      return moment(a).month() === moment(b).month() && moment(a).date() === moment(b).date();
  }
}
