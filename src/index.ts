import * as fs from 'fs';

// Definir tipos para los datos
interface Fee {
  name: string;
  amount: number; // Cambiado a número
  type: 'flat' | 'per-page';
}

interface Distribution {
  name: string;
  amount: number; // Cambiado a número
}

interface FeeData {
  order_item_type: string;
  fees: Fee[];
  distributions: Distribution[];
}

interface OrderItem {
  type: string;
  pages: number; // Cambiado a número
}

interface Order {
  order_date: string;
  order_number: string;
  order_items: OrderItem[];
}

// Leer datos de los archivos fees.json y orders.json
const feesData: FeeData[] = JSON.parse(fs.readFileSync('fees.json', 'utf8'));
const ordersData: Order[] = JSON.parse(fs.readFileSync('orders.json', 'utf8'));

// Definir una función para calcular el precio de un ítem de pedido
export function calculatePrice(orderItem: OrderItem, feeData: FeeData): number {
  // Buscar la información de tarifa correspondiente al tipo de ítem
  const feeInfo = feesData.find(fee => fee.order_item_type === orderItem.type);
  if (!feeInfo) {
    console.log(`Información de tarifa no encontrada para el tipo de ítem: ${orderItem.type}`);
    return 0;
  }

  // Encontrar la tarifa plana y la tarifa por página
  const flatFee = feeInfo.fees.find(fee => fee.type === "flat");
  const perPageFee = feeInfo.fees.find(fee => fee.type === "per-page");

  if (!flatFee) {
    console.log(`Tarifa plana no encontrada para el tipo de ítem: ${orderItem.type}`);
    return 0;
  }

  // Convertir las cantidades de tarifa de cadena a número
  const flatFeeAmount = parseFloat(flatFee.amount.toString());
  const perPageFeeAmount = perPageFee ? parseFloat(perPageFee.amount.toString()) : 0;

  // Calcular el monto total de la tarifa
  const totalFeeAmount = flatFeeAmount + (perPageFeeAmount * (orderItem.pages - 1));
  return totalFeeAmount;
}

// Procesar pedidos y calcular los precios
for (const order of ordersData) {
  console.log(`ID de Pedido: ${order.order_number}`);
  let orderTotal = 0;

  for (let i = 0; i < order.order_items.length; i++) {
    const orderItem = order.order_items[i];
    const price = calculatePrice(orderItem, feesData[0]);

    console.log(`   Ítem de Pedido ${i + 1}: $${price.toFixed(2)}`);
    orderTotal += price;
  }

  console.log(`   Total del Pedido: $${orderTotal.toFixed(2)}\n`);
}
