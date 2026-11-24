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
            // initializeApp throws if the config is incomplete (e.g. when CI secrets are
            // missing). That exception aborts bootstrap and leaves the page blank, so fall
            // back to a fully-formed placeholder config instead of a partial one.
            const required = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
            const isComplete = !!config && required.every((key) => !!config[key]);
            const safeConfig: Record<string, string> = isComplete ? config : {
                apiKey: 'demo-api-key',
                authDomain: 'demo-project.firebaseapp.com',
                projectId: 'demo-project',
                storageBucket: 'demo-project.appspot.com',
                messagingSenderId: '000000000000',
                appId: '1:000000000000:web:0000000000000000000000'
            };
            return initializeApp(safeConfig);
        }),
        provideFirestore(() => getFirestore())
    ],
};