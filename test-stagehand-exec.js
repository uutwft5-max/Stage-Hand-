/**
 * ALMA Finanzas - Test con Stagehand + Gemini (con executablePath)
 */

const { Stagehand } = require('@browserbasehq/stagehand');

const GEMINI_API_KEY = 'AIzaSyC8LNwccZwcyYqWPki-hNPRcBY5IqLCz_I';
const CHROME_PATH = '/usr/bin/google-chrome-stable';

async function main() {
    console.log('🧪 ALMA Finanzas - Stagehand + Gemini');
    console.log('');

    const stagehand = new Stagehand({
        env: 'LOCAL',
        headless: true,
        verbose: 2,
        enableCaching: false,
        executablePath: CHROME_PATH,
        modelName: 'gemini-2.0-flash',
        modelClientOptions: {
            apiKey: GEMINI_API_KEY
        },
        localBrowserLaunchOptions: {
            executablePath: CHROME_PATH,
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        }
    });

    try {
        console.log('1️⃣ Iniciando Stagehand...');
        await stagehand.init();
        console.log('   ✅ Stagehand iniciado');
        
        const page = stagehand.page;
        
        console.log('');
        console.log('2️⃣ Navegando a ALMA Finanzas...');
        await page.goto('https://alma-finanzas.com/login', { waitUntil: 'networkidle' });
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-exec-1.png' });
        console.log('   ✅ En página de login');
        
        console.log('');
        console.log('3️⃣ Usando act() para login...');
        
        await stagehand.act({ action: 'enter oscarmen486@gmail.com in the email input field' });
        console.log('   ✅ Email ingresado');
        
        await stagehand.act({ action: 'enter Dorysman1 in the password input field' });
        console.log('   ✅ Password ingresado');
        
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-exec-2.png' });
        
        await stagehand.act({ action: 'click the login button to sign in' });
        console.log('   ✅ Click en login');
        
        await page.waitForTimeout(5000);
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-exec-3.png' });
        console.log('   📍 URL:', page.url());
        
        console.log('');
        console.log('4️⃣ Extrayendo info...');
        const info = await stagehand.extract({
            instruction: 'List the main menu items visible on the left sidebar',
            schema: {
                type: 'object',
                properties: {
                    menuItems: { type: 'array', items: { type: 'string' } },
                    hasWelcomeModal: { type: 'boolean' }
                }
            }
        });
        
        console.log('   Menú:', info.menuItems?.join(', '));
        console.log('   Modal:', info.hasWelcomeModal);
        
        await stagehand.close();
        console.log('');
        console.log('🎉 Test completado');
        
    } catch (error) {
        console.error('');
        console.error('❌ Error:', error.message);
        try { await stagehand.close(); } catch(e) {}
        process.exit(1);
    }
}

main();
