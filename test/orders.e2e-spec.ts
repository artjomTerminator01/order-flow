import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { ProductService } from "../src/product/services";
import { Order, OrderProduct } from "../src/order/interfaces";

describe("OrderController (e2e)", () => {
  let app: INestApplication;
  let productService: ProductService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    productService = moduleFixture.get<ProductService>(ProductService);

    await app.init();
  });

  it("/api/orders/:orderId (GET) should return an order by ID", async () => {
    // Step 1: Create an order
    const createResponse = await request(app.getHttpServer())
      .post("/api/orders")
      .expect(201);

    const orderId = createResponse.body.id;
    // Step 2: Retrieve the created order and verify its details
    request(app.getHttpServer())
      .get(`/api/orders/${orderId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({
          amount: {
            discount: "0.00",
            paid: "0.00",
            returns: "0.00",
            total: "0.00",
          },
          id: orderId,
          products: [],
          status: "NEW",
        });
      });
  });

  it("/api/orders/:orderId/products (POST) should add products to the order", async () => {
    // Step 1: Create an order
    const createResponse = await request(app.getHttpServer())
      .post("/api/orders")
      .expect(201);

    const orderId = createResponse.body.id;
    const testProductsIds = [123, 456, 879, 999];

    // Step 2: Add products to the order
    await request(app.getHttpServer())
      .post(`/api/orders/${orderId}/products`)
      .send(testProductsIds)
      .expect(201)
      .expect((res) => {
        expect(res.text).toEqual("OK");
      });

    // Step 3: Retrieve the order and verify the added products
    await request(app.getHttpServer())
      .get(`/api/orders/${orderId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.products.length).toEqual(4);
        expect(+res.body.amount.total).toEqual(
          calculateOrderTotalAmount(res.body)
        );
      });

    //Check endpoint with invalid product id
    await request(app.getHttpServer())
      .post(`/api/orders/${orderId}/products`)
      .send([123, 4])
      .expect(400);

    //Check endpoint with invalid duplicates
    await request(app.getHttpServer())
      .post(`/api/orders/${orderId}/products`)
      .send([123, 123])
      .expect(400);
  });

  it("/api/orders/:orderId (PATCH) should update the order status", async () => {
    // Step 1: Create an order
    const createResponse = await request(app.getHttpServer())
      .post("/api/orders")
      .expect(201);

    const orderId = createResponse.body.id;
    const newStatus = "PAID";
    const testProductsIds = [123, 456];

    // Step 2: Add products to order
    await request(app.getHttpServer())
      .post(`/api/orders/${orderId}/products`)
      .send(testProductsIds)
      .expect(201);

    // Step 3: Update order status
    await request(app.getHttpServer())
      .patch(`/api/orders/${orderId}`)
      .send({ status: newStatus })
      .expect(200)
      .expect((res) => {
        expect(res.text).toEqual("OK");
      });

    // Step 4: Retrieve the updated order and verify the new status and paid amount
    await request(app.getHttpServer())
      .get(`/api/orders/${orderId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toEqual(newStatus);
        expect(res.body.amount.paid).toEqual(res.body.amount.total);
      });
  });

  it("/api/orders/:orderId/products/:productId (PATCH) should update product quantity in the order", async () => {
    // Step 1: Create an order
    const createResponse = await request(app.getHttpServer())
      .post("/api/orders")
      .expect(201);

    const orderId = createResponse.body.id;
    const productId = 123;

    // Step 2: Add a product to the order
    await request(app.getHttpServer())
      .post(`/api/orders/${orderId}/products`)
      .send([productId, 999])
      .expect(201);

    const newQuantity = 10;
    let orderProductId: string;

    // Retrieve the order to get the product's order ID
    await request(app.getHttpServer())
      .get(`/api/orders/${orderId}/products`)
      .expect(200)
      .expect((res) => {
        const product = res.body.find(
          (p: OrderProduct) => p.product_id === productId
        );
        orderProductId = product.id;
      });

    // Step 3: Update the quantity of the product in the order
    await request(app.getHttpServer())
      .patch(`/api/orders/${orderId}/products/${orderProductId}`)
      .send({ quantity: newQuantity })
      .expect(200);

    // Step 4: Retrieve the updated order and verify the product quantity
    await request(app.getHttpServer())
      .get(`/api/orders/${orderId}`)
      .expect(200)
      .expect((res) => {
        const product = res.body.products.find(
          (p: OrderProduct) => p.id === orderProductId
        );
        expect(product).toBeDefined();
        expect(product.quantity).toEqual(newQuantity);
        expect(+res.body.amount.total).toEqual(
          calculateOrderTotalAmount(res.body)
        );
      });

    // Step 5: Update order status
    await request(app.getHttpServer())
      .patch(`/api/orders/${orderId}`)
      .send({ status: "PAID" })
      .expect(200);

    // Step 6: Update order quantity with invalid status
    await request(app.getHttpServer())
      .patch(`/api/orders/${orderId}/products/${orderProductId}`)
      .send({ quantity: 100 })
      .expect(400);
  });

  it("/api/orders/:orderId/products/:productId (PATCH) should replace a product in the order", async () => {
    // Step 1: Create an order
    const createResponse = await request(app.getHttpServer())
      .post("/api/orders")
      .expect(201);

    const orderId = createResponse.body.id;

    // Step 2: Add a product to the order
    const initialProductId = 123; // Example product ID
    await request(app.getHttpServer())
      .post(`/api/orders/${orderId}/products`)
      .send([initialProductId])
      .expect(201);

    let orderProductId: string;

    // Retrieve the order to get the product's order ID
    await request(app.getHttpServer())
      .get(`/api/orders/${orderId}`)
      .expect(200)
      .expect((res) => {
        const product = res.body.products.find(
          (p: OrderProduct) => p.product_id === initialProductId
        );
        if (product) {
          orderProductId = product.id;
        }
      });

    // Step 3: Replace the product with another product
    const replacementProductId = 456;
    const replacementQuantity = 2;

    await request(app.getHttpServer())
      .patch(`/api/orders/${orderId}`)
      .send({ status: "PAID" })
      .expect(200)
      .expect((res) => {
        expect(res.text).toEqual("OK");
      });

    // Step 4: Update order status to "PAID"
    await request(app.getHttpServer())
      .patch(`/api/orders/${orderId}/products/${orderProductId}`)
      .send({
        replaced_with: {
          product_id: replacementProductId,
          quantity: replacementQuantity,
        },
      })
      .expect(200);

    // Step 5: Retrieve the updated order and verify the product has been replaced
    await request(app.getHttpServer())
      .get(`/api/orders/${orderId}`)
      .expect(200)
      .expect((res) => {
        const replacedProduct = res.body.products.find(
          (p: OrderProduct) => p.id === orderProductId
        ).replaced_with;
        expect(replacedProduct).toBeDefined();
        expect(replacedProduct.product_id).toEqual(replacementProductId);
        expect(replacedProduct.quantity).toEqual(replacementQuantity);
      });
  });

  afterAll(async () => {
    await app.close();
  });

  const calculateOrderTotalAmount = (order: Order): number => {
    return order.products.reduce((total, product) => {
      return total + +product.price * product.quantity;
    }, 0);
  };
});
