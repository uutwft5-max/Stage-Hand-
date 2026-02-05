/**
 * Authentication Helper for ALMA Finanzas
 */

const { Stagehand } = require('@browserbasehq/stagehand');
const config = require('../stagehand.config');

process.env.GEMINI_API_KEY = 'AIzaSyC8LNwccZwcyYqWPki-hNPRcBY5IqLCz_I';

class AlmaTestHelper {
    constructor() {
        this.stagehand = null;
        this.page = null;
    }

    async init() {
        this.stagehand = new Stagehand({
            env: config.env,
            verbose: config.verbose,
            model: config.model,
            localBrowserLaunchOptions: config.localBrowserLaunchOptions
        });
        
        await this.stagehand.init();
        this.page = this.stagehand.context.pages()[0];
        return this;
    }

    async login(email = config.credentials.email, password = config.credentials.password) {
        await this.page.goto(`${config.baseUrl}/login`, { waitUntil: 'networkidle' });
        
        await this.stagehand.act(`type ${email} into the email input field`);
        await this.stagehand.act(`type ${password} into the password input field`);
        await this.stagehand.act('click the login button');
        
        await this.wait(3000);
        
        // Skip tour if present
        try {
            await this.stagehand.act('click on Omitir tour button if visible');
        } catch(e) {
            // Tour not present, that's fine
        }
        
        return this.page.url().includes('/dashboard');
    }

    async logout() {
        await this.stagehand.act('click on Cerrar Sesión in the sidebar');
        await this.wait(2000);
        return this.page.url().includes('/login');
    }

    async navigateTo(section) {
        const sectionMap = {
            'dashboard': 'Panel Principal',
            'ingresos': 'Ingresos',
            'egresos': 'Egresos',
            'cotizaciones': 'Cotizaciones',
            'facturacion': 'Facturación',
            'catalogo': 'Catálogo Productos',
            'directorio': 'Directorio',
            'fiscal': 'Control Fiscal',
            'nomina': 'Nómina'
        };
        
        const menuItem = sectionMap[section.toLowerCase()] || section;
        await this.stagehand.act(`click on ${menuItem} in the sidebar menu`);
        await this.wait(2000);
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async screenshot(name) {
        const timestamp = Date.now();
        const path = `/home/ubuntu/alma-testing/reports/${name}-${timestamp}.png`;
        await this.page.screenshot({ path });
        return path;
    }

    async close() {
        if (this.stagehand) {
            await this.stagehand.close();
        }
    }
}

module.exports = AlmaTestHelper;
