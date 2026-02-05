/**
 * ALMA Finanzas - Test con Stagehand + Gemini
 */

const { Stagehand } = require('@browserbasehq/stagehand');

const GEMINI_API_KEY = 'AIzaSyC8LNwccZwcyYqWPki-hNPRcBY5IqLCz_I';

async function main() {
    console.log('🧪 ALMA Finanzas - Stagehand + Gemini');
    console.log('');

    const stagehand = new Stagehand({
        env: 'LOCAL',
        headless: true,
        verbose: 1,
        debugDom: false,
        modelName: 'gemini-2.0-flash',
        modelClientOptions: {
            apiKey: GEMINI_API_KEY
        }
    });

    try {
        await stagehand.init();
        console.log('✅ Browser iniciado');
        
        const page = stagehand.page;
        
        // Navegar a ALMA
        console.log('📍 Navegando a ALMA Finanzas...');
        await page.goto('https://alma-finanzas.com');
        await page.waitForTimeout(3000);
        
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-1-landing.png' });
        console.log('📸 Screenshot 1: Landing');
        
        // Usar act() para click en login
        console.log('🖱️ Click en Iniciar Sesión...');
        await stagehand.act({ action: 'click on the button or link to log in or sign in' });
        await page.waitForTimeout(2000);
        
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-2-login.png' });
        console.log('📸 Screenshot 2: Login page');
        
        // Login
        console.log('🔐 Ingresando credenciales...');
        await stagehand.act({ action: 'enter oscarmen486@gmail.com in the email input field' });
        await stagehand.act({ action: 'enter Dorysman1 in the password input field' });
        await stagehand.act({ action: 'click the submit or login button to sign in' });
        
        await page.waitForTimeout(5000);
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-3-dashboard.png' });
        console.log('📸 Screenshot 3: Dashboard');
        console.log('📍 URL:', page.url());
        
        // Extraer info
        console.log('');
        console.log('📊 Extrayendo información del dashboard...');
        const info = await stagehand.extract({
            instruction: 'List the main menu items visible in the sidebar and identify if there is a welcome tour or modal',
            schema: {
                type: 'object',
                properties: {
                    menuItems: { type: 'array', items: { type: 'string' } },
                    hasTour: { type: 'boolean' },
                    tourTitle: { type: 'string' }
                }
            }
        });
        
        console.log('Menú:', info.menuItems?.join(', '));
        console.log('Tour activo:', info.hasTour);
        if (info.tourTitle) console.log('Título tour:', info.tourTitle);
        
        // Si hay tour, omitirlo
        if (info.hasTour) {
            console.log('');
            console.log('🚫 Omitiendo tour...');
            await stagehand.act({ action: 'click on skip tour or omitir tour button' });
            await page.waitForTimeout(1000);
        }
        
        await page.screenshot({ path: '/home/ubuntu/alma-testing/sh-4-final.png', fullPage: true });
        console.log('📸 Screenshot 4: Final');
        
        await stagehand.close();
        console.log('');
        console.log('🎉 Test completado exitosamente');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        try { await stagehand.close(); } catch(e) {}
        process.exit(1);
    }
}

main();
