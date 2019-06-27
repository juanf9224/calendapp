import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import {select, Store} from '@ngrx/store';

import {CalendarDate} from '../shared/model/calendar-date.model';
import * as fromCalendar from '../store/reducers/calendar.reducer';
import * as calendarActions from '../store/actions/calendar.actions';
import {MatDialog} from '@angular/material';
import {ReminderDialogComponent} from './reminder-dialog.component';
import {IReminder, Reminder} from '../shared/model/reminder.model';
import {ReminderService} from '../shared/service/reminder.service';
import {WeatherService} from '../provider/weather/weather.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  currentDate = moment();
  days = moment.weekdays();
  calendar: CalendarDate[] = [];
  reminder: IReminder = new Reminder();
  constructor(
    private store: Store<fromCalendar.CalendarState>,
    private reminderService: ReminderService,
    private dialog: MatDialog,
    private weatherService: WeatherService
  ) { }

  // Load calendar dates from store if available, else generate the calendar dates
  ngOnInit() {
    this.store.pipe(select('calendar')).subscribe((c: fromCalendar.CalendarState) => {
      // console.log(c);
      if (c && c.ids.length > 0) {
        const cal = [];
        c.ids.forEach( i => cal.push(c.entities[i.toString()]));
        this.calendar = cal;
      } else {
        this.generateCalendar();
      }
      // console.log('calendar: ', this.calendar);
    });
  }

  // Generate calendar
  generateCalendar() {
    const dates = this.fillDates(this.currentDate);
    this.store.dispatch(calendarActions.renderCalendar({ dates }));
  }

  // generate dates range to populate the calendar with actual month dates
  fillDates(currDate: moment.Moment): CalendarDate[] {
    const firstDayOfMonth = moment(currDate).startOf('month').days();
    const firstDayOfGrid = moment(currDate).startOf('month').subtract(firstDayOfMonth, 'days');
    const start = firstDayOfGrid.date();
    return _.range(start, start + 42)
      .map((date: number, idx: number): CalendarDate => {
          const d = moment(firstDayOfGrid).date(date);
          return {
            id: idx,
            date: d
          };
      });
  }

  // Opens dialog to add reminder
  openReminderDialog(): void {
    const dialogRef = this.dialog.open(ReminderDialogComponent, {
      width: '450px',
      disableClose: true
    });

    // After dialog closes, if reminder was created, then update calendar
    dialogRef.afterClosed()
    .subscribe(() => {
        const reminder = Object.assign(new Reminder(), this.reminderService.reminder);

        if (reminder && reminder.date) {
          // console.log('reminder ', reminder.date);
          const date = Object.assign({}, this.calendar
            .find(c => c && c.date.month() === moment(reminder.date).month() && c.date.date() === moment(reminder.date).date()));

          if (reminder && date && date.reminder) {
            reminder.id = date.reminder.length;
            date.reminder.push(reminder);
          } else if (reminder && date) {
            // console.log('no reminders for this date', reminder);
            reminder.id = 0;
            date.reminder = [reminder];
          } else {
            return;
          }
          console.log('date: ', date);
          this.store.dispatch(calendarActions.addReminderToCalendar(date));
        }
    });
  }

  editReminderDialog(rem: IReminder): void {
    const dialogRef = this.dialog.open(ReminderDialogComponent, {
      width: '450px',
      data: rem,
      disableClose: true
    });

    // After dialog closes, if reminder was edited, then update calendar
    dialogRef.afterClosed().subscribe(() => {
      const reminder = this.reminderService.reminder;
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
    });
  }
}
