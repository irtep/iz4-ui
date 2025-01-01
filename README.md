# iz4-ui

user interface for my password bank

## in DEV (npm start):

index.ts you need to have <BrowserRouter>, instead of <BrowserRouter basename="/iz4">.
context api (iz4context.tsx), change in line 21, modeOfUse to dev

## build to PROD (npm run build):

before "npm run build": index.ts you need to have <BrowserRouter basename="/iz4">, instead of <BrowserRouter>.
context api (iz4context.tsx), change in line 21, modeOfUse to prod
