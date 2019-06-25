import {createAction, props} from '@ngrx/store';
import {IReminder} from '../../shared/model/reminder.model';
import {CalendarDate} from '../../shared/model/calendar-date.model';

export const renderCalendar = createAction('[CalendarDate] Render Calendar', props<{ dates: CalendarDate[]}>());
export const addReminderToCalendar = createAction('[CalendarDate] Add Reminder', props<CalendarDate>());
