17:52:08.311 Running build in Washington, D.C., USA (East) – iad1
17:52:08.312 Build machine configuration: 4 cores, 8 GB
17:52:08.466 Cloning github.com/mohamesbah44-source/renaissance-app (Branch: main, Commit: 0b5f430)
17:52:08.932 Cloning completed: 465.000ms
17:52:09.590 Restored build cache from previous deployment (ESuGR8cNJgrWrYCKWwFFkBfuDa4M)
17:52:10.574 Running "vercel build"
17:52:10.587 Vercel CLI 62.1.0
17:52:10.881 Installing dependencies...
17:52:12.005 
17:52:12.005 up to date in 1s
17:52:12.006 
17:52:12.006 151 packages are looking for funding
17:52:12.006   run `npm fund` for details
17:52:12.007 npm warn install-scripts 3 packages have install scripts not yet covered by allowScripts:
17:52:12.007 npm warn install-scripts   core-js@3.49.0 (postinstall: node -e "try{require('./postinstall')}catch(e){}")
17:52:12.007 npm warn install-scripts   sharp@0.34.5 (install: node install/check.js || npm run build)
17:52:12.007 npm warn install-scripts   unrs-resolver@1.12.2 (postinstall: node postinstall.js)
17:52:12.007 npm warn install-scripts
17:52:12.007 npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow.
17:52:12.065 Detected Next.js version: 16.2.9
17:52:12.076 Running "npm run build"
17:52:12.222 
17:52:12.222 > renaissance-app@0.1.0 build
17:52:12.222 > next build
17:52:12.222 
17:52:13.085   Applying modifyConfig from Vercel
17:52:13.102 ▲ Next.js 16.2.9 (Turbopack)
17:52:13.103 
17:52:13.150   Creating an optimized production build ...
17:52:21.909 
17:52:21.909 > Build error occurred
17:52:21.913 Error: Turbopack build failed with 1 errors:
17:52:21.913 ./app/admin
17:52:21.913 You cannot have two parallel pages that resolve to the same path. Please check /(app)/admin/clients/[id] and /admin.
17:52:21.913 
17:52:21.913     at ignore-listed frames
17:52:22.028 Error: Command "npm run build" exited with 1
