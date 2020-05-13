export default {
    environment: 'development' || process.env.NODE_ENV,
    baseUrl: '/api/v1',
    session: process.env.SESSION || 'secret-boilerplate-token',
    token: process.env.TOKEN || 'secret-jwt-token',
    database: process.env.DATABASE_URL || 'mongodb://localhost:27017/koach1' 
}
