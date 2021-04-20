const mongodbUrl = "test";
let basePath = 'http://localhost:3000';
module.exports = {
    mongodbUrl: mongodbUrl,
    basePath: basePath,
    patientsImagePath: basePath +'/images/uploads/patients/',
    doctorsImagePath: basePath +'/images/uploads/doctors/',
    JWT_SECRET: 'SuperSecRetKey'
}