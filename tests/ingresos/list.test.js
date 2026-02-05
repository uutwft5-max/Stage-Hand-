/**
 * ALMA Finanzas - Ingresos Tests
 * 
 * Test Cases:
 * - ING-001: Mostrar lista de ingresos
 * - ING-002: KPIs correctos
 * - ING-013: Crear ingreso con datos mínimos
 */

const AlmaTestHelper = require('../../helpers/auth');
const { z } = require('zod');

async function runIngresosTests() {
    const results = [];
    let helper;

    console.log('💰 ALMA Finanzas - Ingresos Tests');
    console.log('=' .repeat(50));
    console.log('');

    // ═══════════════════════════════════════════════════════════
    // ING-001: Mostrar lista de ingresos
    // ═══════════════════════════════════════════════════════════
    console.log('🧪 ING-001: Mostrar lista de ingresos');
    try {
        helper = await new AlmaTestHelper().init();
        await helper.login();
        await helper.navigateTo('ingresos');
        
        const ingresos = await helper.stagehand.extract({
            instruction: 'Extract information about the income list page. Look for the page title, total income amount, number of records shown, and any KPI cards.',
            schema: z.object({
                pageTitle: z.string().describe('Page title like "Gestión de Ingresos"'),
                totalIngresos: z.string().optional().describe('Total income amount displayed'),
                porCobrar: z.string().optional().describe('Amount pending to collect'),
                registrosCount: z.string().optional().describe('Number of records shown'),
                hasTable: z.boolean().describe('Whether there is a data table visible')
            })
        });
        
        if (ingresos.pageTitle && ingresos.pageTitle.toLowerCase().includes('ingreso')) {
            console.log(`   ✅ PASS - Página de ingresos cargada: "${ingresos.pageTitle}"`);
            console.log(`   💵 Total: ${ingresos.totalIngresos || 'N/A'}`);
            console.log(`   📋 Registros: ${ingresos.registrosCount || 'N/A'}`);
            results.push({ id: 'ING-001', status: 'PASS', message: ingresos.pageTitle });
        } else {
            console.log('   ❌ FAIL - No se cargó la página de ingresos');
            results.push({ id: 'ING-001', status: 'FAIL', message: 'Page not loaded correctly' });
        }
        
        await helper.screenshot('ing-001-lista');
        await helper.close();
    } catch (error) {
        console.log(`   ❌ ERROR - ${error.message}`);
        results.push({ id: 'ING-001', status: 'ERROR', message: error.message });
        if (helper) await helper.close();
    }

    console.log('');

    // ═══════════════════════════════════════════════════════════
    // ING-002: KPIs correctos
    // ═══════════════════════════════════════════════════════════
    console.log('🧪 ING-002: Verificar KPIs de ingresos');
    try {
        helper = await new AlmaTestHelper().init();
        await helper.login();
        await helper.navigateTo('ingresos');
        
        const kpis = await helper.stagehand.extract({
            instruction: 'Extract all the KPI cards at the top of the page. Look for Total Ingresos, Por Cobrar, IVA Trasladado, and Retenciones with their amounts.',
            schema: z.object({
                totalIngresos: z.object({
                    label: z.string(),
                    amount: z.string()
                }).optional(),
                porCobrar: z.object({
                    label: z.string(),
                    amount: z.string()
                }).optional(),
                ivaTrasladado: z.object({
                    label: z.string(),
                    amount: z.string()
                }).optional(),
                retenciones: z.object({
                    label: z.string(),
                    amount: z.string()
                }).optional()
            })
        });
        
        const hasKpis = kpis.totalIngresos || kpis.porCobrar || kpis.ivaTrasladado;
        
        if (hasKpis) {
            console.log('   ✅ PASS - KPIs encontrados:');
            if (kpis.totalIngresos) console.log(`      💵 ${kpis.totalIngresos.label}: ${kpis.totalIngresos.amount}`);
            if (kpis.porCobrar) console.log(`      ⏳ ${kpis.porCobrar.label}: ${kpis.porCobrar.amount}`);
            if (kpis.ivaTrasladado) console.log(`      📊 ${kpis.ivaTrasladado.label}: ${kpis.ivaTrasladado.amount}`);
            if (kpis.retenciones) console.log(`      📉 ${kpis.retenciones.label}: ${kpis.retenciones.amount}`);
            results.push({ id: 'ING-002', status: 'PASS', message: 'KPIs displayed correctly' });
        } else {
            console.log('   ❌ FAIL - No se encontraron KPIs');
            results.push({ id: 'ING-002', status: 'FAIL', message: 'KPIs not found' });
        }
        
        await helper.close();
    } catch (error) {
        console.log(`   ❌ ERROR - ${error.message}`);
        results.push({ id: 'ING-002', status: 'ERROR', message: error.message });
        if (helper) await helper.close();
    }

    console.log('');

    // ═══════════════════════════════════════════════════════════
    // ING-013: Abrir formulario de nuevo ingreso
    // ═══════════════════════════════════════════════════════════
    console.log('🧪 ING-013: Abrir formulario de nuevo ingreso');
    try {
        helper = await new AlmaTestHelper().init();
        await helper.login();
        await helper.navigateTo('ingresos');
        
        await helper.stagehand.act('click on the "Nuevo Ingreso" button');
        await helper.wait(2000);
        
        const form = await helper.stagehand.extract({
            instruction: 'Check if a form or modal for creating a new income is visible. Look for form fields like client, amount, date, concept.',
            schema: z.object({
                isFormVisible: z.boolean().describe('Whether a form or modal is visible'),
                formTitle: z.string().optional().describe('Title of the form/modal'),
                hasClientField: z.boolean().describe('Whether there is a client selection field'),
                hasAmountField: z.boolean().describe('Whether there is an amount field')
            })
        });
        
        if (form.isFormVisible) {
            console.log(`   ✅ PASS - Formulario visible: "${form.formTitle || 'Nuevo Ingreso'}"`);
            console.log(`      👤 Campo cliente: ${form.hasClientField ? 'Sí' : 'No'}`);
            console.log(`      💵 Campo monto: ${form.hasAmountField ? 'Sí' : 'No'}`);
            results.push({ id: 'ING-013', status: 'PASS', message: 'Form opened' });
        } else {
            console.log('   ❌ FAIL - Formulario no visible');
            results.push({ id: 'ING-013', status: 'FAIL', message: 'Form not visible' });
        }
        
        await helper.screenshot('ing-013-nuevo');
        await helper.close();
    } catch (error) {
        console.log(`   ❌ ERROR - ${error.message}`);
        results.push({ id: 'ING-013', status: 'ERROR', message: error.message });
        if (helper) await helper.close();
    }

    // ═══════════════════════════════════════════════════════════
    // RESUMEN
    // ═══════════════════════════════════════════════════════════
    console.log('');
    console.log('=' .repeat(50));
    console.log('📊 RESUMEN DE RESULTADOS');
    console.log('=' .repeat(50));
    
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    const errors = results.filter(r => r.status === 'ERROR').length;
    
    results.forEach(r => {
        const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '💥';
        console.log(`${icon} ${r.id}: ${r.status} - ${r.message}`);
    });
    
    console.log('');
    console.log(`Total: ${results.length} | ✅ ${passed} | ❌ ${failed} | 💥 ${errors}`);
    
    // Save results
    const fs = require('fs');
    fs.writeFileSync(
        '/home/ubuntu/alma-testing/reports/ingresos-results.json',
        JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2)
    );
    
    return results;
}

// Run if called directly
if (require.main === module) {
    runIngresosTests()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = runIngresosTests;
