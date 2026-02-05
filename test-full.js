/**
 * ALMA Finanzas - Test Suite con Playwright (sin Stagehand)
 * Usa locators semánticos y es más confiable
 */

const { chromium } = require('playwright');

async function main() {
    console.log('🧪 ALMA Finanzas - Test Suite');
    console.log('═'.repeat(50));
    console.log('');

    const browser = await chromium.launch({
        headless: true,
        executablePath: '/usr/bin/google-chrome-stable',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const context = await browser.newContext({
        viewport: { width: 1400, height: 900 },
        locale: 'es-MX'
    });
    const page = await context.newPage();

    let passed = 0;
    let failed = 0;

    // Helper para tests
    const test = async (name, fn) => {
        process.stdout.write(`📝 ${name}... `);
        try {
            await fn();
            console.log('✅ PASADO');
            passed++;
        } catch (e) {
            console.log('❌ FALLIDO:', e.message.substring(0, 80));
            failed++;
        }
    };

    try {
        // TEST 1: Cargar landing page
        await test('Cargar landing page', async () => {
            await page.goto('https://alma-finanzas.com', { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(2000);
            const title = await page.title();
            if (!title.includes('ALMA')) throw new Error('Título incorrecto');
        });

        // TEST 2: Verificar elementos del landing
        await test('Elementos del landing visibles', async () => {
            // Buscar cualquier link/botón con "Iniciar" o "Login"
            const loginEl = await page.locator('text=/iniciar sesión/i, text=/login/i, text=/acceder/i').first();
            await loginEl.waitFor({ state: 'visible', timeout: 5000 });
        });

        await page.screenshot({ path: '/home/ubuntu/alma-testing/test-1-landing.png' });

        // TEST 3: Navegar a login
        await test('Navegar a página de login', async () => {
            await page.locator('text=/iniciar sesión/i').first().click();
            await page.waitForTimeout(2000);
            // Verificar que hay campo de email
            const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="orreo"]');
            await emailInput.first().waitFor({ state: 'visible', timeout: 5000 });
        });

        await page.screenshot({ path: '/home/ubuntu/alma-testing/test-2-login.png' });

        // TEST 4: Hacer login
        await test('Realizar login', async () => {
            await page.locator('input[type="email"], input[name="email"]').first().fill('oscarmen486@gmail.com');
            await page.locator('input[type="password"]').fill('Dorysman1');
            await page.locator('button[type="submit"], button:has-text("Iniciar"), button:has-text("Entrar")').first().click();
            await page.waitForTimeout(4000);
            const url = page.url();
            if (!url.includes('dashboard')) throw new Error('No llegó al dashboard: ' + url);
        });

        console.log('   URL:', page.url());
        await page.screenshot({ path: '/home/ubuntu/alma-testing/test-3-dashboard.png' });

        // TEST 5: Verificar tour de bienvenida
        await test('Tour de bienvenida aparece', async () => {
            const tour = page.locator('text=/bienvenido/i, text=/tour/i').first();
            await tour.waitFor({ state: 'visible', timeout: 3000 });
        });

        // TEST 6: Omitir tour
        await test('Omitir tour funciona', async () => {
            const skipBtn = page.locator('text=/omitir/i, text=/skip/i').first();
            await skipBtn.click();
            await page.waitForTimeout(1000);
        });

        await page.screenshot({ path: '/home/ubuntu/alma-testing/test-4-after-tour.png' });

        // TEST 7: Menú lateral visible
        await test('Menú lateral visible', async () => {
            const menuItems = ['Facturación', 'Egresos', 'Clientes', 'Reportes'];
            let found = 0;
            for (const item of menuItems) {
                const el = page.locator(`text=${item}`).first();
                if (await el.isVisible().catch(() => false)) found++;
            }
            if (found < 2) throw new Error(`Solo ${found} items de menú encontrados`);
        });

        // TEST 8: Asistente IA visible
        await test('Asistente IA visible', async () => {
            const ai = page.locator('text=/asistente/i').first();
            await ai.waitFor({ state: 'visible', timeout: 3000 });
        });

        await page.screenshot({ path: '/home/ubuntu/alma-testing/test-5-final.png', fullPage: true });

    } catch (error) {
        console.error('\n⚠️ Error general:', error.message);
    }

    await browser.close();

    // Resumen
    console.log('');
    console.log('═'.repeat(50));
    console.log(`📊 RESULTADOS: ${passed} pasados, ${failed} fallidos`);
    console.log('═'.repeat(50));
    
    if (failed === 0) {
        console.log('🎉 ¡Todos los tests pasaron!');
    }
}

main().catch(console.error);
