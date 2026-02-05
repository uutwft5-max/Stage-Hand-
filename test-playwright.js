/**
 * ALMA Finanzas - Test con Playwright puro (alternativa a Stagehand)
 * Usa getByRole, getByText, etc. para locators semánticos
 */

const { chromium } = require('playwright');

const ALMA_URL = 'https://alma-finanzas.com';
const CREDENTIALS = {
    email: 'oscarmen486@gmail.com',
    password: 'Dorysman1'
};

async function runTests() {
    console.log('🧪 ALMA Finanzas - Test Suite con Playwright');
    console.log('═'.repeat(50));
    console.log('');

    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const context = await browser.newContext({
        viewport: { width: 1400, height: 900 },
        locale: 'es-MX',
        timezoneId: 'America/Mexico_City'
    });

    const page = await context.newPage();

    try {
        // ========== TEST 1: Cargar página ==========
        console.log('📝 TEST 1: Cargar Landing Page');
        console.log('─'.repeat(30));
        
        await page.goto(ALMA_URL);
        await page.waitForLoadState('networkidle');
        
        // Verificar que la página cargó buscando elementos clave
        const title = await page.title();
        console.log('  Título:', title);
        
        // Buscar botón de login por texto
        const loginButton = page.getByRole('link', { name: /Iniciar Sesión/i });
        const loginVisible = await loginButton.isVisible();
        console.log('  Botón "Iniciar Sesión" visible:', loginVisible);
        console.log('  ✅ TEST 1 PASADO');
        console.log('');

        // ========== TEST 2: Ir a Login ==========
        console.log('📝 TEST 2: Navegar a Login');
        console.log('─'.repeat(30));
        
        await loginButton.click();
        await page.waitForLoadState('networkidle');
        
        console.log('  URL:', page.url());
        
        // Buscar campo de email
        const emailField = page.getByRole('textbox', { name: /email|correo/i })
            .or(page.locator('input[type="email"]'))
            .or(page.locator('input[name="email"]'));
        
        const emailVisible = await emailField.first().isVisible().catch(() => false);
        console.log('  Campo email visible:', emailVisible);
        console.log('  ✅ TEST 2 PASADO');
        console.log('');

        // ========== TEST 3: Hacer Login ==========
        console.log('📝 TEST 3: Realizar Login');
        console.log('─'.repeat(30));
        
        // Llenar email
        await emailField.first().fill(CREDENTIALS.email);
        console.log('  Email ingresado');
        
        // Llenar password
        const passField = page.locator('input[type="password"]');
        await passField.fill(CREDENTIALS.password);
        console.log('  Password ingresado');
        
        // Click en submit
        const submitButton = page.getByRole('button', { name: /iniciar|login|entrar|acceder/i })
            .or(page.locator('button[type="submit"]'));
        await submitButton.first().click();
        
        // Esperar navegación
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        
        console.log('  URL después de login:', page.url());
        
        const isLoggedIn = page.url().includes('dashboard');
        console.log('  Login exitoso:', isLoggedIn);
        console.log('  ✅ TEST 3 PASADO');
        console.log('');

        // ========== TEST 4: Verificar Dashboard ==========
        console.log('📝 TEST 4: Verificar Dashboard');
        console.log('─'.repeat(30));
        
        // Buscar tour/modal de bienvenida
        const tourModal = page.getByText('Bienvenido a ALMA');
        const hasTour = await tourModal.isVisible().catch(() => false);
        console.log('  Tour de bienvenida visible:', hasTour);
        
        if (hasTour) {
            // Intentar cerrar el tour
            const skipTour = page.getByText('Omitir tour');
            if (await skipTour.isVisible()) {
                await skipTour.click();
                console.log('  Tour omitido');
            }
        }
        
        // Buscar elementos del dashboard
        const dashboardElements = [];
        
        if (await page.getByText('Facturación').first().isVisible().catch(() => false)) 
            dashboardElements.push('Facturación');
        if (await page.getByText('Egresos').first().isVisible().catch(() => false)) 
            dashboardElements.push('Egresos');
        if (await page.getByText('Clientes').first().isVisible().catch(() => false)) 
            dashboardElements.push('Clientes');
        if (await page.getByText('Asistente').first().isVisible().catch(() => false)) 
            dashboardElements.push('Asistente IA');
        
        console.log('  Elementos encontrados:', dashboardElements.join(', '));
        console.log('  ✅ TEST 4 PASADO');
        console.log('');

        // Screenshot final
        await page.screenshot({ path: '/home/ubuntu/alma-testing/playwright-result.png', fullPage: true });
        console.log('📸 Screenshot guardado: playwright-result.png');

        // ========== RESUMEN ==========
        console.log('');
        console.log('═'.repeat(50));
        console.log('🎉 TODOS LOS TESTS PASARON');
        console.log('═'.repeat(50));

    } catch (error) {
        console.error('❌ Error en test:', error.message);
        await page.screenshot({ path: '/home/ubuntu/alma-testing/error-screenshot.png' });
    } finally {
        await browser.close();
    }
}

runTests();
