# NestJS Module for Stoplight Elements OpenAPI

[Stoplight Elements](https://stoplight.io/open-source/elements) Interactive API Docs for your NestJS app.
Inspired by [NestJS-Redoc](https://github.com/mxarc/nestjs-redoc)

![Stoplight Elements](https://stoplight.io/_next/image?url=%2Fimages%2Felements%2Felements-landing-hero.png&w=3840&q=75)

It's almost a drop in replacement for you current swagger UI, you only need to import this package and modify any settings you may want to change

## Installation

`npm i nestjs-stoplight-elements`

## How to use

You need to install the [Swagger Module](https://github.com/nestjs/swagger) first if you want to get definitions updated with your project.

In future versions you will be able to pass a URL parameter as document, but for the moment you need this document object from the swagger module

```typescript
const options = new DocumentBuilder()
  .setTitle('Look, i have a title')
  .setDescription('A very nice description')
  .setBasePath('/api/v1')
  .build();
const document = SwaggerModule.createDocument(app, options);
```

Then add the following example code.

**Note**: All properties are optional, if you don't specify a title we will fallback to the one you used in your DocumentBuilder instance.

```typescript
// Instead of using SwaggerModule.setup() you call this module
const options = {}; // TODO Add all options support

const StoplightElements = new StoplightElementsModule(app, document, options);
await StoplightElements.start('/docs');
```
