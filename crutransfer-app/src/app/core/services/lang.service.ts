import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { getThemeLang, setThemeLang } from 'src/app/utils/util';
import en from '../../../lang/en-US.json';
import es from '../../../lang/es-ES.json';
import fr from '../../../lang/fr-FR.json';


const languageKey = '__lang';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  isSingleLang = false;
  renderer: Renderer2;
  defaultLanguage = getThemeLang();
  supportedLanguages: Language[] = [
    { code: 'en-US', direction: 'ltr', label: 'English', shorthand: 'en' },
    // { code: 'es-ES', direction: 'ltr', label: 'Español', shorthand: 'es' },
    { code: 'fr-FR', direction: 'ltr', label: 'Français', shorthand: 'fr' },
  ];

  constructor(
    private translate: TranslateService,
    private rendererFactory: RendererFactory2,
    private router: Router
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  init(): void {
    this.translate.setTranslation('en-US', en);
    this.translate.setTranslation('es-ES', es);
    this.translate.setTranslation('en-EN', en);
    this.translate.setTranslation('fr-FR', fr);
    this.translate.setDefaultLang(this.defaultLanguage);
    if (this.isSingleLang) {
      this.translate.use(this.defaultLanguage);
    } else {
      this.language = '';
    }
  }

  checkForDirectionChange(): void {
    this.renderer.removeClass(document.body, 'ltr');
    this.renderer.removeClass(document.body, 'rtl');
    this.renderer.addClass(document.body, this.direction);
    this.renderer.setAttribute(
      document.documentElement,
      'direction',
      this.direction
    );
  }

  set language(lang: string) {
    let language = lang || getThemeLang();
    const isSupportedLanguage = this.supportedLanguages
      .map((item) => item.code)
      .includes(language);
    if (!isSupportedLanguage) {
      language = this.defaultLanguage;
    }

    if (
      lang !== '' &&
      this.supportedLanguages.map((item) => item.code).includes(lang) &&
      this.direction !==
      this.supportedLanguages.find((item) => item.code === lang).direction
    ) {
      setThemeLang(lang);
      window.location.reload();
    } else {
      this.translate.use(language);
    }
    this.checkForDirectionChange();
    setThemeLang(language);
  }

  get language(): string {
    return this.translate.currentLang;
  }

  get languageShorthand(): string {
    return this.supportedLanguages.find(
      (item) => item.code === this.translate.currentLang
    )?.shorthand || 'en';
  }

  get direction(): string {
    return this.supportedLanguages.find(
      (item) => item.code === this.translate.currentLang
    ).direction;
  }

  get languageLabel(): string {
    return this.supportedLanguages.find(
      (item) => item.code === this.translate.currentLang
    ).label;
  }
}

export class Language {
  code: string;
  direction: string;
  label: string;
  shorthand: string;
}
