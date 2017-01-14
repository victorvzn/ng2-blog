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
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
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
        
        localStorage.setItem('userSession', JSON.stringify(userSession));  
    })
      .catch(error => {
        this._mediator.broadcast(new Message(MessageType.BusyEnd));
        this._mediator.broadcast(new Message(
          MessageType.ShowError,
          'Login failed. Please check your credentials and try again.'));
        console.error('An error occurred', error);
      });
  }

  /**
   * Cleans up any stored auth token
   */
  public logout() {
    localStorage.removeItem('userSession');
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

  private getAuthToken(): string {
    var userSession = this.getUserSession();
    if (userSession != null) {
      return 'Bearer ' + userSession.token;
    }
    return null;
  }

  private getUserSession(): UserSession {
    var storedValue: string = localStorage.getItem('userSession');
    if (!!storedValue) {            
      return new UserSession(storedValue);
    }
    return null;
  }
}

/**
 * Class that encapsulate logic to generate a request to obtain an api token
 */
class TokenRequest {
    grantType: string;
    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.grantType = "password";
        this.username = username;
        this.password = password;
    }

    public toUrlEncoded(): string {
        return `grant_type=${this.grantType}&username=${this.username}&password=${this.password}`;
    }
}

/**
 * Encapsulates all the necessary data related to a user session
 * Can be constructed out of the api's json response
 */
export class UserSession {
    token: string;
    userName: string;
    issueDate: Date;
    expireDate: Date;

    constructor(jsonString?: string) {
        if (jsonString == null) {
            return;
        }

        var jsonObj = JSON.parse(jsonString);
        this.token = jsonObj.token;
        this.userName = jsonObj.userName;
        this.issueDate = new Date(jsonObj.issueDate);
        this.expireDate = new Date(jsonObj.expireDate);
    }
}