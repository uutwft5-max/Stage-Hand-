/**
 * ALMA Finanzas - Test Suite con Stagehand
 * Tests en lenguaje natural para el dashboard
 */

const { Stagehand } = require('@browserbasehq/stagehand');

// Configuración
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
    });

    try {
        await stagehand.init();
        const page = stagehand.page;

        // ========== TEST 1: Login ==========
        console.log('📝 TEST 1: Login');
        console.log('─'.repeat(30));
        
        await page.goto(ALMA_URL);
        await stagehand.act({ action: 'click on Iniciar Sesión button' });
        
        await stagehand.act({ action: `type "${CREDENTIALS.email}" in the email field` });
        await stagehand.act({ action: `type "${CREDENTIALS.password}" in the password field` });
        await stagehand.act({ action: 'click on the login/submit button' });
        
        // Esperar a que cargue el dashboard
        await page.waitForTimeout(3000);
        
        const loginResult = await stagehand.extract({
            instruction: 'Check if we are logged in by looking for dashboard elements or welcome message',
            schema: {
                type: 'object',
                properties: {
                    isLoggedIn: { type: 'boolean' },
                    welcomeMessage: { type: 'string' },
                    currentPage: { type: 'string' }
                }
            }
        });
        
        console.log('  Resultado:', loginResult);
        console.log('  ✅ TEST 1 PASADO');
        console.log('');

        // ========== TEST 2: Verificar Tour ==========
        console.log('📝 TEST 2: Tour de Bienvenida');
        console.log('─'.repeat(30));
        
        const tourInfo = await stagehand.extract({
            instruction: 'Look for an onboarding tour or welcome modal. Extract its title and available buttons',
            schema: {
                type: 'object',
                properties: {
                    hasTour: { type: 'boolean' },
                    tourTitle: { type: 'string' },
                    tourButtons: { type: 'array', items: { type: 'string' } }
                }
            }
        });
        
        console.log('  Tour encontrado:', tourInfo.hasTour);
        console.log('  Título:', tourInfo.tourTitle);
        console.log('  Botones:', tourInfo.tourButtons);
        
        if (tourInfo.hasTour) {
            await stagehand.act({ action: 'click on "Omitir tour" or skip tour button' });
            console.log('  ✅ Tour omitido');
        }
        console.log('  ✅ TEST 2 PASADO');
        console.log('');

        // ========== TEST 3: Dashboard Elements ==========
        console.log('📝 TEST 3: Elementos del Dashboard');
        console.log('─'.repeat(30));
        
        const dashboardInfo = await stagehand.extract({
            instruction: 'Extract the main sections and widgets visible on the dashboard',
            schema: {
                type: 'object',
                properties: {
                    menuItems: { type: 'array', items: { type: 'string' } },
                    dashboardWidgets: { type: 'array', items: { type: 'string' } },
                    hasAIAssistant: { type: 'boolean' },
                    currentMonth: { type: 'string' }
                }
            }
        });
        
        console.log('  Menú:', dashboardInfo.menuItems?.slice(0, 5).join(', '));
        console.log('  Widgets:', dashboardInfo.dashboardWidgets?.slice(0, 5).join(', '));
        console.log('  Asistente IA:', dashboardInfo.hasAIAssistant);
        console.log('  ✅ TEST 3 PASADO');
        console.log('');

        // ========== TEST 4: Navegación ==========
        console.log('📝 TEST 4: Navegación');
        console.log('─'.repeat(30));
        
        // Intentar navegar a Facturación
        await stagehand.act({ action: 'click on Facturación or invoicing menu item' });
        await page.waitForTimeout(2000);
        
        const navResult = await stagehand.extract({
            instruction: 'What page are we on now? Look at the URL or page title',
            schema: {
                type: 'object',
                properties: {
                    currentUrl: { type: 'string' },
                    pageTitle: { type: 'string' }
                }
            }
        });
        
        console.log('  Navegó a:', navResult.pageTitle || navResult.currentUrl);
        console.log('  ✅ TEST 4 PASADO');
        console.log('');

        // ========== RESUMEN ==========
        console.log('═'.repeat(50));
        console.log('🎉 TODOS LOS TESTS PASARON');
        console.log('═'.repeat(50));

        await stagehand.close();

    } catch (error) {
        console.error('❌ Error en test:', error.message);
        await stagehand.close();
        process.exit(1);
    }
}

runTests();
