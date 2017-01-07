import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private _userService: UserService) {
  }

  public canActivate() {
    return this._userService.isLoggedIn();
  }
}