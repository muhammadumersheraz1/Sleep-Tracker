import { addDays, setHours, setMinutes, startOfDay, subDays } from 'date-fns'
import type { SleepSession } from '../types'

function at(day: Date, hour: number, minute = 0): string {
  return setMinutes(setHours(startOfDay(day), hour), minute).toISOString()
}

function id(suffix: string) {
  return `demo-${suffix}`
}

/** Realistic multi-day sample sessions for charts and totals testing. */
export function createDemoSessions(now = new Date()): SleepSession[] {
  const today = startOfDay(now)

  const sessions: SleepSession[] = [
    {
      id: id('1'),
      sleepAt: at(subDays(today, 9), 23, 10),
      wakeAt: at(subDays(today, 8), 6, 45),
      note: 'Solid night, cool room',
    },
    {
      id: id('2'),
      sleepAt: at(subDays(today, 8), 14, 0),
      wakeAt: at(subDays(today, 8), 14, 40),
      note: 'Short afternoon nap',
    },
    {
      id: id('3'),
      sleepAt: at(subDays(today, 7), 0, 20),
      wakeAt: at(subDays(today, 7), 7, 5),
      note: 'Went to bed late',
    },
    {
      id: id('4'),
      sleepAt: at(subDays(today, 6), 22, 50),
      wakeAt: at(subDays(today, 5), 5, 30),
      note: 'Woke early for alarm',
    },
    {
      id: id('5'),
      sleepAt: at(subDays(today, 5), 6, 10),
      wakeAt: at(subDays(today, 5), 7, 0),
      note: 'Second sleep after early wake',
    },
    {
      id: id('6'),
      sleepAt: at(subDays(today, 4), 23, 40),
      wakeAt: at(subDays(today, 3), 7, 20),
      note: 'Felt rested',
    },
    {
      id: id('7'),
      sleepAt: at(subDays(today, 3), 1, 15),
      wakeAt: at(subDays(today, 3), 8, 0),
      note: 'Restless first hour',
    },
    {
      id: id('8'),
      sleepAt: at(subDays(today, 2), 22, 30),
      wakeAt: at(subDays(today, 1), 3, 10),
      note: 'Woke mid-night',
    },
    {
      id: id('9'),
      sleepAt: at(subDays(today, 1), 3, 45),
      wakeAt: at(subDays(today, 1), 7, 30),
      note: 'Back to sleep until morning',
    },
    {
      id: id('10'),
      sleepAt: at(subDays(today, 1), 13, 20),
      wakeAt: at(subDays(today, 1), 14, 5),
      note: 'Power nap',
    },
    {
      id: id('11'),
      sleepAt: at(today, 0, 5),
      wakeAt: at(today, 6, 50),
      note: 'Demo overnight sleep',
    },
    {
      id: id('12'),
      sleepAt: at(addDays(today, 0), 15, 0),
      wakeAt: at(addDays(today, 0), 15, 25),
      note: 'Quick nap today',
    },
  ]

  return sessions.sort(
    (a, b) => new Date(b.sleepAt).getTime() - new Date(a.sleepAt).getTime(),
  )
}
