import { Component, OnInit, Input } from '@angular/core';
import { CalendarDate } from 'src/app/shared/model/calendar-date.model';
import { ReminderService } from 'src/app/shared/service/reminder.service';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import * as fromCalendar from '../../store/reducers/calendar.reducer';
import * as calendarActions from '../../store/actions/calendar.actions';

import { IReminder } from 'src/app/shared/model/reminder.model';
import { ReminderDialogComponent } from '../reminder-dialog.component';
import { CalendarDateExpandedDialogComponent } from './calendar-date-expanded-dialog.component';

@Component({
  selector: 'app-calendar-date',
  template: `
  <div class="calendar-date cols-7">
  <div class="row">
  <div class="col-md-6 float-left pl-0">
    <span class="calendar-day">{{day.date.date()}}</span>
  </div>
  <div class="col-md-6 float-right pr-0">
    <mat-icon class="expand-btn" (click)="openCalendarDialog()" matTooltip="Expand this date">fullscreen</mat-icon>
  </div>
  </div>
  <div class="row">
    <div class="reminder-badge"
         *ngFor="let rem of day.reminder" (click)="editReminderDialog(rem)">
      <mat-icon [style.color]="rem?.color"
                [matTooltip]="rem?.description">alarm</mat-icon>
    </div>
  </div>
  </div>
  `,
  styleUrls: ['./calendar-date.component.scss']
})
export class CalendarDateComponent implements OnInit {
  @Input()
  day: CalendarDate;
  @Input()
  calendar: CalendarDate[];

  constructor(
    private store: Store<fromCalendar.CalendarState>,
    private reminderService: ReminderService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  editReminderDialog(rem: IReminder): void {
    const dialogRef = this.dialog.open(ReminderDialogComponent, {
      width: '400px',
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

  openCalendarDialog() {
    const dialogRef = this.dialog.open(CalendarDateExpandedDialogComponent, {
      width: '50%',
      data: { day: this.day, calendar: this.calendar }
    });
  }

}
