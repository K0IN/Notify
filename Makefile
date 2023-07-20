build: 
	@echo "Building..."

deploy:
	@echo "Deploying..."
	cd ./app/frontend && npm install && npm run build
	cp -r ./app/frontend/build ./app/src/static-site
	# deployctl deploy --token xxxxxxxxxxxx --project=dwdw ./app/src/main.ts

start-local:
	


# https://deno.com/blog/deploy-static-files