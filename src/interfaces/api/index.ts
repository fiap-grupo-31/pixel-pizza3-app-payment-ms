import { PaymentsController } from '../controllers/payments';
import { PaymentsRabbitmqController } from '../controllers/paymentsRabbitmq';

import { type DbConnection } from '../../domain/interfaces/dbconnection';
import express, { type Request, type RequestHandler, type Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { Global } from '../adapters';
import { swaggerSpec } from '../../infrastructure/swagger/swagger';

export class FastfoodApp {
  private readonly _dbconnection: DbConnection;
  private readonly _rabbitMqService: any;
  public readonly _app = express();
  private server: any = null;

  constructor (dbconnection: DbConnection, rabbitMQService: any) {
    this._dbconnection = dbconnection;
    this._rabbitMqService = rabbitMQService;

    void PaymentsRabbitmqController.startConsuming(this._dbconnection, this._rabbitMqService);
    this._app = express();
  }

  start (): void {
    this._app.use(cors());
    this._app.use(bodyParser.json({ limit: '10mb' }));
    this._app.disable('x-powered-by');
    this._app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Keep-Alive', 'timeout=30');
      res.setHeader('Content-Security-Policy', "default-src 'self'");
      res.setHeader('X-Content-Type-Options', 'nosniff');
      if (err instanceof SyntaxError && err.message.includes('JSON')) {
        const errorGlobal: any = Global.error('O body não esta em formato JSON, verifique e tente novamente.', 400);
        return res.status(errorGlobal.statusCode || 404).send(errorGlobal);
      } else {
        next();
      }
    });
    const port = process.env.PORT ?? 8080;

    this._app.get('/swagger.json', (req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swaggerUi = require('swagger-ui-express');
    this._app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    /**
        * @swagger
        * /payment:
        *   get:
        *     summary: retorna lista de todos os pedidos de pagamentos
        *     tags:
        *       - Payment
        *     responses:
        *       200:
        *         description: Successful response
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 data:
        *                   type: array
        *                   items:
        *                     type: object
        *                     properties:
        *                       _id:
        *                         type: string
        *                       _protocol:
        *                         type: number
        *                       _customerId:
        *                         type: string
        *                       _status:
        *                         type: string
        *                       _payment:
        *                         type: string
        *                       _itens:
        *                          type: array
        *                          items:
        *                            type: object
        *                            properties:
        *                              _id:
        *                                type: string
        *                              _orderId:
        *                                type: number
        *                              _productId:
        *                                type: string
        *                              _price:
        *                                type: number
        *                              _quantity:
        *                                type: number
        *                              _obs:
        *                                type: string
        *       404:
        *         description: Products not found
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 message:
        *                   type: string
        */
    this._app.get('/payment', (async (req: Request, res: Response): Promise<void> => {
      res.setHeader('Content-type', 'application/json');

      const products = await PaymentsController.getPayments(
        this._dbconnection
      );
      res.send(products);
    }) as RequestHandler);

    /**
        * @swagger
        * /payment/:id:
        *   get:
        *     summary: retorna pedido de pagamento por ID
        *     tags:
        *       - Payment
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: id do pedido de pagamento
        *     responses:
        *       200:
        *         description: Successful response
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 data:
        *                   type: array
        *                   items:
        *                     type: object
        *                     properties:
        *                       _id:
        *                         type: string
        *                       _protocol:
        *                         type: number
        *                       _customerId:
        *                         type: string
        *                       _status:
        *                         type: string
        *                       _payment:
        *                         type: string
        *                       _itens:
        *                          type: array
        *                          items:
        *                            type: object
        *                            properties:
        *                              _id:
        *                                type: string
        *                              _orderId:
        *                                type: number
        *                              _productId:
        *                                type: string
        *                              _price:
        *                                type: number
        *                              _quantity:
        *                                type: number
        *                              _obs:
        *                                type: string
        *       404:
        *         description: Products not found
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 message:
        *                   type: string
        */
    this._app.get('/payment/:id', (async (req: Request, res: Response): Promise<void> => {
      res.setHeader('Content-type', 'application/json');
      const { id } = req.params;

      const products = await PaymentsController.getPaymentsById(
        BigInt(id),
        this._dbconnection
      );
      res.send(products);
    }) as RequestHandler);

    /**
        * @swagger
        * /payment/order/:id:
        *   get:
        *     summary: retorna pedido de pagamento por ID
        *     tags:
        *       - Payment
        *     parameters:
        *       - in: path
        *         name: id
        *         required: true
        *         schema:
        *           type: string
        *         description: id do pedido de pagamento
        *     responses:
        *       200:
        *         description: Successful response
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 data:
        *                   type: array
        *                   items:
        *                     type: object
        *                     properties:
        *                       _id:
        *                         type: string
        *                       _protocol:
        *                         type: number
        *                       _customerId:
        *                         type: string
        *                       _status:
        *                         type: string
        *                       _payment:
        *                         type: string
        *                       _itens:
        *                          type: array
        *                          items:
        *                            type: object
        *                            properties:
        *                              _id:
        *                                type: string
        *                              _orderId:
        *                                type: number
        *                              _productId:
        *                                type: string
        *                              _price:
        *                                type: number
        *                              _quantity:
        *                                type: number
        *                              _obs:
        *                                type: string
        *       404:
        *         description: Products not found
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 message:
        *                   type: string
        */
    this._app.get('/payment/order/:id', (async (req: Request, res: Response) => {
      res.setHeader('Content-type', 'application/json');
      const { id } = req.params;

      const products = await PaymentsController.getPaymentsByOrderId(
        id,
        this._dbconnection
      );
      res.send(products);
    }) as RequestHandler);

    /**
        * @swagger
        * /payment:
        *   post:
        *     summary: Efetua pedido de pagamento para o broker
        *     tags:
         *       - Payment
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             type: object
        *             properties:
        *               orderId:
        *                 type: string
        *               broker:
        *                 type: string
        *               quantity:
        *                 type: number
        *               amount:
        *                 type: number
        *     responses:
        *       200:
        *         description: Successful response
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 data:
        *                   type: object
        *                   properties:
        *                     _id:
        *                       type: string
        *                     _orderId:
        *                       type: number
        *                     _broker:
        *                       type: string
        *                     _status:
        *                       type: string
        *                     _description:
        *                       type: string
        *                     _webhook:
        *                       type: string
        *       404:
        *         description: Products not found
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 message:
        *                   type: string
        */
    this._app.post('/payment', (async (req: Request, res: Response): Promise<void> => {
      res.setHeader('Content-type', 'application/json');
      const { broker, orderId, description, quantity, amount } = req.body;
      const payment = await PaymentsController.setPayment(
        orderId,
        broker,
        'WAITING',
        description,
        quantity,
        amount,
        process.env.API_PAYMENT_BASEURL ?? '',
        this._dbconnection
      );
      res.send(payment);
    }) as RequestHandler);

    /**
        * @swagger
        * /payment/webhook/fake/:paymentId:
        *   post:
        *     summary: Recebe evento de status de pagamento de um pedido vindo de um fake payment
        *     tags:
         *       - Payment
        *     parameters:
        *       - in: path
        *         name: paymentId
        *         required: true
        *         schema:
        *           type: string
        *         description: id do pagamento
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             type: object
        *             properties:
        *               status:
        *                 type: string
        *     responses:
        *       200:
        *         description: Successful response
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 data:
        *                   type: object
        *                   properties:
        *                     _id:
        *                       type: string
        *                     _orderId:
        *                       type: number
        *                     _broker:
        *                       type: string
        *                     _status:
        *                       type: string
        *                     _description:
        *                       type: string
        *                     _webhook:
        *                       type: string
        *       404:
        *         description: Products not found
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 message:
        *                   type: string
        */
    this._app.post('/payment/webhook/fake/:paymentId', (async (req: Request, res: Response): Promise<void> => {
      res.setHeader('Content-type', 'application/json');
      const { paymentId } = req.params;
      const { status, description } = req.body;
      const payment = await PaymentsController.updatePayment(
        BigInt(paymentId),
        null,
        null,
        status,
        description,
        this._rabbitMqService,
        this._dbconnection
      );
      res.send(payment);
    }) as RequestHandler);

    /**
        * @swagger
        * /payment/webhook/mercadopago/:paymentId:
        *   post:
        *     summary: Recebe evento de status de pagamento de um pedido vindo do mercadopago
        *     tags:
         *       - Payment
        *     parameters:
        *       - in: path
        *         name: paymentId
        *         required: true
        *         schema:
        *           type: string
        *         description: id do pagamento
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             type: object
        *             properties:
        *               orderId:
        *                 type: string
        *               broker:
        *                 type: string
        *     responses:
        *       200:
        *         description: Successful response
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 data:
        *                   type: object
        *                   properties:
        *                     _id:
        *                       type: string
        *                     _orderId:
        *                       type: number
        *                     _broker:
        *                       type: string
        *                     _status:
        *                       type: string
        *                     _description:
        *                       type: string
        *                     _webhook:
        *                       type: string
        *       404:
        *         description: Products not found
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 status:
        *                   type: string
        *                 message:
        *                   type: string
        */
    this._app.post('/payment/webhook/mercadopago/:paymentId', (async (req: Request, res: Response): Promise<void> => {
      res.setHeader('Content-type', 'application/json');
      const { paymentId } = req.params;
      const { action, id } = req.body;
      const payment = await PaymentsController.updatePayment(
        BigInt(paymentId),
        null,
        null,
        action,
        id,
        this._rabbitMqService,
        this._dbconnection
      );
      res.send(payment);
    }) as RequestHandler);

    this._app.use((req, res) => {
      res.status(200).send('');
    });
    this.server = this._app.listen(port, () => {
    });
    this.server.keepAliveTimeout = 30 * 1000;
    this.server.headersTimeout = 35 * 1000;
  }

  stop (): void {
    this.server.close();
  }
}
