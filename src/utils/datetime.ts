import { format, parseISO } from 'date-fns'

/** Convert ISO string to value for <input type="datetime-local" /> */
export function toDateTimeLocalValue(iso: string): string {
  return format(parseISO(iso), "yyyy-MM-dd'T'HH:mm")
}

/** Convert datetime-local value to ISO string */
export function fromDateTimeLocalValue(value: string): string {
  return new Date(value).toISOString()
}
