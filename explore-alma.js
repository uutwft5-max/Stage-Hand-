/**
 * ALMA Finanzas - Explorador de funciones con Gemini 3 Flash
 * Mapea toda la aplicación para crear plan de testing
 */

const { Stagehand } = require('@browserbasehq/stagehand');
const { z } = require('zod');

process.env.GEMINI_API_KEY = 'AIzaSyC8LNwccZwcyYqWPki-hNPRcBY5IqLCz_I';

const CHROME_PATH = '/usr/bin/google-chrome-stable';
const CREDS = { email: 'oscarmen486@gmail.com', pass: 'Dorysman1' };

async function main() {
    console.log('🔍 ALMA Finanzas - Exploración completa');
    console.log('📱 Modelo: gemini-3-flash-preview\n');

    const stagehand = new Stagehand({
        env: 'LOCAL',
        verbose: 1,
        model: 'google/gemini-3-flash-preview',
        localBrowserLaunchOptions: {
            executablePath: CHROME_PATH,
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        }
    });

    const results = {
        timestamp: new Date().toISOString(),
        sections: []
    };

    try {
        await stagehand.init();
        const page = stagehand.context.pages()[0];
        
        // 1. Login
        console.log('1️⃣ Iniciando sesión...');
        await page.goto('https://alma-finanzas.com/login', { waitUntil: 'networkidle' });
        await stagehand.act(`type ${CREDS.email} into the email field`);
        await stagehand.act(`type ${CREDS.pass} into the password field`);
        await stagehand.act('click the login button');
        await new Promise(r => setTimeout(r, 4000));
        
        // Cerrar tour si existe
        try {
            await stagehand.act('click on Omitir tour or skip button if visible');
        } catch(e) {}
        await new Promise(r => setTimeout(r, 1000));
        
        // 2. Extraer menú principal
        console.log('\n2️⃣ Extrayendo menú de navegación...');
        const menu = await stagehand.extract({
            instruction: 'Extract all menu items from the left sidebar navigation. Include the main categories and any subcategories or nested items. Look for icons and text labels.',
            schema: z.object({
                menuItems: z.array(z.object({
                    name: z.string().describe('Name of the menu item'),
                    hasSubmenu: z.boolean().describe('Whether it has nested items'),
                    icon: z.string().optional().describe('Icon description if visible')
                }))
            })
        });
        
        console.log('   Menú encontrado:', menu.menuItems?.map(m => m.name).join(', '));
        results.menu = menu.menuItems;
        
        // 3. Explorar Dashboard
        console.log('\n3️⃣ Analizando Dashboard...');
        await page.screenshot({ path: '/home/ubuntu/alma-testing/explore-1-dashboard.png' });
        
        const dashboard = await stagehand.extract({
            instruction: 'Describe all the widgets, cards, charts, and interactive elements visible on this dashboard. Include any statistics, KPIs, quick actions, or summary information.',
            schema: z.object({
                widgets: z.array(z.object({
                    title: z.string(),
                    type: z.string().describe('card, chart, table, button, etc'),
                    description: z.string()
                })),
                quickActions: z.array(z.string()).optional()
            })
        });
        
        results.sections.push({ name: 'Dashboard', ...dashboard });
        console.log('   Widgets:', dashboard.widgets?.length || 0);
        
        // 4. Explorar cada sección del menú
        const sectionsToExplore = ['Clientes', 'Ingresos', 'Egresos', 'Contabilidad', 'Reportes', 'Facturación', 'Configuración'];
        
        for (const section of sectionsToExplore) {
            console.log(`\n4️⃣ Explorando: ${section}...`);
            try {
                await stagehand.act(`click on ${section} in the sidebar menu`);
                await new Promise(r => setTimeout(r, 2000));
                
                const sectionName = section.toLowerCase().replace(/\s/g, '-');
                await page.screenshot({ path: `/home/ubuntu/alma-testing/explore-${sectionName}.png` });
                
                const sectionData = await stagehand.extract({
                    instruction: `Describe all the features, buttons, forms, tables, and interactive elements visible on this ${section} page. Include any CRUD operations (create, read, update, delete), filters, search functionality, and any special features.`,
                    schema: z.object({
                        pageTitle: z.string(),
                        features: z.array(z.object({
                            name: z.string(),
                            type: z.string().describe('button, form, table, filter, modal, etc'),
                            action: z.string().describe('what this feature does')
                        })),
                        hasCRUD: z.object({
                            create: z.boolean(),
                            read: z.boolean(),
                            update: z.boolean(),
                            delete: z.boolean()
                        }).optional()
                    })
                });
                
                results.sections.push({ name: section, ...sectionData });
                console.log(`   Features en ${section}:`, sectionData.features?.length || 0);
                
            } catch(err) {
                console.log(`   ⚠️ No pude acceder a ${section}: ${err.message.substring(0, 50)}`);
            }
        }
        
        // 5. Guardar resultados
        const fs = require('fs');
        fs.writeFileSync(
            '/home/ubuntu/alma-testing/alma-exploration-results.json',
            JSON.stringify(results, null, 2)
        );
        
        await stagehand.close();
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 EXPLORACIÓN COMPLETADA');
        console.log('='.repeat(60));
        console.log(`Secciones mapeadas: ${results.sections.length}`);
        console.log(`Resultados guardados en: alma-exploration-results.json`);
        console.log(`Screenshots en: /home/ubuntu/alma-testing/explore-*.png`);
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        try { await stagehand.close(); } catch(e) {}
        process.exit(1);
    }
}

main();
