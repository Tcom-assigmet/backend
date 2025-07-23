export const CONFIG = {
    CAMUNDA_BASE_URL: process.env.CAMUNDA_BASE_URL || 'https://eqs-dba-camunda-server-dev.azurewebsites.net/engine-rest',
    PROCESS_DEFINITION_KEY: process.env.PROCESS_DEFINITION_KEY|| 'dba-calculator',
    ENABLE_OPERATION_LOGGING: process.env.ENABLE_OPERATION_LOGGING === 'true' || true,
};