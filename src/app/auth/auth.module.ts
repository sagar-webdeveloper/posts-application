import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';


import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { AngularMaterialModule } from "../angular-material.module";
import { AuthRoutingModule } from "./auth-routing.module";
import {RecaptchaModule} from "ng-recaptcha";

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [CommonModule,
    ReactiveFormsModule, 
    AngularMaterialModule, 
    AuthRoutingModule,
    RecaptchaModule,
    MatPasswordStrengthModule.forRoot()]
})
export class AuthModule {}
