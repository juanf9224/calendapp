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
    private dialog: MatDialog
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
    // console.log(dates.slice());
    this.store.dispatch(calendarActions.renderCalendar({ dates }));
  }

  // generate dates range to populate the calendar with actual month dates
  fillDates(currDate: moment.Moment): CalendarDate[] {
    const firstDayOfMonth = moment(currDate).startOf('month').day();
    const firstDayOrfGrid = moment(currDate).startOf('month').subtract(firstDayOfMonth, 'days');
    const start = firstDayOrfGrid.date();
    return _.range(start, start + 42)
      .map((date: number, idx: number): CalendarDate => {
          const d = moment(firstDayOrfGrid).date(date);
          return {
            id: idx,
            date: d
          };
      });
  }

  // Opens dialog to add reminder
  openReminderDialog(): void {
    const dialogRef = this.dialog.open(ReminderDialogComponent, {
      width: '300px',
      data: new Reminder()
    });

    // After dialog closes, if reminder was created, then update calendar
    dialogRef.afterClosed().subscribe(() => {
        const reminder = this.reminderService.reminder;
        const date = Object.assign({}, this.calendar.find(c => c.date.isSame(reminder.date)));

        if (reminder && date && date.reminder) {
          reminder.id = date.reminder.length;
          date.reminder.push(reminder);
        } else if (reminder && date) {
          console.log('no reminder');
          reminder.id = 0;
          date.reminder = [reminder];
        } else {
          return;
        }
        this.store.dispatch(calendarActions.addReminderToCalendar(date));
    });
  }

  editReminderDialog(rem: IReminder): void {
    const dialogRef = this.dialog.open(ReminderDialogComponent, {
      width: '300px',
      data: rem
    });

    // After dialog closes, if reminder was edited, then update calendar
    dialogRef.afterClosed().subscribe(() => {
      const reminder = this.reminderService.reminder;
      const date = this.calendar.find(c => c.date.isSame(reminder.date));

      if (date) {
        let remi = date.reminder.find(r => r.id === reminder.id);
        remi = reminder;
      } else {
        return;
      }
      console.log(date);
      this.store.dispatch(calendarActions.addReminderToCalendar(date));
    });
  }
}
