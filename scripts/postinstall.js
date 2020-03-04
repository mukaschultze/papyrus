if (process.env.CI != "true") {
    const { execSync } = require("child_process");
    execSync("npm run compile", { stdio: 'inherit' });
}

