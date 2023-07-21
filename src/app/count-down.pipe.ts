import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countDown'
})
export class CountDownPipe implements PipeTransform {
  transform(value: number | null, ...args: unknown[]): unknown {
    if (!value) {
      return;
    }

    const d = Number(value);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    const mDisplay = m < 10 ? `0${m}` : m;
    const sDisplay = s < 10 ? `0${s}` : s;

    return `${h}:${mDisplay}:${sDisplay}`;
  }
}
