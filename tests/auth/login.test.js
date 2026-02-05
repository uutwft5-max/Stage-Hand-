/**
 * ALMA Finanzas - Authentication Tests
 * 
 * Test Cases:
 * - AUTH-001: Login exitoso con credenciales válidas
 * - AUTH-002: Login fallido - email incorrecto
 * - AUTH-003: Login fallido - password incorrecto
 * - AUTH-008: Logout exitoso
 */

const AlmaTestHelper = require('../../helpers/auth');
const { z } = require('zod');

async function runAuthTests() {
    const results = [];
    let helper;

    console.log('🔐 ALMA Finanzas - Authentication Tests');
    console.log('=' .repeat(50));
    console.log('');

    // ═══════════════════════════════════════════════════════════
    // AUTH-001: Login exitoso con credenciales válidas
    // ═══════════════════════════════════════════════════════════
    console.log('🧪 AUTH-001: Login exitoso con credenciales válidas');
    try {
        helper = await new AlmaTestHelper().init();
        const success = await helper.login();
        
        if (success && helper.page.url().includes('/dashboard')) {
            console.log('   ✅ PASS - Redirigido a dashboard');
            results.push({ id: 'AUTH-001', status: 'PASS', message: 'Login exitoso' });
        } else {
            console.log('   ❌ FAIL - No redirigió a dashboard');
            results.push({ id: 'AUTH-001', status: 'FAIL', message: `URL actual: ${helper.page.url()}` });
        }
        
        await helper.screenshot('auth-001-login-success');
        await helper.close();
    } catch (error) {
        console.log(`   ❌ ERROR - ${error.message}`);
        results.push({ id: 'AUTH-001', status: 'ERROR', message: error.message });
        if (helper) await helper.close();
    }

    console.log('');

    // ═══════════════════════════════════════════════════════════
    // AUTH-002: Login fallido - email incorrecto
    // ═══════════════════════════════════════════════════════════
    console.log('🧪 AUTH-002: Login fallido - email incorrecto');
    try {
        helper = await new AlmaTestHelper().init();
        
        await helper.page.goto('https://alma-finanzas.com/login', { waitUntil: 'networkidle' });
        await helper.stagehand.act('type wrongemail@test.com into the email input field');
        await helper.stagehand.act('type Dorysman1 into the password input field');
        await helper.stagehand.act('click the login button');
        await helper.wait(3000);
        
        // Should still be on login page or show error
        const url = helper.page.url();
        if (url.includes('/login') || !url.includes('/dashboard')) {
            console.log('   ✅ PASS - Permaneció en login (credenciales rechazadas)');
            results.push({ id: 'AUTH-002', status: 'PASS', message: 'Email incorrecto rechazado' });
        } else {
            console.log('   ❌ FAIL - No debería haber logueado');
            results.push({ id: 'AUTH-002', status: 'FAIL', message: 'Login no debería ser exitoso' });
        }
        
        await helper.screenshot('auth-002-wrong-email');
        await helper.close();
    } catch (error) {
        console.log(`   ❌ ERROR - ${error.message}`);
        results.push({ id: 'AUTH-002', status: 'ERROR', message: error.message });
        if (helper) await helper.close();
    }

    console.log('');

    // ═══════════════════════════════════════════════════════════
    // AUTH-003: Login fallido - password incorrecto
    // ═══════════════════════════════════════════════════════════
    console.log('🧪 AUTH-003: Login fallido - password incorrecto');
    try {
        helper = await new AlmaTestHelper().init();
        
        await helper.page.goto('https://alma-finanzas.com/login', { waitUntil: 'networkidle' });
        await helper.stagehand.act('type oscarmen486@gmail.com into the email input field');
        await helper.stagehand.act('type WrongPassword123 into the password input field');
        await helper.stagehand.act('click the login button');
        await helper.wait(3000);
        
        const url = helper.page.url();
        if (url.includes('/login') || !url.includes('/dashboard')) {
            console.log('   ✅ PASS - Permaneció en login (password rechazado)');
            results.push({ id: 'AUTH-003', status: 'PASS', message: 'Password incorrecto rechazado' });
        } else {
            console.log('   ❌ FAIL - No debería haber logueado');
            results.push({ id: 'AUTH-003', status: 'FAIL', message: 'Login no debería ser exitoso' });
        }
        
        await helper.screenshot('auth-003-wrong-password');
        await helper.close();
    } catch (error) {
        console.log(`   ❌ ERROR - ${error.message}`);
        results.push({ id: 'AUTH-003', status: 'ERROR', message: error.message });
        if (helper) await helper.close();
    }

    console.log('');

    // ═══════════════════════════════════════════════════════════
    // AUTH-008: Logout exitoso
    // ═══════════════════════════════════════════════════════════
    console.log('🧪 AUTH-008: Logout exitoso');
    try {
        helper = await new AlmaTestHelper().init();
        await helper.login();
        
        const logoutSuccess = await helper.logout();
        
        if (logoutSuccess) {
            console.log('   ✅ PASS - Logout exitoso, redirigido a login');
            results.push({ id: 'AUTH-008', status: 'PASS', message: 'Logout exitoso' });
        } else {
            console.log('   ❌ FAIL - No redirigió a login');
            results.push({ id: 'AUTH-008', status: 'FAIL', message: `URL actual: ${helper.page.url()}` });
        }
        
        await helper.screenshot('auth-008-logout');
        await helper.close();
    } catch (error) {
        console.log(`   ❌ ERROR - ${error.message}`);
        results.push({ id: 'AUTH-008', status: 'ERROR', message: error.message });
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
        const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '⚠️';
        console.log(`${icon} ${r.id}: ${r.status} - ${r.message}`);
    });
    
    console.log('');
    console.log(`Total: ${results.length} | ✅ ${passed} | ❌ ${failed} | ⚠️ ${errors}`);
    
    // Save results
    const fs = require('fs');
    fs.writeFileSync(
        '/home/ubuntu/alma-testing/reports/auth-results.json',
        JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2)
    );
    
    return results;
}

// Run if called directly
if (require.main === module) {
    runAuthTests()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = runAuthTests;
