import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { startWith, map, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { WindowTypes } from '../model';


const QUERY: Map<string, string> = new Map([
  [WindowTypes.DESKTOP, '(min-width: 1200px)'],
  [WindowTypes.LAPTOP, '(min-width: 992px)'],
  [WindowTypes.TABLETS, '(min-width: 768px)'],
  [WindowTypes.LARGE_PHONE, '(min-width: 600px)'],
  [WindowTypes.PHONE, '(max-width: 600px)'],
]);

@Injectable({
  providedIn: 'root'
})
export class BreakpointObserverService {
  private _size$: Observable<string>;

  constructor() {
    this._size$ = fromEvent(window, 'resize')
      .pipe(
        startWith(this._getScreenSize()),
        map((event: Event) => {
          return this._getScreenSize();
        }),
        distinctUntilChanged(),
        shareReplay(1)
      )
  }

  public get size$(): Observable<string> {
    return this._size$;
  }

  private _getScreenSize(): string {
    const [[newSize = 'never']] = Array.from(QUERY.entries())
      .filter(([size, mediaQuery]) => window.matchMedia(mediaQuery).matches);
    return newSize;
  }
}
