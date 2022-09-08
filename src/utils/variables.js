export let API;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
    API = "http://localhost:3000/";
} else {
    // production code
    API = "https://deploy-test-postgresql.herokuapp.com/";
}
