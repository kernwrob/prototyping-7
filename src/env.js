import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
    DB_URI: {}
});
