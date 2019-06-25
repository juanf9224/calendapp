import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store';
import * as fromReminder from './reminder.reducer';
import * as fromCalendar from './calendar.reducer';

export interface State {
  calendar: fromCalendar.CalendarState;
  reminders: fromReminder.ReminderState;
}

export const reducers: ActionReducerMap<State> = {
  calendar: fromCalendar.reducer,
  reminders: fromReminder.reducer
};

export const selectReminderState = createFeatureSelector<fromReminder.ReminderState>('reminders');

export const selectCalendarState = createFeatureSelector<fromCalendar.CalendarState>('calendar');

export const selectReminderIds = createSelector(
  selectReminderState,
  fromReminder.selectReminderIds
);
export const selectReminderEntities = createSelector(
  selectReminderState,
  fromReminder.selectReminderEntities
);
export const selectAllReminders = createSelector(
  selectReminderState,
  fromReminder.selectAllReminders
);
export const selectReminderTotal = createSelector(
  selectReminderState,
  fromReminder.selectRemindersTotal
);
export const selectCurrentReminderId = createSelector(
  selectReminderState,
  fromReminder.getSelectedReminderId
);

export const selectCurrentReminder = createSelector(
  selectReminderEntities,
  selectCurrentReminderId,
  (reminderEntities, reminderId) => reminderEntities[reminderId]
);

export const selectCalendar = createSelector(
  selectCalendarState,
  fromCalendar.selectAllCalendars
);
export const selectCalendarIds = createSelector(
  selectCalendarState,
  fromCalendar.selectCalendarIds
);
export const selectCalendarEntities = createSelector(
  selectCalendarState,
  fromCalendar.selectCalendarEntities
);
export const selectAllCalendars = createSelector(
  selectCalendarState,
  fromCalendar.selectAllCalendars
);
export const selectCalendarTotal = createSelector(
  selectCalendarState,
  fromCalendar.selectCalendarsTotal
);
export const selectCurrentCalendarId = createSelector(
  selectCalendarState,
  fromCalendar.getSelectedCalendarId
);

export const selectFirstCalendar = createSelector(
  selectCalendarState,
  fromCalendar.getFirstCalendar
);

export const selectCurrentCalendar = createSelector(
  selectCalendarEntities,
  selectCurrentCalendarId,
  (calendarEntities, calendarId) => calendarEntities[calendarId]
);
