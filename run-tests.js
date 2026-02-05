#!/usr/bin/env node

/**
 * ALMA Finanzas - Test Runner
 * Ejecuta todos los tests o un módulo específico
 * 
 * Uso:
 *   node run-tests.js           # Ejecutar todos
 *   node run-tests.js auth      # Solo autenticación
 *   node run-tests.js dashboard # Solo dashboard
 *   node run-tests.js ingresos  # Solo ingresos
 */

const authTests = require('./tests/auth/login.test');
const dashboardTests = require('./tests/dashboard/navigation.test');
const ingresosTests = require('./tests/ingresos/list.test');

async function runAllTests() {
    const startTime = Date.now();
    const allResults = [];
    
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     🧪 ALMA Finanzas - Test Suite con Gemini 3 Flash     ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');
    
    const module = process.argv[2]?.toLowerCase();
    
    try {
        if (!module || module === 'auth') {
            console.log('\n🔐 Ejecutando tests de Autenticación...\n');
            const authResults = await authTests();
            allResults.push(...authResults.map(r => ({ ...r, module: 'auth' })));
        }
        
        if (!module || module === 'dashboard') {
            console.log('\n📊 Ejecutando tests de Dashboard...\n');
            const dashResults = await dashboardTests();
            allResults.push(...dashResults.map(r => ({ ...r, module: 'dashboard' })));
        }
        
        if (!module || module === 'ingresos') {
            console.log('\n💰 Ejecutando tests de Ingresos...\n');
            const ingResults = await ingresosTests();
            allResults.push(...ingResults.map(r => ({ ...r, module: 'ingresos' })));
        }
        
    } catch (error) {
        console.error('❌ Error fatal:', error.message);
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    // Final summary
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║                    📊 RESUMEN FINAL                      ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');
    
    const passed = allResults.filter(r => r.status === 'PASS').length;
    const failed = allResults.filter(r => r.status === 'FAIL').length;
    const errors = allResults.filter(r => r.status === 'ERROR').length;
    const warnings = allResults.filter(r => r.status === 'WARN').length;
    const total = allResults.length;
    
    console.log(`   Tests ejecutados: ${total}`);
    console.log(`   ✅ Pasaron:       ${passed} (${((passed/total)*100).toFixed(0)}%)`);
    console.log(`   ❌ Fallaron:      ${failed}`);
    console.log(`   ⚠️ Warnings:      ${warnings}`);
    console.log(`   💥 Errores:       ${errors}`);
    console.log(`   ⏱️ Duración:       ${duration}s`);
    console.log('');
    
    // Save final report
    const fs = require('fs');
    const report = {
        timestamp: new Date().toISOString(),
        duration: `${duration}s`,
        summary: { total, passed, failed, warnings, errors },
        results: allResults
    };
    
    fs.writeFileSync(
        '/home/ubuntu/alma-testing/reports/final-report.json',
        JSON.stringify(report, null, 2)
    );
    
    console.log('📁 Reporte guardado en: reports/final-report.json');
    console.log('');
    
    // Exit with error if any tests failed
    if (failed > 0 || errors > 0) {
        process.exit(1);
    }
}

runAllTests();
