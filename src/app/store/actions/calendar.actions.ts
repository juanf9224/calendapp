import {createAction, props} from '@ngrx/store';
import {ICalendar} from '../../shared/model/calendar';

export const renderCalendar = createAction('[CalendarDate] Render Calendar', props<ICalendar>());
export const getCalendar = createAction('[CalendarDate] Get Calendar');
export const addReminderToCalendar = createAction('[CalendarDate] Add Reminder');
