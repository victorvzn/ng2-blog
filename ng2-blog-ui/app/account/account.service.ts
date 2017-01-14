import { Injectable, Inject }                       from '@angular/core';
import { Headers, Http }                            from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { RegisterModel }                            from './register.model';
import { SettingsService }                          from '../common/settings.service';
import { MediatorService, Message, MessageType }    from '../common/mediator.service';
import { UserService }                              from '../login/user.service';


@Injectable()
export class AccountService {
    private headers = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        private _http: Http,
        private _settingsService: SettingsService,
        private _userSercie: UserService,
        private _mediator: MediatorService) {
    }

    public register(data: RegisterModel): Promise<void> {
        let apiUrl: string = this._settingsService.settings["apiUrl"];
        this._mediator.broadcast(new Message(MessageType.BusyStart)); 

        return this._http.post(apiUrl + "Account/Register", data, { headers: this.headers })
            .toPromise()
            .then(() => {
                this._mediator.broadcast(new Message(MessageType.BusyEnd));
            })
            .catch(error => this.handleError(error, 'registering new account.'));
    }

    public update(data: RegisterModel): Promise<void> {
        let apiUrl: string = this._settingsService.settings["apiUrl"];
        this._mediator.broadcast(new Message(MessageType.BusyStart));

        return this._http.post(apiUrl + "Account/Update", data, { headers: this._userSercie.getHeaders() })
            .toPromise()
            .then(() => {
                this._mediator.broadcast(new Message(MessageType.BusyEnd));
            })
            .catch(error => this.handleError(error, 'updating the account.'));
    }

    public getAccountInfo(): Promise<any> {
        let apiUrl = this._settingsService.settings['apiUrl'];
        this._mediator.broadcast(new Message(MessageType.BusyStart)); 

        return this._http.get(apiUrl + 'account', { headers: this._userSercie.getHeaders() })
            .toPromise()
            .then((res) => {
                this._mediator.broadcast(new Message(MessageType.BusyEnd));
                return res.json();
            })
            .catch(error => this.handleError(error, 'loading recent posts.'));
    }

    private handleError(error: any, operation: string): Promise<any> {
        this._mediator.broadcast(new Message(MessageType.BusyEnd));
        this._mediator.broadcast(new Message(MessageType.ShowError, 'An error occurred while ' + operation));
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}