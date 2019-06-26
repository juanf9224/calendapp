import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {IReminder} from '../shared/model/reminder.model';
import * as moment from 'moment';
import {DAY_TIME} from '../shared/constants/day-time';
import {ReminderService} from '../shared/service/reminder.service';

@Component({
  selector: 'app-reminder-dialog',
  templateUrl: 'reminder-dialog.component.html'
})
export class ReminderDialogComponent {
  dayTime = DAY_TIME;

  constructor(
    public dialogRef: MatDialogRef<ReminderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IReminder,
    private reminderService: ReminderService
  ) {}

  onAddClick(reminder: IReminder): void {
    if (reminder && reminder.date && moment(reminder.date).isSameOrAfter(moment(new Date()))) {
      this.reminderService.reminder = reminder;
      this.dialogRef.close();
    } else {

      // else
    }
  }
}
