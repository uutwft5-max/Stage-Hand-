/**
 * ALMA Finanzas - Test con Playwright usando Chrome existente
 */

const { chromium } = require('playwright');

async function runTests() {
    console.log('🧪 ALMA Finanzas - Test con Chrome existente');
    console.log('');

    const browser = await chromium.launch({
        headless: true,
        executablePath: '/usr/bin/google-chrome-stable',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();

    try {
        console.log('1️⃣ Navegando a ALMA...');
        await page.goto('https://alma-finanzas.com');
        await page.waitForLoadState('networkidle');
        console.log('   ✅ Página cargada');

        console.log('2️⃣ Buscando botón login...');
        await page.getByRole('link', { name: /Iniciar Sesión/i }).click();
        await page.waitForLoadState('networkidle');
        console.log('   ✅ En página de login');

        console.log('3️⃣ Haciendo login...');
        await page.locator('input[type="email"], input[name="email"]').first().fill('oscarmen486@gmail.com');
        await page.locator('input[type="password"]').fill('Dorysman1');
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(4000);
        console.log('   URL:', page.url());

        console.log('4️⃣ Verificando dashboard...');
        const hasTour = await page.getByText('Bienvenido a ALMA').isVisible().catch(() => false);
        console.log('   Tour visible:', hasTour);

        await page.screenshot({ path: '/home/ubuntu/alma-testing/pw-chrome-result.png', fullPage: true });
        console.log('📸 Screenshot guardado');

        console.log('');
        console.log('🎉 Test completado');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

runTests();
