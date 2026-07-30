// ======================================================
// ENUM
// ======================================================

Enum user_role {
  admin
  store
  supplier
}

Enum business_type {
  store
  supplier
}

Enum transaction_status {
  pending
  completed
  cancelled
}

Enum stock_movement_type {
  stock_in
  stock_out
}

Enum stock_movement_source {
  manual_input
  pos_sale
  business_purchase
  business_sale
}


// ======================================================
// USERS
// ======================================================

Table users {
  id bigint [pk, increment]

  business_id bigint

  name varchar(255) [not null]
  email varchar(191) [not null, unique]
  password varchar(255) [not null]

  role user_role [not null]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    business_id
    role
  }
}


// ======================================================
// BUSINESSES
// ======================================================

Table businesses {
  id bigint [pk, increment]

  code varchar(50) [not null, unique]
  name varchar(255) [not null]

  business_type business_type [not null]

  owner_name varchar(255) [not null]
  address text [not null]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    name
    business_type
  }
}


// ======================================================
// PRODUCTS
// SETIAP PRODUK DIMILIKI SATU BUSINESS
// ======================================================

Table products {
  id bigint [pk, increment]

  business_id bigint [not null]

  name varchar(255) [not null]
  stock int [not null, default: 0]

  purchase_price decimal(15,2) [not null, default: 0]
  selling_price decimal(15,2) [not null, default: 0]

  image text

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    business_id
    name
    stock
  }
}


// ======================================================
// POS SALES
// PENJUALAN TOKO ATAU SUPPLIER KEPADA PELANGGAN
// ======================================================

Table sales {
  id bigint [pk, increment]

  business_id bigint [not null]
  user_id bigint [not null]

  invoice_number varchar(100) [not null, unique]

  total_amount decimal(15,2) [not null, default: 0]

  status transaction_status [not null, default: 'pending']

  customer_name varchar(255)
  notes text

  completed_at timestamp
  cancelled_at timestamp

  created_at timestamp
  updated_at timestamp

  indexes {
    business_id
    status
    created_at
  }
}

Table sale_items {
  id bigint [pk, increment]

  sale_id bigint [not null]
  product_id bigint [not null]

  product_name varchar(255) [not null]

  quantity int [not null]
  price decimal(15,2) [not null]
  subtotal decimal(15,2) [not null]

  created_at timestamp
  updated_at timestamp

  indexes {
    sale_id
    product_id
  }
}


// ======================================================
// BUSINESS ORDERS
// PEMBELIAN TOKO/SUPPLIER DARI SUPPLIER LAIN
// ======================================================

Table business_orders {
  id bigint [pk, increment]

  buyer_business_id bigint [not null]
  seller_business_id bigint [not null]

  created_by_user_id bigint [not null]

  order_number varchar(100) [not null, unique]

  total_amount decimal(15,2) [not null, default: 0]

  status transaction_status [not null, default: 'pending']

  notes text

  completed_at timestamp
  cancelled_at timestamp

  created_at timestamp
  updated_at timestamp

  indexes {
    buyer_business_id
    seller_business_id
    status
    created_at
  }
}

Table business_order_items {
  id bigint [pk, increment]

  business_order_id bigint [not null]

  seller_product_id bigint [not null]
  buyer_product_id bigint

  product_name varchar(255) [not null]

  quantity int [not null]
  price decimal(15,2) [not null]
  subtotal decimal(15,2) [not null]

  created_at timestamp
  updated_at timestamp

  indexes {
    business_order_id
    seller_product_id
    buyer_product_id
  }
}


// ======================================================
// STOCK MOVEMENTS
// RIWAYAT SEMUA BARANG MASUK DAN KELUAR
// ======================================================

Table stock_movements {
  id bigint [pk, increment]

  business_id bigint [not null]
  product_id bigint [not null]
  user_id bigint

  sale_id bigint
  business_order_id bigint

  movement_type stock_movement_type [not null]
  source stock_movement_source [not null]

  quantity int [not null]

  stock_before int [not null]
  stock_after int [not null]

  description text

  created_at timestamp

  indexes {
    business_id
    product_id
    movement_type
    source
    created_at
  }
}


// ======================================================
// CONVERSATIONS
// CHAT ANTAR-TOKO DAN SUPPLIER
// ======================================================

Table conversations {
  id bigint [pk, increment]

  business_one_id bigint [not null]
  business_two_id bigint [not null]

  last_message_at timestamp

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    (business_one_id, business_two_id) [unique]
    last_message_at
  }
}

Table messages {
  id bigint [pk, increment]

  conversation_id bigint [not null]

  sender_business_id bigint [not null]
  sender_user_id bigint [not null]

  message text

  media text
  media_type enum('image', 'video')

  read_at timestamp

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    conversation_id
    sender_business_id
    created_at
  }
}


// ======================================================
// RELATIONSHIPS
// ======================================================

// User dan business
Ref: users.business_id > businesses.id

// Produk
Ref: products.business_id > businesses.id

// POS sales
Ref: sales.business_id > businesses.id
Ref: sales.user_id > users.id

Ref: sale_items.sale_id > sales.id
Ref: sale_items.product_id > products.id

// Business orders
Ref: business_orders.buyer_business_id > businesses.id
Ref: business_orders.seller_business_id > businesses.id
Ref: business_orders.created_by_user_id > users.id

Ref: business_order_items.business_order_id > business_orders.id
Ref: business_order_items.seller_product_id > products.id
Ref: business_order_items.buyer_product_id > products.id

// Stock movement
Ref: stock_movements.business_id > businesses.id
Ref: stock_movements.product_id > products.id
Ref: stock_movements.user_id > users.id

Ref: stock_movements.sale_id > sales.id
Ref: stock_movements.business_order_id > business_orders.id

// Chat
Ref: conversations.business_one_id > businesses.id
Ref: conversations.business_two_id > businesses.id

Ref: messages.conversation_id > conversations.id
Ref: messages.sender_business_id > businesses.id
Ref: messages.sender_user_id > users.id
