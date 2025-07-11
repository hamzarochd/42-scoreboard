import React from 'react';
import { ExternalLink, Key, Settings, CheckCircle } from 'lucide-react';

export const ApiSetup: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Configurazione API 42 School
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Segui questi passi per collegare l'app all'API ufficiale di 42
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            {/* Step 1 */}
            <div className="mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-medium">
                    1
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Crea un'Applicazione 42 School
                  </h3>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Vai su 42 OAuth Applications</li>
                      <li>Clicca "New Application"</li>
                      <li>Compila i campi richiesti</li>
                      <li>Imposta il Redirect URI correttamente</li>
                    </ol>
                  </div>
                  <div className="mt-4">
                    <a
                      href="https://profile.intra.42.fr/oauth/applications"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Apri 42 OAuth Applications
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration Details */}
            <div className="mb-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Configurazione Applicazione:
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Nome:</span>
                  <span className="text-gray-900 dark:text-white font-mono">42 Scoreboard</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Redirect URI:</span>
                  <span className="text-gray-900 dark:text-white font-mono">http://localhost:5174/auth/callback</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Scopes:</span>
                  <span className="text-gray-900 dark:text-white font-mono">public</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-medium">
                    2
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Copia le Credenziali
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Dopo aver creato l'applicazione, copia il <strong>Client ID</strong> e il <strong>Client Secret</strong>.
                  </p>
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                    <div className="flex">
                      <Key className="h-5 w-5 text-yellow-400" />
                      <div className="ml-3">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <strong>Importante:</strong> Mantieni il Client Secret sicuro e non condividerlo pubblicamente.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-medium">
                    3
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Configura il File .env
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Modifica il file <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">.env</code> nella root del progetto:
                  </p>
                  <div className="mt-4 bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-100">
{`# API Configuration
VITE_USE_REAL_API=true
VITE_42_API_BASE_URL=https://api.intra.42.fr
VITE_42_REDIRECT_URI=http://localhost:5174/auth/callback

# Le tue credenziali (sostituisci con i valori reali)
VITE_42_CLIENT_ID=il_tuo_client_id
VITE_42_CLIENT_SECRET=il_tuo_client_secret`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white text-sm font-medium">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Avvia l'Applicazione
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Una volta configurato tutto, avvia l'app e vedrai il pulsante di login con 42 School.
                  </p>
                  <div className="mt-4 bg-gray-900 rounded-lg p-4">
                    <code className="text-sm text-green-400">npm run dev</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-4">
            📚 Informazioni Aggiuntive
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <li>• L'app supporta sia la modalità sviluppo (mock) che l'API reale</li>
            <li>• I token OAuth vengono gestiti automaticamente con refresh</li>
            <li>• Tutti i dati vengono trasformati per essere compatibili con l'interfaccia</li>
            <li>• In caso di problemi, controlla la console del browser per errori</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
