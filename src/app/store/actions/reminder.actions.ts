import {createAction, props} from '@ngrx/store';
import {IReminder} from '../../shared/model/reminder.model';

export const addReminder = createAction('[CalendarDate] Add Reminder', props<{reminder: IReminder}>());
export const updateReminder = createAction('[CalendarDate] Edit Reminder', props<{reminder: IReminder}>());
export const removeReminder = createAction('[CalendarDate] Remove Reminder', props<{reminderId: number}>());
export const removeAllReminders = createAction('[CalendarDate] Remove All Reminders');

