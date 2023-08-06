export function range(start: number, end: number): Array<number> {
  let result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

export function timeToDate(time: number) : string {
  const date = new Date(time*1000);
  const options: Record<string, unknown> = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}
