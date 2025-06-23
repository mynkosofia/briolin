import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CategoryService } from '../category.service'; // додайте імпорт
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: any;

  constructor(
    private _flashMessagesService: FlashMessagesService,
    public authService: AuthService,
    public router: Router,
    public categoryService: CategoryService,
    public translate: TranslateService
  ) {
     translate.addLangs(['en', 'uk']);
    translate.setDefaultLang('uk');
  }

   switchLang(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  logoutUser() {
    this.authService.logout();
    this._flashMessagesService.show('You are logged out', {
      cssClass: 'alert-success',
      timeout: 3000
    });
    this.router.navigate(['/auth']);
  }
   onHomeClick() {
   this.categoryService.setCategory('');
  this.categoryService.resetSearch();
  }
}