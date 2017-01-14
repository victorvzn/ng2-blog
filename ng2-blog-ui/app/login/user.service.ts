import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { SettingsService } from '../common/settings.service';
import { MediatorService, Message, MessageType } from '../common/mediator.service'

@Injectable()
export class UserService {
  constructor(private http: Http,
    private _settingsService: SettingsService,
    private _mediator: MediatorService) {
  }

  /**
   * Requests a new auth token for the given credentials
   * and stores it for future api calls.
   */
  public login(email: string, password: string): Promise<void> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-utlencoded');
    headers.append('Accept', 'application/json');

    let tokenUrl: string = this._settingsService.settings['tokenUrl'];
    let tokenRequest = (new TokenRequest(email, password)).toUrlEncoded();

    this._mediator.broadcast(new Message(MessageType.BusyStart));
    return this.http.post(tokenUrl, tokenRequest, { headers })
      .toPromise()
      .then((res) => {
        this._mediator.broadcast(new Message(MessageType.BusyEnd));
        var data = res.json();
        var userSession = new UserSession();
        userSession.token = data.access_token;
        userSession.userName = data.userName;
        userSession.issueDate = new Date(data[".issued"]);
        userSession.expireDate = new Date(data[".expire"]);
      })
  }

  /**
   * Gets the username of the current logged user
   */
  public getLoggedUser(): string {
    var userSession = this.getUserSession();
    if (userSession != null) {
      return userSession.userName;
    }
    return null;
  }

  /**
   * Indicates wheather the current user has logged in
   */
  public isLoggedIn(): boolean {
    var userSession = this.getUserSession();
    if (userSession != null) {
      var now = new Date();
      return userSession.expireDate > now;
    } else {
      return false;
    }
  }

  /**
   * Generates headers with necessary authorization to call the api
   */
  public getHeaders(): Headers {
   let headers = new Headers();
   let authorization: string = this.getAuthToken();

   headers.append('Content-Type', 'application/json');
   headers.append('Accept', 'application/json');
   headers.append('Authorization', authorization);
   return headers;
  }

  private getUserSession(): any {
  }

  private getAuthToken(): any {
  }
}

class TokenRequest {
  constructor(email: string, password: string) {
  }

  public toUrlEncoded():void {
  }
}

class UserSession {
  public token: string;
  public userName: string;
  public issueDate: Date;
  public expireDate: Date;

  constructor() {
  }
}