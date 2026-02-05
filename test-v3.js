/**
 * ALMA Finanzas - Test Suite v3 (selector corregido)
 */

const { chromium } = require('playwright');

async function main() {
    console.log('🧪 ALMA Finanzas - Test Suite v3');
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
            return true;
        } catch (e) {
            console.log('❌', e.message.substring(0, 60));
            failed++;
            return false;
        }
    };

    try {
        // 1. Ir al login
        await test('Navegar a login', async () => {
            await page.goto('https://alma-finanzas.com/login', { waitUntil: 'networkidle' });
        });

        // 2. Llenar formulario
        await test('Llenar credenciales', async () => {
            await page.fill('input[type="email"], input[name="email"]', 'oscarmen486@gmail.com');
            await page.fill('input[type="password"]', 'Dorysman1');
        });

        await page.screenshot({ path: '/home/ubuntu/alma-testing/v3-1-filled.png' });

        // 3. Click en el BOTÓN verde (no el tab)
        await test('Click en botón de login', async () => {
            // El botón verde tiene type="submit" o está dentro del form
            const submitBtn = page.locator('button[type="submit"]');
            if (await submitBtn.count() > 0) {
                await submitBtn.click();
            } else {
                // Fallback: buscar el botón verde dentro del formulario
                await page.locator('form button, .card button, button.bg-green, button:has-text("Iniciar Sesión")').last().click();
            }
            await page.waitForURL('**/dashboard**', { timeout: 15000 });
        });

        console.log('   📍 URL:', page.url());
        await page.screenshot({ path: '/home/ubuntu/alma-testing/v3-2-dashboard.png' });

        // 4. Verificar tour
        const hasTour = await test('Tour de bienvenida', async () => {
            await page.waitForSelector('text=/Bienvenido a ALMA/i', { timeout: 5000 });
        });

        await page.screenshot({ path: '/home/ubuntu/alma-testing/v3-3-tour.png' });

        // 5. Verificar estructura del tour
        await test('Tour tiene botones', async () => {
            const omitir = await page.locator('text=/Omitir/i').count();
            const siguiente = await page.locator('text=/Siguiente/i').count();
            console.log(`\n   (Omitir: ${omitir}, Siguiente: ${siguiente})`);
            if (omitir === 0 && siguiente === 0) throw new Error('Sin botones de navegación');
        });

        // 6. Navegar por el tour o omitirlo
        await test('Interactuar con tour', async () => {
            const omitirBtn = page.locator('text=/Omitir tour/i');
            if (await omitirBtn.isVisible()) {
                await omitirBtn.click();
            } else {
                // Hacer click en Siguiente varias veces
                for (let i = 0; i < 7; i++) {
                    const siguiente = page.locator('text=/Siguiente/i');
                    if (await siguiente.isVisible()) {
                        await siguiente.click();
                        await page.waitForTimeout(500);
                    }
                }
            }
            await page.waitForTimeout(1000);
        });

        await page.screenshot({ path: '/home/ubuntu/alma-testing/v3-4-after-tour.png' });

        // 7. Dashboard limpio
        await test('Dashboard visible', async () => {
            // Buscar elementos típicos del dashboard
            const elements = ['Flujo', 'Gastos', 'Clientes', 'Facturación'];
            let found = 0;
            for (const el of elements) {
                if (await page.locator(`text=${el}`).first().isVisible().catch(() => false)) found++;
            }
            console.log(`\n   (${found} elementos encontrados)`);
            if (found < 2) throw new Error('Dashboard incompleto');
        });

        await page.screenshot({ path: '/home/ubuntu/alma-testing/v3-5-final.png', fullPage: true });

        // 8. Probar navegación
        await test('Navegar a Facturación', async () => {
            await page.locator('text=Facturación').first().click();
            await page.waitForTimeout(2000);
        });

        await page.screenshot({ path: '/home/ubuntu/alma-testing/v3-6-facturacion.png' });

    } catch (e) {
        console.error('\n⚠️ Error:', e.message);
        await page.screenshot({ path: '/home/ubuntu/alma-testing/v3-error.png' });
    }

    await browser.close();

    console.log('');
    console.log('═'.repeat(50));
    console.log(`📊 RESULTADOS: ${passed}/${passed + failed} tests`);
    if (failed === 0) console.log('🎉 ¡Todos los tests pasaron!');
    console.log('═'.repeat(50));
}

main();
