/**
 * ALMA Finanzas - Test con Stagehand
 */

const { Stagehand } = require('@browserbasehq/stagehand');

async function main() {
    console.log('🧪 ALMA Finanzas - Stagehand Test');
    console.log('');

    const stagehand = new Stagehand({
        env: 'LOCAL',
        headless: true,
        verbose: 1,
        debugDom: false,
        modelName: 'gpt-4o', // Modelo para entender la página
        modelClientOptions: {
            apiKey: process.env.OPENAI_API_KEY
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
        
        // Screenshot
        await page.screenshot({ path: '/home/ubuntu/alma-testing/stagehand-1.png' });
        console.log('📸 Screenshot 1 guardado');
        
        // Usar act() de Stagehand
        console.log('🖱️ Buscando y haciendo click en login...');
        await stagehand.act({ action: 'click on the login or sign in button' });
        await page.waitForTimeout(2000);
        
        await page.screenshot({ path: '/home/ubuntu/alma-testing/stagehand-2.png' });
        console.log('📸 Screenshot 2 guardado');
        
        // Hacer login
        console.log('🔐 Haciendo login...');
        await stagehand.act({ action: 'type oscarmen486@gmail.com in the email field' });
        await stagehand.act({ action: 'type Dorysman1 in the password field' });
        await stagehand.act({ action: 'click the submit or login button' });
        
        await page.waitForTimeout(5000);
        await page.screenshot({ path: '/home/ubuntu/alma-testing/stagehand-3.png' });
        console.log('📸 Screenshot 3 guardado');
        
        console.log('📍 URL final:', page.url());
        
        // Extraer info del dashboard
        const info = await stagehand.extract({
            instruction: 'What are the main menu items or sections visible on this page?',
            schema: {
                type: 'object',
                properties: {
                    menuItems: { type: 'array', items: { type: 'string' } },
                    pageTitle: { type: 'string' }
                }
            }
        });
        
        console.log('📊 Info extraída:', JSON.stringify(info, null, 2));
        
        await stagehand.close();
        console.log('');
        console.log('🎉 Test completado');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        await stagehand.close().catch(() => {});
    }
}

main();
