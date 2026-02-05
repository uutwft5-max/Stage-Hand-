/**
 * ALMA Finanzas - Test con Stagehand + Gemini (Debug)
 */

const { Stagehand } = require('@browserbasehq/stagehand');
const { chromium } = require('playwright');

const GEMINI_API_KEY = 'AIzaSyC8LNwccZwcyYqWPki-hNPRcBY5IqLCz_I';

async function main() {
    console.log('🧪 ALMA Finanzas - Stagehand + Gemini (Debug)');
    console.log('');

    // Primero probar que Playwright funciona solo
    console.log('1️⃣ Probando Playwright directo...');
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const testPage = await browser.newPage();
    await testPage.goto('https://alma-finanzas.com');
    console.log('   ✅ Playwright funciona');
    await browser.close();

    console.log('');
    console.log('2️⃣ Iniciando Stagehand...');
    
    const stagehand = new Stagehand({
        env: 'LOCAL',
        headless: true,
        verbose: 2, // Más verbose para debug
        enableCaching: false,
        modelName: 'gemini-2.0-flash',
        modelClientOptions: {
            apiKey: GEMINI_API_KEY
        },
        browserSettings: {
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        }
    });

    try {
        console.log('   Llamando init()...');
        await stagehand.init();
        console.log('   ✅ Stagehand iniciado');
        
        const page = stagehand.page;
        
        console.log('');
        console.log('3️⃣ Navegando a ALMA Finanzas...');
        await page.goto('https://alma-finanzas.com/login', { waitUntil: 'networkidle' });
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-debug-1.png' });
        console.log('   ✅ En página de login');
        
        console.log('');
        console.log('4️⃣ Usando act() para login...');
        
        // Email
        await stagehand.act({ action: 'type oscarmen486@gmail.com into the email field' });
        console.log('   ✅ Email ingresado');
        
        // Password
        await stagehand.act({ action: 'type Dorysman1 into the password field' });
        console.log('   ✅ Password ingresado');
        
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-debug-2.png' });
        
        // Submit
        await stagehand.act({ action: 'click the login or submit button' });
        console.log('   ✅ Click en login');
        
        await page.waitForTimeout(5000);
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-debug-3.png' });
        console.log('   📍 URL:', page.url());
        
        console.log('');
        console.log('5️⃣ Extrayendo info del dashboard...');
        const info = await stagehand.extract({
            instruction: 'What is shown on this page? List the main sections or menu items visible.',
            schema: {
                type: 'object',
                properties: {
                    pageTitle: { type: 'string' },
                    sections: { type: 'array', items: { type: 'string' } },
                    hasModal: { type: 'boolean' }
                }
            }
        });
        
        console.log('   Página:', info.pageTitle);
        console.log('   Secciones:', info.sections?.join(', '));
        console.log('   Modal visible:', info.hasModal);
        
        await stagehand.close();
        console.log('');
        console.log('🎉 Test completado');
        
    } catch (error) {
        console.error('');
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack?.substring(0, 500));
        try { await stagehand.close(); } catch(e) {}
        process.exit(1);
    }
}

main();
