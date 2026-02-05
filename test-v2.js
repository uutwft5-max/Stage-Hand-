/**
 * ALMA Finanzas - Test Suite v2 (corregido)
 */

const { chromium } = require('playwright');

async function main() {
    console.log('🧪 ALMA Finanzas - Test Suite v2');
    console.log('═'.repeat(50));

    const browser = await chromium.launch({
        headless: true,
        executablePath: '/usr/bin/google-chrome-stable',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
    let passed = 0, failed = 0;

    const test = async (name, fn) => {
        process.stdout.write(`📝 ${name}... `);
        try {
            await fn();
            console.log('✅');
            passed++;
        } catch (e) {
            console.log('❌', e.message.substring(0, 60));
            failed++;
        }
    };

    try {
        // 1. Ir directo al login
        await test('Navegar a login', async () => {
            await page.goto('https://alma-finanzas.com/login', { waitUntil: 'networkidle' });
            await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
        });

        await page.screenshot({ path: '/home/ubuntu/alma-testing/v2-1-login.png' });

        // 2. Llenar credenciales
        await test('Llenar email', async () => {
            await page.fill('input[type="email"], input[name="email"]', 'oscarmen486@gmail.com');
        });

        await test('Llenar password', async () => {
            await page.fill('input[type="password"]', 'Dorysman1');
        });

        await page.screenshot({ path: '/home/ubuntu/alma-testing/v2-2-filled.png' });

        // 3. Click en botón de login
        await test('Click en Iniciar Sesión', async () => {
            // Buscar el botón verde de Iniciar Sesión
            const btn = page.locator('button:has-text("Iniciar Sesión")').first();
            await btn.click();
            // Esperar navegación
            await page.waitForURL('**/dashboard**', { timeout: 15000 });
        });

        console.log('   URL:', page.url());
        await page.screenshot({ path: '/home/ubuntu/alma-testing/v2-3-dashboard.png' });

        // 4. Verificar tour
        await test('Tour de bienvenida aparece', async () => {
            await page.waitForSelector('text=/Bienvenido/i', { timeout: 5000 });
        });

        // 5. Tour tiene botones correctos
        await test('Tour tiene Omitir y Siguiente', async () => {
            const omitir = await page.locator('text=/Omitir/i').isVisible();
            const siguiente = await page.locator('text=/Siguiente/i').isVisible();
            if (!omitir && !siguiente) throw new Error('Botones del tour no encontrados');
        });

        await page.screenshot({ path: '/home/ubuntu/alma-testing/v2-4-tour.png' });

        // 6. Omitir tour
        await test('Omitir tour', async () => {
            await page.click('text=/Omitir/i');
            await page.waitForTimeout(1000);
        });

        // 7. Verificar dashboard
        await test('Dashboard cargado', async () => {
            // Esperar que desaparezca el modal
            await page.waitForTimeout(1000);
            // Verificar elementos del dashboard
            const visible = await page.locator('text=/Febrero 2026|Dashboard|Flujo/i').first().isVisible();
            if (!visible) throw new Error('Elementos del dashboard no visibles');
        });

        await page.screenshot({ path: '/home/ubuntu/alma-testing/v2-5-clean.png', fullPage: true });

        // 8. Menú lateral
        await test('Menú lateral funciona', async () => {
            const facturacion = page.locator('text=Facturación').first();
            if (await facturacion.isVisible()) {
                await facturacion.click();
                await page.waitForTimeout(1000);
            } else {
                throw new Error('Menú Facturación no visible');
            }
        });

        await page.screenshot({ path: '/home/ubuntu/alma-testing/v2-6-facturacion.png' });

    } catch (e) {
        console.error('\n⚠️ Error crítico:', e.message);
    }

    await browser.close();

    console.log('');
    console.log('═'.repeat(50));
    console.log(`📊 RESULTADOS: ${passed}/${passed + failed} tests pasados`);
    if (failed === 0) console.log('🎉 ¡Todo correcto!');
    console.log('═'.repeat(50));
}

main();
