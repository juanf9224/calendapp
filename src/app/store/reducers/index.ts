import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store';
import * as fromCalendar from './calendar.reducer';

export interface State {
  calendar: fromCalendar.CalendarState;
}

export const reducers: ActionReducerMap<State> = {
  calendar: fromCalendar.reducer
};

export const selectCalendarFeature = createFeatureSelector<fromCalendar.CalendarState>('calendar');

export const selectCalendarIds = createSelector(
  selectCalendarFeature,
  fromCalendar.selectCalendarIds
);
export const selectCalendarEntities = createSelector(
  selectCalendarFeature,
  fromCalendar.selectCalendarEntities
);
export const selectAllCalendars = createSelector(
  selectCalendarFeature,
  fromCalendar.selectAllCalendars
);
export const selectCalendarTotal = createSelector(
  selectCalendarFeature,
  fromCalendar.selectCalendarsTotal
);
export const selectCurrentCalendarId = createSelector(
  selectCalendarFeature,
  fromCalendar.getSelectedCalendarId
);

export const selectCurrentCalendar = createSelector(
  selectCalendarEntities,
  selectCurrentCalendarId,
  (calendarEntities, calendarId) => calendarEntities[calendarId]
);
