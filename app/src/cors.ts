export const corsHeaders = {
    'Access-Control-Allow-Origin': CORS_ORIGIN ?? '',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
};