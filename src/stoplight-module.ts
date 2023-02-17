import {INestApplication} from '@nestjs/common';
import {OpenAPIObject} from '@nestjs/swagger';
import {StoplightElementsOptions} from './interfaces/elements-options.interface';
import {Request, Response} from 'express';
import * as handlebars from 'express-handlebars';
import {join} from 'path';

const prependObjectIds = (d: OpenAPIObject): OpenAPIObject => {
  const newD = d;
  Object.keys(d.paths).forEach(key => {
    Object.keys(newD.paths[key]).forEach(k => {
      if (
        k === 'get' ||
        k === 'post' ||
        k === 'patch' ||
        k === 'delete' ||
        k === 'put'
      ) {
        const a = {summary: '', operationId: "'"};
        (newD.paths[key][k] || a).summary = newD.paths[key][k]?.operationId;
        (newD.paths[key][k] || a).operationId = `${key}/${k}`;
      }
    });
  });
  return newD;
};

export class StoplightElementsModule {
  /**
   *
   * @param app - Nest Application
   * @param document - Swagger Document object
   */
  constructor(
    private app: Omit<INestApplication, 'enableVersioning'>,
    private document: OpenAPIObject,
    private options: StoplightElementsOptions = {}
  ) {}

  /**
   * Attach module to existing NestJS app
   * @param path path to mount the Stoplight frontend @example '/api'
   */
  async start(path = '/') {
    return await this.setup(path);
  }

  /**
   * Setup ReDoc frontend for express plattform
   * @param path - path to mount the ReDoc frontend
   */
  async setup(path: string) {
    const httpAdapter = this.app.getHttpAdapter();
    const hbs = handlebars.create({
      helpers: {
        toJSON: function (object: Record<string, unknown>) {
          return JSON.stringify(object);
        },
      },
    });
    const renderData = {
      data: {
        ...this.options,
        document: JSON.stringify(prependObjectIds(this.document)),
      },
    };
    // this is our handlebars file path
    const stoplightFilePath = join(
      __dirname,
      '..',
      '..',
      'views',
      'stoplight.handlebars'
    );
    // console.log(stoplightFilePath);
    // // get handlebars rendered HTML
    const stoplightHTML = await hbs.render(stoplightFilePath, renderData);
    // // Serve stoplight Frontend
    httpAdapter.get(path, async (req: Request, res: Response) => {
      const sendPage = () => {
        res.setHeader(
          'Content-Security-Policy',
          "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; child-src * 'unsafe-inline' 'unsafe-eval' blob:; worker-src * 'unsafe-inline' 'unsafe-eval' blob:; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';"
        );
        res.send(stoplightHTML);
      };
      sendPage();
    });
  }
}
