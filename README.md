# monorepo
lerna+yarn workspace+monorepo

## Project setup
```
yarn install
```

## Compiles and minifies for production
```
yarn build
```

## usage in your project
The packages aren't published, so run this command in the package folder you’d like to link
```
yarn link
```

Use the command that you’d like to test into your current project
```
yarn link [package...]
```
