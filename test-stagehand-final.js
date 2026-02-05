/**
 * ALMA Finanzas - Test con Stagehand + Gemini (configuración correcta)
 */

const { Stagehand } = require('@browserbasehq/stagehand');

const GEMINI_API_KEY = 'AIzaSyC8LNwccZwcyYqWPki-hNPRcBY5IqLCz_I';
const CHROME_PATH = '/usr/bin/google-chrome-stable';

async function main() {
    console.log('🧪 ALMA Finanzas - Stagehand + Gemini');
    console.log('');

    // Configurar variable de entorno
    process.env.GEMINI_API_KEY = GEMINI_API_KEY;

    const stagehand = new Stagehand({
        env: 'LOCAL',
        verbose: 1,
        // Usar el modelo como string (AvailableModel)
        model: 'gemini-2.0-flash',
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
        
        const page = stagehand.context.pages()[0];
        console.log('   ✅ Página obtenida');
        
        console.log('');
        console.log('2️⃣ Navegando a ALMA Finanzas...');
        await page.goto('https://alma-finanzas.com/login', { waitUntil: 'networkidle' });
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-final-1.png' });
        console.log('   ✅ En página de login');
        
        console.log('');
        console.log('3️⃣ Usando act() para login...');
        
        await stagehand.act('type oscarmen486@gmail.com into the email input field');
        console.log('   ✅ Email ingresado');
        
        await stagehand.act('type Dorysman1 into the password input field');
        console.log('   ✅ Password ingresado');
        
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-final-2.png' });
        
        await stagehand.act('click the login button');
        console.log('   ✅ Click en login');
        
        await new Promise(r => setTimeout(r, 5000));
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-final-3.png' });
        console.log('   📍 URL:', page.url());
        
        console.log('');
        console.log('4️⃣ Extrayendo info del dashboard...');
        const { z } = require('zod');
        
        const info = await stagehand.extract({
            instruction: 'Extract the main menu items visible in the left sidebar',
            schema: z.object({
                menuItems: z.array(z.string()).describe('List of menu items in sidebar'),
                hasWelcomeModal: z.boolean().describe('Whether there is a welcome modal visible')
            })
        });
        
        console.log('   Menú:', info.menuItems?.join(', '));
        console.log('   Modal visible:', info.hasWelcomeModal);
        
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-final-4.png' });
        
        await stagehand.close();
        console.log('');
        console.log('🎉 Test completado exitosamente');
        
    } catch (error) {
        console.error('');
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack?.substring(0, 300));
        try { await stagehand.close(); } catch(e) {}
        process.exit(1);
    }
}

main();
