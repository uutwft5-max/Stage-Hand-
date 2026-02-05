/**
 * ALMA Finanzas - Dashboard Tests
 * 
 * Test Cases:
 * - DASH-001: Carga correcta del dashboard
 * - DASH-007 a DASH-016: Navegación de accesos rápidos
 */

const AlmaTestHelper = require('../../helpers/auth');
const { z } = require('zod');

async function runDashboardTests() {
    const results = [];
    let helper;

    console.log('📊 ALMA Finanzas - Dashboard Tests');
    console.log('=' .repeat(50));
    console.log('');

    // ═══════════════════════════════════════════════════════════
    // DASH-001: Carga correcta del dashboard
    // ═══════════════════════════════════════════════════════════
    console.log('🧪 DASH-001: Carga correcta del dashboard');
    try {
        helper = await new AlmaTestHelper().init();
        await helper.login();
        
        // Extract dashboard elements
        const dashboard = await helper.stagehand.extract({
            instruction: 'Extract the quick action cards visible on the dashboard. Look for cards like "Crea una Factura", "Factura Global", etc.',
            schema: z.object({
                quickActions: z.array(z.string()).describe('List of quick action card titles'),
                currentMonth: z.string().optional().describe('Current month/year displayed'),
                hasCreateButton: z.boolean().describe('Whether there is a main Create button')
            })
        });
        
        const hasQuickActions = dashboard.quickActions && dashboard.quickActions.length > 0;
        
        if (hasQuickActions) {
            console.log(`   ✅ PASS - Dashboard cargó con ${dashboard.quickActions.length} acciones rápidas`);
            console.log(`   📋 Acciones: ${dashboard.quickActions.slice(0, 5).join(', ')}...`);
            results.push({ id: 'DASH-001', status: 'PASS', message: `${dashboard.quickActions.length} quick actions found` });
        } else {
            console.log('   ❌ FAIL - No se encontraron acciones rápidas');
            results.push({ id: 'DASH-001', status: 'FAIL', message: 'No quick actions found' });
        }
        
        await helper.screenshot('dash-001-dashboard');
        await helper.close();
    } catch (error) {
        console.log(`   ❌ ERROR - ${error.message}`);
        results.push({ id: 'DASH-001', status: 'ERROR', message: error.message });
        if (helper) await helper.close();
    }

    console.log('');

    // ═══════════════════════════════════════════════════════════
    // DASH-007: "Crea una Factura" navega a facturación
    // ═══════════════════════════════════════════════════════════
    console.log('🧪 DASH-007: Click en "Crea una Factura"');
    try {
        helper = await new AlmaTestHelper().init();
        await helper.login();
        
        await helper.stagehand.act('click on the "Crea una Factura" card or button');
        await helper.wait(2000);
        
        const url = helper.page.url();
        // Should navigate to facturacion or income/create
        if (url.includes('factura') || url.includes('income') || url.includes('invoice')) {
            console.log(`   ✅ PASS - Navegó correctamente a: ${url}`);
            results.push({ id: 'DASH-007', status: 'PASS', message: url });
        } else {
            console.log(`   ⚠️ WARN - URL inesperada: ${url}`);
            results.push({ id: 'DASH-007', status: 'WARN', message: url });
        }
        
        await helper.screenshot('dash-007-factura');
        await helper.close();
    } catch (error) {
        console.log(`   ❌ ERROR - ${error.message}`);
        results.push({ id: 'DASH-007', status: 'ERROR', message: error.message });
        if (helper) await helper.close();
    }

    console.log('');

    // ═══════════════════════════════════════════════════════════
    // DASH-009: "Registra Compra o Gasto" navega a egresos
    // ═══════════════════════════════════════════════════════════
    console.log('🧪 DASH-009: Click en "Registra Compra o Gasto"');
    try {
        helper = await new AlmaTestHelper().init();
        await helper.login();
        
        await helper.stagehand.act('click on the "Registra Compra o Gasto" card');
        await helper.wait(2000);
        
        const url = helper.page.url();
        if (url.includes('expense') || url.includes('egreso') || url.includes('gasto')) {
            console.log(`   ✅ PASS - Navegó correctamente a: ${url}`);
            results.push({ id: 'DASH-009', status: 'PASS', message: url });
        } else {
            console.log(`   ⚠️ WARN - URL inesperada: ${url}`);
            results.push({ id: 'DASH-009', status: 'WARN', message: url });
        }
        
        await helper.screenshot('dash-009-egreso');
        await helper.close();
    } catch (error) {
        console.log(`   ❌ ERROR - ${error.message}`);
        results.push({ id: 'DASH-009', status: 'ERROR', message: error.message });
        if (helper) await helper.close();
    }

    console.log('');

    // ═══════════════════════════════════════════════════════════
    // DASH-012: "Crear Cliente o Proveedor" navega a directorio
    // ═══════════════════════════════════════════════════════════
    console.log('🧪 DASH-012: Click en "Crear Cliente o Proveedor"');
    try {
        helper = await new AlmaTestHelper().init();
        await helper.login();
        
        await helper.stagehand.act('click on the "Crear Cliente o Proveedor" card');
        await helper.wait(2000);
        
        const url = helper.page.url();
        if (url.includes('entit') || url.includes('client') || url.includes('directorio')) {
            console.log(`   ✅ PASS - Navegó correctamente a: ${url}`);
            results.push({ id: 'DASH-012', status: 'PASS', message: url });
        } else {
            console.log(`   ⚠️ WARN - URL inesperada: ${url}`);
            results.push({ id: 'DASH-012', status: 'WARN', message: url });
        }
        
        await helper.screenshot('dash-012-cliente');
        await helper.close();
    } catch (error) {
        console.log(`   ❌ ERROR - ${error.message}`);
        results.push({ id: 'DASH-012', status: 'ERROR', message: error.message });
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
    const warnings = results.filter(r => r.status === 'WARN').length;
    
    results.forEach(r => {
        const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : r.status === 'WARN' ? '⚠️' : '💥';
        console.log(`${icon} ${r.id}: ${r.status} - ${r.message}`);
    });
    
    console.log('');
    console.log(`Total: ${results.length} | ✅ ${passed} | ❌ ${failed} | ⚠️ ${warnings} | 💥 ${errors}`);
    
    // Save results
    const fs = require('fs');
    fs.writeFileSync(
        '/home/ubuntu/alma-testing/reports/dashboard-results.json',
        JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2)
    );
    
    return results;
}

// Run if called directly
if (require.main === module) {
    runDashboardTests()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = runDashboardTests;
