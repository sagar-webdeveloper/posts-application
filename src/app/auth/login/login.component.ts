import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.form = new FormGroup({
      email: new FormControl(null, { validators: [Validators.required, Validators.pattern(this.emailPattern)]}),
      password: new FormControl(null, { validators: [Validators.required]}),
      captcha: new FormControl('', { validators: [Validators.required]}),
    });
  }

  resolved(captchaResponse: string) {
    this.form.patchValue({
      captcha:captchaResponse
    })
    console.log("captchaResponse is",captchaResponse);
}

  onLogin() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(this.form.value.email, this.form.value.password,this.form.value.captcha);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
