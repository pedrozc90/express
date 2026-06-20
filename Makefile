.DEFAULT_GOAL := help

# -- variables -----------------

mode ?= development

# -- help ---------------------

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# -- node ---------------------

.PHONY: run
run: ## run application on development mode
	npm run start:dev

.PHONY: test
test: ## run tests
	npm test

.PHONY: lint
lint: ## run eslint
	npm run lint

.PHONY: format
format: ## run format --fix
	npm run format:fix

# -- docker -------------------

.PHONY: up
up: ## startup docker containers
	docker compose up --wait

.PHONY: down
down: ## stop all docker containers
	docker compose down --volumes

.PHONY: build
build: ## build docker image
	docker build --debug --tag express:dev .

.PHONY: deploy
deploy: ## build docker image and create container
	docker compose --file docker-compose.build.yml run --build --rm --service-ports app
