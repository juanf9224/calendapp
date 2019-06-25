import * as ReminderActions from '../actions/reminder.actions';
import {IReminder} from '../../shared/model/reminder.model';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Action, createReducer, on} from '@ngrx/store';
import * as moment from 'moment';

export interface ReminderState extends EntityState<IReminder> {
  selectReminderId: number | null;
}

const sortByDate = (a: IReminder, b: IReminder) => moment(a.date).isBefore(b.date) ? -1 : 1;

export const adapter: EntityAdapter<IReminder> = createEntityAdapter<IReminder>({
  sortComparer: sortByDate
});

const initialState: ReminderState = adapter.getInitialState({
  selectReminderId: null
});

const reminderReducer = createReducer(
  initialState,
  on(ReminderActions.addReminder, (state, { reminder }) => {
    return adapter.addOne(reminder, state);
  }),
  on(ReminderActions.updateReminder, (state, { reminder }) => {
    return adapter.updateOne({ id: reminder.id, changes: reminder }, state);
  }),
  on(ReminderActions.removeReminder, (state, { reminderId }) => {
    return adapter.removeOne(reminderId, state);
  }),
  on(ReminderActions.removeAllReminders, (state ) => {
    return adapter.removeAll({ ...state, selectedReminderId: null });
  })
);

export function reducer(state: ReminderState | undefined, action: Action) {
  return reminderReducer(state, action);
}

export const getSelectedReminderId = (state: ReminderState) => state.selectReminderId;

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();

export const selectReminderIds = selectIds;

export const selectReminderEntities = selectEntities;

export const selectAllReminders = selectAll;

export const selectRemindersTotal = selectTotal;
