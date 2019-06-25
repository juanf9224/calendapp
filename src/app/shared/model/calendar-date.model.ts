import * as moment from 'moment';
import {IReminder} from './reminder.model';

export interface CalendarDate {
  id?: number;
  date?: moment.Moment;
  reminder?: IReminder[];
}
