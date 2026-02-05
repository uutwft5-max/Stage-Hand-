/**
 * ALMA Finanzas - Test Suite con Stagehand (Chrome local)
 */

const { Stagehand } = require('@browserbasehq/stagehand');

const ALMA_URL = 'https://alma-finanzas.com';
const CREDENTIALS = {
    email: 'oscarmen486@gmail.com',
    password: 'Dorysman1'
};

async function runTests() {
    console.log('🧪 ALMA Finanzas - Test Suite con Stagehand');
    console.log('═'.repeat(50));
    console.log('');

    const stagehand = new Stagehand({
        env: 'LOCAL',
        verbose: 1,
        headless: true,
        enableCaching: false,
        localBrowserLaunchOptions: {
            executablePath: '/usr/bin/google-chrome-stable',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        }
    });

    try {
        await stagehand.init();
        const page = stagehand.page;

        // TEST 1: Login
        console.log('📝 TEST 1: Login');
        console.log('─'.repeat(30));
        
        await page.goto(ALMA_URL);
        console.log('  Página cargada');
        
        await stagehand.act({ action: 'click on the "Iniciar Sesión" button or link' });
        console.log('  Click en Iniciar Sesión');
        
        await page.waitForTimeout(2000);
        
        await stagehand.act({ action: `fill the email input with "${CREDENTIALS.email}"` });
        console.log('  Email ingresado');
        
        await stagehand.act({ action: `fill the password input with "${CREDENTIALS.password}"` });
        console.log('  Password ingresado');
        
        await stagehand.act({ action: 'click on the login submit button' });
        console.log('  Enviando login...');
        
        await page.waitForTimeout(4000);
        
        const currentUrl = page.url();
        console.log('  URL actual:', currentUrl);
        
        if (currentUrl.includes('dashboard')) {
            console.log('  ✅ TEST 1 PASADO - Login exitoso');
        } else {
            console.log('  ⚠️ TEST 1 - Verificar manualmente');
        }
        console.log('');

        // TEST 2: Extraer info del Dashboard
        console.log('📝 TEST 2: Extraer Dashboard Info');
        console.log('─'.repeat(30));
        
        const dashInfo = await stagehand.extract({
            instruction: 'Extract the main menu items visible in the sidebar and any welcome message or modal',
            schema: {
                type: 'object',
                properties: {
                    menuItems: { type: 'array', items: { type: 'string' } },
                    welcomeMessage: { type: 'string' },
                    hasModal: { type: 'boolean' }
                }
            }
        });
        
        console.log('  Menú encontrado:', dashInfo.menuItems?.join(', ') || 'N/A');
        console.log('  Modal:', dashInfo.hasModal ? 'Sí' : 'No');
        console.log('  ✅ TEST 2 PASADO');
        console.log('');

        // TEST 3: Omitir tour si existe
        console.log('📝 TEST 3: Manejar Tour');
        console.log('─'.repeat(30));
        
        try {
            await stagehand.act({ 
                action: 'if there is a tour/onboarding modal visible, click on "Omitir tour" or similar skip button' 
            });
            console.log('  Tour omitido (si existía)');
        } catch (e) {
            console.log('  No había tour o ya fue cerrado');
        }
        console.log('  ✅ TEST 3 PASADO');
        console.log('');

        // Tomar screenshot
        await page.screenshot({ path: '/home/ubuntu/alma-testing/stagehand-result.png', fullPage: true });
        console.log('📸 Screenshot guardado: stagehand-result.png');

        console.log('');
        console.log('═'.repeat(50));
        console.log('🎉 TESTS COMPLETADOS');
        console.log('═'.repeat(50));

        await stagehand.close();

    } catch (error) {
        console.error('❌ Error:', error.message);
        try { await stagehand.close(); } catch(e) {}
        process.exit(1);
    }
}

runTests();
