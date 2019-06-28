import {Component, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import {select, Store} from '@ngrx/store';
import {MatDialog} from '@angular/material';

import {CalendarDate} from '../shared/model/calendar-date.model';
import * as fromCalendar from '../store/reducers/calendar.reducer';
import * as calendarActions from '../store/actions/calendar.actions';
import {ReminderDialogComponent} from './reminder-dialog.component';
import {IReminder, Reminder} from '../shared/model/reminder.model';
import {ReminderService} from '../shared/service/reminder.service';
import {ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  currentDate = moment();
  days = moment.weekdays();
  calendar: CalendarDate[] = [];
  reminder: IReminder = new Reminder();
  unsubscribe$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<fromCalendar.CalendarState>,
    private reminderService: ReminderService,
    private dialog: MatDialog,
  ) { }

  // Load calendar dates from store if available, else generate the calendar dates
  ngOnInit() {
    this.store.pipe(
      takeUntil(this.unsubscribe$),
      select('calendar')
    ).subscribe((c: fromCalendar.CalendarState) => {
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
    .subscribe(() => this.addReminderToCalendar());
  }

  addReminderToCalendar(): void {
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
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
