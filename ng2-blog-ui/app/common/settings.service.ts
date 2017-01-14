import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class SettingsService implements Resolve<any> {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private _settings: Object;

  /**
   * Gets an object with the application settings.
   */
  public get settings(): Object {
    return this._settings;
  }

  constructor(private _http: Http) {
    this.load();
  }

  /**
   * Resolves routes by ensuring that configuration is loaded.
   */
  public resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.load();
  }

  private load(): Observable<any> {
    if (this._settings != null) {
      return Observable.of(this._settings);
    }

    return this._http.request('app/settings.json', this.headers)
      .map(obj => {
        let settings = Object.assign(new Object(), obj.json());
        this._settings = settings;
        return settings;
      });
  }
}