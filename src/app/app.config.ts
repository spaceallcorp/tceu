import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter, withInMemoryScrolling } from "@angular/router";
import { provideAuth0 } from "@auth0/auth0-angular";
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from "./app.routes";
import { HttpClient, provideHttpClient } from "@angular/common/http";
import { TranslateLoader, provideTranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { environment } from "../environments/environment";
import { resolveFirebaseConfig } from "./services/firebase-config.helper";

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
    new TranslateHttpLoader(http, "./i18n/", ".json");

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(
            routes,
            withInMemoryScrolling({
                scrollPositionRestoration: 'enabled', // This makes the page scroll to top on navigation
                anchorScrolling: 'enabled' // Optional: enables anchor scrolling
            })
        ),
        provideHttpClient(),
        provideTranslateService({
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        provideAuth0({
            domain: environment.auth0?.domain || '',
            clientId: environment.auth0?.clientId || '',
            authorizationParams: {
                redirect_uri: typeof window !== 'undefined' ? window.location.origin : ''
            },
        }),
        provideFirebaseApp(() => {
            const config = resolveFirebaseConfig((environment as any).fbPayload ?? (environment as any).firebase);
            const fallback: Record<string, string> = {};
            Object.defineProperty(fallback, 'apiKey', { value: 'dummy-dev-key', enumerable: true });
            return initializeApp(config && Object.keys(config).length > 0 ? config : fallback);
        }),
        provideFirestore(() => getFirestore())
    ],
};