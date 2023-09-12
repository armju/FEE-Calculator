import { calculatePrice } from '../src/index'; 
// Define datos de prueba
interface Fee {
  name: string;
  amount: number;
  type: 'flat' | 'per-page';
}

interface Distribution {
  name: string;
  amount: number;
}

interface FeeData {
  order_item_type: string;
  fees: Fee[];
  distributions: Distribution[];
}

// Define datos de prueba
const feesData: FeeData[] = [
  {
    order_item_type: 'Real Property Recording',
    fees: [
      {
        name: 'Recording (first page)',
        amount: 26.00,
        type: 'flat',
      },
      {
        name: 'Recording (additional pages)',
        amount: 1.00,
        type: 'per-page',
      },
    ],
    distributions: [],
  },
  {
    order_item_type: 'Birth Certificate',
    fees: [
      {
        name: 'Birth Certificate Fees',
        amount: 23.00,
        type: 'flat',
      },
    ],
    distributions: [],
  },
];

describe('calculatePrice', () => {
  it('calcula el precio correctamente para un ítem de pedido con tarifa plana', () => {
    const orderItem = {
      type: 'Real Property Recording',
      pages: 3,
    };

    const price = calculatePrice(orderItem, feesData[0]);

    expect(price).toBe(28.00); // El precio esperado es 28.00 según las tarifas y datos de prueba
  });

  it('calcula el precio correctamente para un ítem de pedido con tarifa por página', () => {
    const orderItem = {
      type: 'Real Property Recording',
      pages: 20,
    };

    const price = calculatePrice(orderItem, feesData[0]);

    expect(price).toBe(45.00); // El precio esperado es 45.00 según las tarifas y datos de prueba
  });

  it('maneja correctamente la falta de información de tarifa', () => {
    const invalidOrderItem = {
      type: 'Tipo de Pedido Inexistente',
      pages: 5,
    };

    const price = calculatePrice(invalidOrderItem, feesData[0]);

    expect(price).toBe(0); // El precio debe ser 0 cuando no hay información de tarifa
  });
});
