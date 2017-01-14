import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AccountService } from './account.service';
import { RegisterModel } from './register.model';
import { SettingsService } from '../common/settings.service';
import { MediatorService, Message, MessageType } from '../common/mediator.service';

@Component({
  moduleId: module.id,
  selector: 'my-account',
  templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {
  public newAccount: boolean;

  public title: string;
  public email: string;
  public password: string;
  public confirmPassword: string;
  public firstName: string;
  public middleName: string;
  public lastName: string;

  constructor(
    private _accountService: AccountService, 
    private _router: Router,
    private _route: ActivatedRoute,
    private _settingsService: SettingsService,
    private _mediator: MediatorService) {
  }

  public ngOnInit(): void {
    let uploadUrl = this._settingsService.settings['apiUrl'] + 'account/avatar';

    this.title = this._route.snapshot.data['title'];
    this.newAccount = this._route.snapshot.data['newAccount'];
  
    if (!this.newAccount) {
      this.loadAccount();
    }
  }

  public imageSelected(file: string): void {
  }

  public save(): void {
    if (this.newAccount) {
      this.register();
    } else {
      this.update();
    }
  }

  private register(): void {
    let data = new RegisterModel();
    data.Email = this.email;
    data.Password = this.password;
    data.ConfirmPassword = this.confirmPassword;
    data.FirstName = this.firstName;
    data.MiddleName = this.middleName;
    data.LastName = this.lastName;

    this._accountService.register(data)
      .then(() => {
        this._mediator.broadcast(new Message(MessageType.ShowSuccess, 'Your account has been created. Please login.'));
        this._router.navigate(['/login']);
      });
  }

  private update(): void {
    let data = new RegisterModel();
    data.FirstName = this.firstName;
    data.MiddleName = this.middleName;
    data.LastName = this.lastName;

    this._accountService.update(data)
      .then(() => {
        this._mediator.broadcast(new Message(MessageType.ShowSuccess, 'Your account has been updated.'));
      });
  }

  private loadAccount(): void {
    this._accountService.getAccountInfo()
      .then((res) => {
        this.email = res.Email;
        this.firstName = res.FirstName;
        this.middleName = res.MiddleName;
        this.lastName = res.LastName;
      });  
  }
}