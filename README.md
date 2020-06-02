# AngularForceReloadClient
Automagic reload for clients after deploy

- ./build/post-build.js: creates version.json in our dist folder which holds the current build hash and also enters the current build hash into the code itself.
- ./src/app/force-reload: polls the version.json every X minutes to check if the hash has changed compared to it’s “inner” hash
- package.json: run `npm run build-production` to build & create `version.json`
