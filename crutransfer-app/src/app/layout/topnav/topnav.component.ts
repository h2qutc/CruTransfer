import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApiService,
  AuthService, IUser,
  LangService,
  Language
} from '@cru-transfer/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
})
export class TopnavComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  languages: Language[];
  currentLanguage: string;
  isSingleLang;

  user: IUser;

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService,
    private langService: LangService,
    private cd: ChangeDetectorRef
  ) {
    this.languages = this.langService.supportedLanguages;
    this.currentLanguage = this.langService.languageShorthand;
    this.isSingleLang = this.langService.isSingleLang;
  }

  onLanguageChange(lang): void {
    this.langService.language = lang.code;
    this.currentLanguage = this.langService.languageShorthand;
  }

  async ngOnInit() {
    this.user = this.authService.user;
    this.authService.user$.subscribe((data) => {
      this.user = data;
      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSignOut(): void {
    this.authService.signOut();
    this.apiService.signOut().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

}
