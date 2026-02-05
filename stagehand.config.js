/**
 * Stagehand Configuration for ALMA Finanzas Testing
 */

module.exports = {
    model: 'google/gemini-3-flash-preview',
    env: 'LOCAL',
    verbose: 1,
    
    localBrowserLaunchOptions: {
        executablePath: '/usr/bin/google-chrome-stable',
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    },
    
    credentials: {
        email: 'oscarmen486@gmail.com',
        password: 'Dorysman1'
    },
    
    baseUrl: 'https://alma-finanzas.com',
    
    timeouts: {
        navigation: 30000,
        action: 10000,
        extraction: 15000
    }
};
