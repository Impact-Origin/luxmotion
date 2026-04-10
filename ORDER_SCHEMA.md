# Order Schema - EasyTransfer Hotel

## Overview
Uma order representa uma viagem de transfer. Para viagens de ida e volta (round trips), são criadas duas orders separadas, ligadas através do campo `relatedOrderId`.

## Schema TypeScript

```typescript
interface Order {
  // Identificação
  _id: string;                    // ID único do Convex (gerado automaticamente)
  orderNumber?: string;            // Número da ordem (ex: "ET1768492027773199")
  relatedOrderId?: string;         // ID da order relacionada (para round trips)
  
  // Status
  status: "draft" | "pending" | "confirmed" | "paid" | "completed" | "cancelled";
  
  // Localizações
  departure: {
    location: string;               // Endereço completo
    placeId?: string;               // Google Places ID
    lat?: number;                   // Latitude
    lng?: number;                   // Longitude
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    name?: string;                  // Nome do local (ex: "Aeroporto de Lisboa")
    terminal?: string;              // Terminal (para aeroportos)
  };
  
  arrival: {
    location: string;               // Endereço completo
    placeId?: string;               // Google Places ID
    lat?: number;                   // Latitude
    lng?: number;                   // Longitude
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    name?: string;                  // Nome do local
    terminal?: string;              // Terminal (para aeroportos)
  };
  
  stops?: Array<{                   // Paragens intermediárias
    location: string;
    placeId?: string;
    lat?: number;
    lng?: number;
  }>;
  
  // Detalhes da viagem
  departureDate: string;           // ISO 8601 format (ex: "2024-01-15T10:00:00")
  arrivalDate?: string;             // ISO 8601 format (para voos)
  passengers: number;               // Número de passageiros
  isRoundTrip: boolean;             // true se for ida e volta
  
  // Veículo
  vehicleId?: string;               // ID do veículo selecionado
  vehicleName?: string;             // Nome do veículo (ex: "Standard Car")
  
  // Informação de voo
  flightNumber?: string;            // Número do voo (ex: "TP1234")
  airlineCompany?: string;          // Companhia aérea
  flightType?: "IDA" | "VOLTA";     // Tipo de voo
  
  // Bagagem e equipamentos
  backpacks?: number;               // Número de mochilas
  handbaggage?: number;             // Bagagem de mão
  checkedBaggage?: number;          // Bagagem despachada
  pets?: number;                    // Número de animais de estimação
  surfboards?: number;              // Número de pranchas de surf
  childSeats?: number;              // Cadeiras de criança
  babySeats?: number;               // Cadeiras de bebé
  boosterSeats?: number;           // Assentos elevatórios
  
  // Preços
  basePrice?: number;               // Preço base do veículo (em euros)
  discountAmount?: number;          // Valor do desconto
  additionalFees?: number;           // Taxas adicionais
  nightTax?: number;                // Taxa noturna
  airportServiceFee?: number;       // Taxa de serviço de aeroporto
  cancellationFee?: number;         // Taxa de cancelamento
  refundFee?: number;               // Taxa de reembolso
  totalAmount?: number;             // Valor total (em euros)
  
  // Distância
  distance?: number;                // Distância em quilómetros
  
  // Informação do cliente
  customerName?: string;            // Nome do cliente
  customerEmail?: string;           // Email do cliente
  customerPhone?: string;            // Telefone do cliente
  customerNif?: string;             // NIF do cliente (para faturação)
  
  // Pagamento
  paymentMethod?: "mbway" | "mb" | "ccard" | "cash";
  paymentStatus?: "pending" | "processing" | "completed" | "failed";
  refundToOriginalPaymentMethod?: boolean;
  
  // Referências de pagamento (para MBWay/Multibanco)
  paymentEntity?: string;           // Entidade (Multibanco)
  paymentReference?: string;         // Referência (Multibanco)
  paymentRequestId?: string;        // RequestId (MBWay)
  paymentAmount?: number;           // Valor do pagamento
  
  // Timestamps
  createdAt: number;                 // Timestamp Unix (milissegundos)
  updatedAt: number;                // Timestamp Unix (milissegundos)
}
```

## Exemplo de Order (JSON)

```json
{
  "_id": "j1234567890abcdef",
  "orderNumber": "ET1768492027773199",
  "status": "paid",
  "departure": {
    "location": "Aeroporto de Lisboa, Lisboa, Portugal",
    "placeId": "ChIJ...",
    "lat": 38.7749,
    "lng": -9.1344,
    "city": "Lisboa",
    "country": "Portugal",
    "name": "Aeroporto de Lisboa",
    "terminal": "T1"
  },
  "arrival": {
    "location": "Praça do Comércio, Lisboa, Portugal",
    "placeId": "ChIJ...",
    "lat": 38.7076,
    "lng": -9.1366,
    "city": "Lisboa",
    "country": "Portugal"
  },
  "departureDate": "2024-01-15T10:00:00",
  "passengers": 2,
  "isRoundTrip": false,
  "vehicleId": "j9876543210fedcba",
  "vehicleName": "Standard Car",
  "flightNumber": "TP1234",
  "airlineCompany": "TAP Air Portugal",
  "flightType": "IDA",
  "backpacks": 2,
  "handbaggage": 2,
  "checkedBaggage": 1,
  "childSeats": 1,
  "basePrice": 45.00,
  "additionalFees": 2.50,
  "airportServiceFee": 5.00,
  "totalAmount": 52.50,
  "distance": 12.5,
  "customerName": "João Silva",
  "customerEmail": "joao@example.com",
  "customerPhone": "+351912345678",
  "customerNif": "123456789",
  "paymentMethod": "mbway",
  "paymentStatus": "completed",
  "paymentRequestId": "MBW123456789",
  "paymentAmount": 52.50,
  "createdAt": 1705312800000,
  "updatedAt": 1705313000000
}
```

## Round Trips

Para viagens de ida e volta, são criadas **duas orders separadas**:

1. **Order de Ida (Outbound)**: 
   - `isRoundTrip: true`
   - `relatedOrderId`: aponta para a order de volta
   - `flightType: "IDA"`

2. **Order de Volta (Return)**:
   - `isRoundTrip: true`
   - `relatedOrderId`: aponta para a order de ida
   - `flightType: "VOLTA"`
   - `departure`: localização invertida (arrival da ida)
   - `arrival`: localização invertida (departure da ida)

**Nota**: O pagamento é feito uma única vez, mas os valores são distribuídos entre as duas orders.

## Status da Order

- `draft`: Order criada mas ainda não finalizada
- `pending`: Aguardando pagamento
- `confirmed`: Pagamento confirmado, aguardando confirmação final
- `paid`: Pagamento concluído
- `completed`: Viagem concluída
- `cancelled`: Order cancelada

## Status do Pagamento

- `pending`: Aguardando pagamento
- `processing`: Pagamento em processamento
- `completed`: Pagamento concluído
- `failed`: Pagamento falhou

## Métodos de Pagamento

- `mbway`: MB Way (pagamento móvel)
- `mb`: Multibanco (referência multibanco)
- `ccard`: Cartão de crédito
- `cash`: Pagamento em dinheiro

## Índices

A tabela `orders` possui os seguintes índices para otimização de queries:

- `by_status`: Busca por status da order
- `by_payment_status`: Busca por status do pagamento
- `by_order_number`: Busca por número da order
