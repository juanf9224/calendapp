import * as CalendarActions from '../actions/calendar.actions';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Action, createReducer, on} from '@ngrx/store';
import {CalendarDate} from '../../shared/model/calendar-date.model';

export interface CalendarState extends EntityState<CalendarDate> {
  selectCalendarId: number | null;
}

export const adapter: EntityAdapter<CalendarDate> = createEntityAdapter<CalendarDate>();

const initialState: CalendarState = adapter.getInitialState({
  selectCalendarId: null
});

const calendarDateReducer = createReducer(
  initialState,
  on(CalendarActions.renderCalendar, (state, { dates }  ) => {
    return adapter.addMany(dates , state);
  }),
  on(CalendarActions.addReminderToCalendar, (state: CalendarState, calendarDate: CalendarDate) => {
    return adapter.updateOne({id: calendarDate.id, changes: calendarDate}, state);
  })
);

export function reducer(state: CalendarState | undefined, action: Action) {
  return calendarDateReducer(state, action);
}

export const getSelectedCalendarId = (state: CalendarState) => state.selectCalendarId;

export const getAllCalendarDates = (state: CalendarState) => {
  const calendarDates = [];
  state.ids.forEach((i) => calendarDates.push(state.entities[i.toString]));
  return calendarDates;
};

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();

export const selectCalendarIds = selectIds;

export const selectCalendarEntities = selectEntities;

export const selectAllCalendars = selectAll;

export const selectCalendarsTotal = selectTotal;
