import { Injectable } from '@nestjs/common';
import { areIntervalsOverlapping, Interval, addMinutes, parseJSON}  from "date-fns";

@Injectable()
export class DateHandlerService {
    getEndTime(startTime: Date, periodInMinutes: number): Date {
        return addMinutes(startTime, periodInMinutes);
    }

    isPeriodsOverlapping(first: Interval, last: Interval): boolean {
        return areIntervalsOverlapping(first, last);
    }
}
