export const ENV = process.env.NODE_ENV;
export const DOMAIN = ENV === 'development' ? 'http://127.0.0.1:8080/api/' : '/api/';