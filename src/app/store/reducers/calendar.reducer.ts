import * as CalendarActions from '../actions/calendar.actions';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Action, createReducer, on} from '@ngrx/store';
import {ICalendar} from '../../shared/model/calendar';

export interface CalendarState extends EntityState<ICalendar> {
  selectCalendarId: number | null;
}

export const adapter: EntityAdapter<ICalendar> = createEntityAdapter<ICalendar>();

const initialState: CalendarState = adapter.getInitialState({
  selectCalendarId: null
});

const calendarDateReducer = createReducer(
  initialState,
  on(CalendarActions.renderCalendar, (state, calendar: ICalendar ) => {
    return adapter.addOne(calendar, state);
  }),
  on(CalendarActions.getCalendar, (state) => {
    return adapter.getSelectors().selectAll[0];
  })
);

export function reducer(state: CalendarState | undefined, action: Action) {
  return calendarDateReducer(state, action);
}

export const getSelectedCalendarId = (state: CalendarState) => state.selectCalendarId;

export const getFirstCalendar = (state: CalendarState) => state.entities['0'].view;

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
