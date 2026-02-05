/**
 * ALMA Finanzas - Test con Stagehand + Gemini (v3 API)
 */

const { Stagehand } = require('@browserbasehq/stagehand');

const GEMINI_API_KEY = 'AIzaSyC8LNwccZwcyYqWPki-hNPRcBY5IqLCz_I';
const CHROME_PATH = '/usr/bin/google-chrome-stable';

async function main() {
    console.log('🧪 ALMA Finanzas - Stagehand + Gemini v3');
    console.log('');

    const stagehand = new Stagehand({
        env: 'LOCAL',
        headless: true,
        verbose: 1,
        enableCaching: false,
        modelName: 'gemini-1.5-flash',
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
        
        // V3 API: usar context.pages()
        const page = stagehand.context.pages()[0];
        if (!page) {
            throw new Error('No hay página disponible');
        }
        console.log('   ✅ Página obtenida');
        
        console.log('');
        console.log('2️⃣ Navegando a ALMA Finanzas...');
        await page.goto('https://alma-finanzas.com/login', { waitUntil: 'networkidle' });
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-v3-1.png' });
        console.log('   ✅ En página de login');
        
        console.log('');
        console.log('3️⃣ Usando act() para login...');
        
        await stagehand.act('type oscarmen486@gmail.com into the email input field');
        console.log('   ✅ Email ingresado');
        
        await stagehand.act('type Dorysman1 into the password input field');
        console.log('   ✅ Password ingresado');
        
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-v3-2.png' });
        
        await stagehand.act('click the login button');
        console.log('   ✅ Click en login');
        
        // Esperar a que cargue
        await new Promise(r => setTimeout(r, 5000));
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-v3-3.png' });
        console.log('   📍 URL:', page.url());
        
        console.log('');
        console.log('4️⃣ Extrayendo info del dashboard...');
        const info = await stagehand.extract({
            instruction: 'Extract the main menu items visible in the left sidebar and whether there is a welcome modal/tour visible',
            schema: {
                type: 'object',
                properties: {
                    menuItems: { type: 'array', items: { type: 'string' } },
                    hasWelcomeModal: { type: 'boolean' },
                    modalTitle: { type: 'string' }
                }
            }
        });
        
        console.log('   Menú:', info.menuItems?.join(', '));
        console.log('   Modal visible:', info.hasWelcomeModal);
        if (info.modalTitle) console.log('   Título modal:', info.modalTitle);
        
        // Si hay tour, omitirlo
        if (info.hasWelcomeModal) {
            console.log('');
            console.log('5️⃣ Omitiendo tour...');
            await stagehand.act('click on skip or omitir button to close the tour');
            await new Promise(r => setTimeout(r, 1000));
        }
        
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-v3-4.png' });
        
        await stagehand.close();
        console.log('');
        console.log('🎉 Test completado exitosamente');
        
    } catch (error) {
        console.error('');
        console.error('❌ Error:', error.message);
        try { await stagehand.close(); } catch(e) {}
        process.exit(1);
    }
}

main();
