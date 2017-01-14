import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './user.service';

@Component({
  moduleId: module.id,
  selector: 'my-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  public email: string;
  public password: string;

  constructor(private _userService: UserService, private _router: Router) {
  }

  public ngOnInit(): void {
    if (this._userService.isLoggedIn()) {
      this._router.navigate(['/posts']);
    }
  }

  public login(): void {
    this._userService.login(this.email, this.password)
      .then(() => {
        this._router.navigate(['/posts']);
      });
  }
}