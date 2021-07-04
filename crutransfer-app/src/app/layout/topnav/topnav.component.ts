import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, AuthService, LangService, Language } from '@cru-transfer/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
})
export class TopnavComponent implements OnInit, OnDestroy {
  adminRoot = environment.adminRoot;
  subscription: Subscription;
  displayName = 'Sarah Cortney';
  languages: Language[];
  currentLanguage: string;
  isSingleLang;

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService,
    private langService: LangService
  ) {
    this.languages = this.langService.supportedLanguages;
    this.currentLanguage = this.langService.languageShorthand;
    this.isSingleLang = this.langService.isSingleLang;
  }


  onLanguageChange(lang): void {
    this.langService.language = lang.code;
    this.currentLanguage = this.langService.languageShorthand;
  }

  ngOnInit(): void {
    const currentUser = this.authService.getUser();
    if (currentUser) {
      this.displayName = currentUser.username;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



  onSignOut(): void {
    this.apiService.signOut().subscribe(() => {
      this.router.navigate(['/']);
    });
  }



}
