build-frontend: 
	@echo "Building..."
	cd ./app/frontend && npm install && npm run build


deploy: build-frontend
	@echo "Deploying..."
	mkdir -p deploy
	cp -r ./app/backend/ ./deploy
	cp -r ./app/frontend/build ./deploy/static-site
	@echo "Deployed to ./deploy use deployctl to deploy to deno deploy"
	@echo "Example: deployctl deploy --token xxxxxxxxxxxx --project=notify ./deploy/deploy.ts"
	@echo "Remember to set the env variables in your dashboard!"
