import {HttpServer, INestApplication} from '@nestjs/common';
import {OpenAPIObject} from '@nestjs/swagger';
import {StoplightElementsOptions} from './interfaces/elements-options.interface';
import {Request, Response} from 'express';
import {NestExpressApplication} from '@nestjs/platform-express';
import * as handlebars from 'express-handlebars';
import {join, resolve} from 'path';

export class StoplightElementsModule {
  /**
   *
   * @param app - Nest Application
   * @param document - Swagger Document object
   */
  constructor(
    private app: INestApplication,
    private document: OpenAPIObject,
    private options: StoplightElementsOptions = {}
  ) {}

  /**
   * Attach module to existing NestJS app
   * @param path path to mount the Stoplight frontend @example '/api'
   */
  async start(path = '/') {
    const httpAdapter: HttpServer = this.app.getHttpAdapter();

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
        toJSON: function (object: any) {
          return JSON.stringify(object);
        },
      },
    });
    const renderData = {
      data: {
        document: JSON.stringify(this.document),
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
    console.log(path);
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
