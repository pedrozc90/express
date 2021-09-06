# express

express + typescript restful api boilerplate

> **Important:** Node.js &ge; **24.x** Express &ge; **4.18**, TypeScript &ge; **5.3.3**

## Commands

```bash
# install dependencies
npm install
```

```bash
# run on development mode
npm run start:dev
```

```bash
# build image, create container and start it using docker-composer + Dockerfile
docker-compose up --build --detach
```

```bash
# find process running on port 9000
netstat -ano | findstr :9000

# kill process
taskkill /pid 1000 /f
```

```bash
# update package.json
npx npm-check-updates --target latest --upgrade
```

## License

Please see [LICENSE](./LICENSE) file.
