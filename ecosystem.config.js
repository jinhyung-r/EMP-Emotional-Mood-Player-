module.exports = {
    apps: [{
        name: "EMP-SERVER",
        script: "server/src/app.js",
        env: {
            NODE_ENV:"production",
        }
    }]
};

