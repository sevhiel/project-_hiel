import { useEffect, useMemo, useState } from 'react'
import './App.css'

const products = [
  {
    id: 'laptop',
    name: 'Laptop',
    price: 650,
    description: 'សម្រាប់ការងារ និងការកម្សាន្ត',
    label: 'ជម្រើសពេញនិយម',
  },
  {
    id: 'mouse',
    name: 'Mouse',
    price: 15,
    description: 'រចនាសាមញ្ញ ប្រើប្រាស់ងាយស្រួល',
    label: 'តម្លៃសមរម្យ',
  },
  {
    id: 'keyboard',
    name: 'Keyboard',
    price: 25,
    description: 'វាយអក្សរបានរលូន និងមានផាសុកភាព',
    label: 'សម្រាប់ការងារ',
  },
  {
    id: 'monitor',
    name: 'Monitor',
    price: 120,
    description: 'អេក្រង់ធំ សម្រាប់ការងាររបស់អ្នក',
    label: 'ពេញនិយម',
  },
]

function ProductArtwork({ type }) {
  if (type === 'laptop') {
    return (
      <svg viewBox="0 0 280 210" aria-hidden="true">
        <rect x="58" y="34" width="164" height="112" rx="9" className="device-dark" />
        <rect x="66" y="42" width="148" height="96" rx="4" className="screen-glow" />
        <path d="M37 157h206l-13 13H50z" className="device-base" />
        <path d="M108 157h64l-5 5h-54z" className="device-detail" />
      </svg>
    )
  }

  if (type === 'mouse') {
    return (
      <svg viewBox="0 0 280 210" aria-hidden="true">
        <path d="M140 39c-32 0-51 23-51 58v22c0 34 19 54 51 54s51-20 51-54V97c0-35-19-58-51-58Z" className="device-dark" />
        <path d="M140 43v49" className="device-line" />
        <rect x="134" y="57" width="12" height="25" rx="6" className="device-accent" />
        <path d="M105 121c13 10 57 10 70 0" className="device-detail" />
      </svg>
    )
  }

  if (type === 'keyboard') {
    return (
      <svg viewBox="0 0 280 210" aria-hidden="true">
        <path d="m41 77 182-13 17 70-184 16z" className="device-dark" />
        <g className="key-caps">
          <path d="m62 87 18-1 2 10-18 1zm26-2 18-1 2 10-18 1zm26-2 18-1 2 10-18 1zm26-2 18-1 2 10-18 1zm26-2 18-1 2 10-18 1zm26-2 18-1 2 10-18 1z" />
          <path d="m67 104 18-1 2 10-18 1zm26-2 18-1 2 10-18 1zm26-2 18-1 2 10-18 1zm26-2 18-1 2 10-18 1zm26-2 18-1 2 10-18 1zm26-2 18-1 2 10-18 1z" />
          <path d="m72 121 18-1 2 10-18 1zm26-2 18-1 2 10-18 1zm26-2 50-4 2 10-50 4zm58-4 18-1 2 10-18 1z" />
        </g>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 280 210" aria-hidden="true">
      <rect x="57" y="37" width="166" height="112" rx="9" className="device-dark" />
      <rect x="66" y="46" width="148" height="94" rx="4" className="screen-glow" />
      <path d="M126 149h28v23h-28z" className="device-stand" />
      <path d="M100 170h80l12 9H88z" className="device-base" />
    </svg>
  )
}

function getSavedCart() {
  try {
    const savedCart = window.localStorage.getItem('tech-corner-cart')
    if (!savedCart) return {}

    const parsedCart = JSON.parse(savedCart)
    if (!parsedCart || typeof parsedCart !== 'object' || Array.isArray(parsedCart)) {
      throw new TypeError('Saved cart must be an object.')
    }

    return Object.fromEntries(
      products
        .filter((product) => Number.isSafeInteger(parsedCart[product.id]) && parsedCart[product.id] > 0)
        .map((product) => [product.id, parsedCart[product.id]]),
    )
  } catch (error) {
    console.error('Unable to load the saved shopping cart.', error)
    return {}
  }
}

function App() {
  const [cart, setCart] = useState(getSavedCart)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(() => {
    const savedPage = window.location.hash.slice(1)
    return ['cart', 'checkout'].includes(savedPage) ? savedPage : 'home'
  })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)
  const [nextOrderNumber, setNextOrderNumber] = useState(1)
  const [shippingMethod, setShippingMethod] = useState('free')

  useEffect(() => {
    try {
      window.localStorage.setItem('tech-corner-cart', JSON.stringify(cart))
    } catch (error) {
      console.error('Unable to save the shopping cart.', error)
    }
  }, [cart])

  useEffect(() => {
    const syncPage = () => {
      const currentPage = window.location.hash.slice(1)
      setPage(['cart', 'checkout'].includes(currentPage) ? currentPage : 'home')
    }

    window.addEventListener('popstate', syncPage)
    window.addEventListener('hashchange', syncPage)
    return () => {
      window.removeEventListener('popstate', syncPage)
      window.removeEventListener('hashchange', syncPage)
    }
  }, [])

  const visibleProducts = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [search],
  )

  const cartItems = products.filter((product) => cart[product.id])
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  const cartTotal = cartItems.reduce(
    (total, product) => total + product.price * cart[product.id],
    0,
  )
  const shippingCost = shippingMethod === 'express' ? 9 : 0
  const grandTotal = cartTotal + shippingCost

  function addToCart(productId) {
    setCart((currentCart) => ({
      ...currentCart,
      [productId]: (currentCart[productId] || 0) + 1,
    }))
  }

  function navigate(nextPage) {
    window.history.pushState(null, '', `#${nextPage}`)
    setPage(nextPage)
  }

  function updateQuantity(productId, amount) {
    setCart((currentCart) => {
      const quantity = (currentCart[productId] || 0) + amount
      if (quantity <= 0) {
        const nextCart = { ...currentCart }
        delete nextCart[productId]
        return nextCart
      }
      return { ...currentCart, [productId]: quantity }
    })
  }

  function removeFromCart(productId) {
    setCart((currentCart) => {
      const nextCart = { ...currentCart }
      delete nextCart[productId]
      return nextCart
    })
  }

  function placeOrder(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const customerName = `${formData.get('firstName')} ${formData.get('lastName')}`.trim()
    const order = {
      id: `ORD-${String(nextOrderNumber).padStart(4, '0')}`,
      customerName,
      orderDate: new Date().toLocaleString('en-US'),
      products: cartItems.map((product) => ({
        id: product.id,
        name: product.name,
        quantity: cart[product.id],
        unitPrice: product.price,
        lineTotal: product.price * cart[product.id],
      })),
      subtotal: cartTotal,
      shippingMethod,
      shippingCost,
      total: grandTotal,
      status: 'Pending',
    }

    setOrderDetails(order)
    setNextOrderNumber((currentNumber) => currentNumber + 1)
    setCart({})
    setOrderPlaced(true)
  }

  return (
    <div className="store">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Tech Corner - ទំព័រដើម">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M4 5h16v11H4zM2 19h20M9 16v3m6-3v3" />
            </svg>
          </span>
          <span>tech<span className="brand-accent">corner</span></span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a
            className={`nav-link ${page === 'home' ? 'active' : ''}`}
            href="#home"
            onClick={(event) => {
              event.preventDefault()
              navigate('home')
            }}
          >
            ទំព័រដើម
          </a>
          <a
            className="nav-link"
            href="#products"
            onClick={(event) => {
              event.preventDefault()
              navigate('home')
              window.setTimeout(() => document.getElementById('products')?.scrollIntoView(), 0)
            }}
          >
            ផលិតផល
          </a>
          <a className="nav-link" href="#about">អំពីយើង</a>
        </nav>

        <div className="header-actions">
          <button
            className="cart-button"
            type="button"
            onClick={() => navigate('cart')}
            aria-current={page === 'cart' ? 'page' : undefined}
            aria-label={`កន្ត្រកទំនិញ មាន ${cartCount} មុខ`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 1.9-1.4L22 9H6M10 21h.01M18 21h.01" />
            </svg>
            <span className="cart-label">កន្ត្រក</span>
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>

      {page === 'cart' ? (
        <main className="cart-page">
          <a
            className="back-link"
            href="#home"
            onClick={(event) => {
              event.preventDefault()
              navigate('home')
            }}
          >
            <span aria-hidden="true">←</span> បន្តទិញទំនិញ
          </a>
          <div className="cart-page-heading">
            <div>
              <span className="section-kicker">កន្ត្រកទំនិញរបស់អ្នក</span>
              <h1>Shopping Cart</h1>
              <p>{cartCount} មុខទំនិញក្នុងកន្ត្រក</p>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <section className="cart-empty-state">
              <span className="empty-cart-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 1.9-1.4L22 9H6M10 21h.01M18 21h.01" />
                </svg>
              </span>
              <h2>កន្ត្រករបស់អ្នកទទេ</h2>
              <p>សូមជ្រើសរើសផលិតផលដែលអ្នកចង់ទិញ។</p>
              <button type="button" className="primary-button" onClick={() => navigate('home')}>
                មើលផលិតផល
              </button>
            </section>
          ) : (
            <div className="cart-layout">
              <section className="cart-products" aria-label="ផលិតផលក្នុងកន្ត្រក">
                <div className="cart-products-heading">
                  <h2>ផលិតផល</h2>
                  <span>{cartCount} មុខ</span>
                </div>
                {cartItems.map((product) => (
                  <article className="cart-row" key={product.id}>
                    <div className={`cart-product-art art-${product.id}`}>
                      <ProductArtwork type={product.id} />
                    </div>
                    <div className="cart-product-details">
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => removeFromCart(product.id)}
                        aria-label={`លុប ${product.name} ចេញពីកន្ត្រក`}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
                        </svg>
                        លុបចេញ
                      </button>
                    </div>
                    <div className="cart-price-quantity">
                      <strong className="cart-line-price">
                        ${(product.price * cart[product.id]).toLocaleString('en-US')}
                      </strong>
                      <div className="quantity-control cart-quantity">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, -1)}
                          aria-label={`ដកចំនួន ${product.name}`}
                        >
                          −
                        </button>
                        <span>{cart[product.id]}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, 1)}
                          aria-label={`បន្ថែមចំនួន ${product.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </section>

              <aside className="order-summary">
                <h2>សង្ខេបការបញ្ជាទិញ</h2>
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="summary-line">
                  <span>ការដឹកជញ្ជូន</span>
                  <span className="delivery-note">គិតពេលក្រោយ</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-grand-total">
                  <strong>Grand Total</strong>
                  <strong>${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                </div>
                <p className="summary-note">តម្លៃដឹកជញ្ជូនមិនទាន់បញ្ចូលក្នុងតម្លៃនេះទេ។</p>
                <button
                  type="button"
                  className="checkout-button"
                  onClick={() => {
                    setOrderPlaced(false)
                    setOrderDetails(null)
                    navigate('checkout')
                  }}
                >
                  Proceed to Checkout <span aria-hidden="true">→</span>
                </button>
                <button
                  type="button"
                  className="continue-button"
                  onClick={() => navigate('home')}
                >
                  បន្តទិញទំនិញ
                </button>
              </aside>
            </div>
          )}
        </main>
      ) : page === 'checkout' ? (
        <main className="checkout-page">
          {orderPlaced && orderDetails ? (
            <section className="order-confirmation">
              <div className="confirmation-header">
                <span className="success-check" aria-hidden="true">✓</span>
                <span className="section-kicker">ការបញ្ជាទិញបានទទួល</span>
                <h1>Order Placed Successfully!</h1>
                <p>សូមរក្សាទុក Order ID សម្រាប់តាមដានការបញ្ជាទិញ។</p>
              </div>

              <div className="confirmation-details">
                <div>
                  <span>Order ID</span>
                  <strong>{orderDetails.id}</strong>
                </div>
                <div>
                  <span>Customer Name</span>
                  <strong>{orderDetails.customerName}</strong>
                </div>
                <div>
                  <span>Order Date</span>
                  <strong>{orderDetails.orderDate}</strong>
                </div>
                <div>
                  <span>Order Status</span>
                  <strong className="order-status">{orderDetails.status}</strong>
                </div>
              </div>

              <div className="confirmation-products">
                <h2>Ordered Products</h2>
                {orderDetails.products.map((product) => (
                  <div className="confirmation-product" key={product.id}>
                    <div>
                      <strong>{product.name}</strong>
                      <span>${product.unitPrice.toFixed(2)} × {product.quantity}</span>
                    </div>
                    <strong>${product.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                  </div>
                ))}
                <div className="confirmation-product">
                  <span>Shipping ({orderDetails.shippingMethod === 'express' ? 'Express' : 'Free'})</span>
                  <strong>${orderDetails.shippingCost.toFixed(2)}</strong>
                </div>
                <div className="confirmation-total">
                  <strong>Total Amount</strong>
                  <strong>${orderDetails.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                </div>
              </div>

              <p className="confirmation-demo-note">
                នេះជាការបញ្ជាទិញសាកល្បង។ មិនទាន់មានការទូទាត់ពិត ឬការផ្ញើបញ្ជាទៅហាងទេ។
              </p>
              <button type="button" className="primary-button" onClick={() => navigate('home')}>
                ត្រឡប់ទៅទំព័រដើម
              </button>
            </section>
          ) : cartItems.length === 0 ? (
            <section className="cart-empty-state">
              <span className="section-kicker">កន្ត្រកទំនិញ</span>
              <h1>មិនមានទំនិញសម្រាប់ checkout ទេ</h1>
              <p>សូមបន្ថែមផលិតផលទៅកន្ត្រក មុនបន្តការបញ្ជាទិញ។</p>
              <button type="button" className="primary-button" onClick={() => navigate('home')}>
                មើលផលិតផល
              </button>
            </section>
          ) : (
            <>
              <a
                className="back-link"
                href="#cart"
                onClick={(event) => {
                  event.preventDefault()
                  navigate('cart')
                }}
              >
                <span aria-hidden="true">←</span> ត្រឡប់ទៅកន្ត្រក
              </a>
              <div className="checkout-layout">
                <form className="checkout-form" onSubmit={placeOrder}>
                  <span className="section-kicker">ជំហានចុងក្រោយ</span>
                  <h1>Checkout</h1>
                  <p>បំពេញព័ត៌មានដឹកជញ្ជូន និងជ្រើសរើសវិធីដឹកជញ្ជូន។</p>
                  <fieldset className="checkout-fields">
                    <legend>ព័ត៌មានអតិថិជន</legend>
                    <label>
                      First Name *
                      <input
                        name="firstName"
                        autoComplete="given-name"
                        required
                      />
                    </label>
                    <label>
                      Last Name *
                      <input
                        name="lastName"
                        autoComplete="family-name"
                        required
                      />
                    </label>
                    <label>
                      Email *
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                      />
                    </label>
                    <label>
                      Phone Number *
                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        pattern="[0-9+ ]{7,20}"
                        title="បញ្ចូលលេខទូរស័ព្ទដែលមាន 7 ដល់ 20 តួអក្សរ"
                        required
                      />
                    </label>
                    <label className="address-field">
                      Address *
                      <textarea
                        name="address"
                        autoComplete="street-address"
                        rows="3"
                        minLength="5"
                        required
                      />
                    </label>
                  </fieldset>
                  <fieldset className="shipping-options">
                    <legend>Shopping Method</legend>
                    <label className={`shipping-option ${shippingMethod === 'free' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="free"
                        checked={shippingMethod === 'free'}
                        onChange={() => setShippingMethod('free')}
                      />
                      <span className="shipping-option-copy">
                        <strong>Free Shipping</strong>
                        <small>5–7 ថ្ងៃធ្វើការ</small>
                      </span>
                      <strong>$0.00</strong>
                    </label>
                    <label className={`shipping-option ${shippingMethod === 'express' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                      />
                      <span className="shipping-option-copy">
                        <strong>Express Shipping</strong>
                        <small>1–3 ថ្ងៃធ្វើការ</small>
                      </span>
                      <strong>$9.00</strong>
                    </label>
                  </fieldset>
                  <button className="checkout-button place-order-button" type="submit">
                    Place Order <span aria-hidden="true">→</span>
                  </button>
                  <small className="checkout-disclaimer">
                    ការបញ្ជាទិញនេះជាការសាកល្បងប៉ុណ្ណោះ មិនមានការទូទាត់ពិតទេ។
                  </small>
                </form>
                <aside className="order-summary checkout-summary">
                  <h2>សង្ខេបការបញ្ជាទិញ</h2>
                  {cartItems.map((product) => (
                    <div className="summary-line" key={product.id}>
                      <span>{product.name} × {cart[product.id]}</span>
                      <span>${(product.price * cart[product.id]).toLocaleString('en-US')}</span>
                    </div>
                  ))}
                  <div className="summary-divider" />
                  <div className="summary-line">
                    <span>Subtotal</span>
                    <span>${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="summary-line">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="summary-divider" />
                  <div className="summary-grand-total">
                    <strong>Grand Total</strong>
                    <strong>${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <p className="summary-note">
                    {shippingMethod === 'free'
                      ? 'ដឹកជញ្ជូនធម្មតា មិនគិតថ្លៃ។'
                      : 'បានបញ្ចូលថ្លៃដឹកជញ្ជូនរហ័ស $9.00 ក្នុងតម្លៃសរុប។'}
                  </p>
                </aside>
              </div>
            </>
          )}
        </main>
      ) : (
        <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><span /> ហាងបច្ចេកវិទ្យារបស់អ្នក</span>
            <h1>ឧបករណ៍ល្អៗ<br />សម្រាប់ការងារ<br /><span>និងជីវិតប្រចាំថ្ងៃ</span></h1>
            <p>ស្វែងរកផលិតផលបច្ចេកវិទ្យាដែលអ្នកត្រូវការ ក្នុងតម្លៃសមរម្យ។</p>
            <a className="hero-cta" href="#products">
              មើលផលិតផល <span aria-hidden="true">→</span>
            </a>
            <div className="hero-note">
              <span className="note-icon" aria-hidden="true">✓</span>
              <span>ផលិតផលសម្រាប់ការប្រើប្រាស់ប្រចាំថ្ងៃ</span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-glow" />
            <div className="hero-device">
              <ProductArtwork type="laptop" />
            </div>
            <span className="floating-tag">SMART<br />CHOICE</span>
            <span className="hero-spark spark-one">✦</span>
            <span className="hero-spark spark-two">✳</span>
          </div>
        </section>

        <section className="catalog" id="products">
          <div className="catalog-heading">
            <div>
              <span className="section-kicker">ជ្រើសរើសផលិតផល</span>
              <h2>ផលិតផលរបស់យើង</h2>
              <p>ឧបករណ៍ចាំបាច់ សម្រាប់រៀបចំកន្លែងធ្វើការរបស់អ្នក។</p>
            </div>
            <label className="search-box">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 5 5" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ស្វែងរកផលិតផល..."
                aria-label="ស្វែងរកផលិតផល"
              />
            </label>
          </div>

          <div className="product-grid">
            {visibleProducts.map((product, index) => (
              <article className={`product-card artwork-${product.id}`} key={product.id}>
                <div className={`product-art art-${product.id}`}>
                  <span className="product-tag">{product.label}</span>
                  <ProductArtwork type={product.id} />
                  <span className="art-index">0{index + 1}</span>
                </div>
                <div className="product-info">
                  <div className="product-title-row">
                    <h3>{product.name}</h3>
                    <strong className="product-price">${product.price}</strong>
                  </div>
                  <p>{product.description}</p>
                  <button
                    className="add-button"
                    type="button"
                    onClick={() => addToCart(product.id)}
                  >
                    <span>បន្ថែមទៅកន្ត្រក</span>
                    <span className="add-icon" aria-hidden="true">+</span>
                  </button>
                </div>
              </article>
            ))}
            {visibleProducts.length === 0 && (
              <p className="no-results">រកមិនឃើញផលិតផលដែលអ្នកកំពុងស្វែងរកទេ។</p>
            )}
          </div>
        </section>

        <section className="about-strip" id="about">
          <span className="about-mark" aria-hidden="true">✦</span>
          <p>រកអ្វីដែលត្រូវការ សម្រាប់តុធ្វើការរបស់អ្នក។</p>
          <a href="#products">ទិញឥឡូវនេះ <span aria-hidden="true">→</span></a>
        </section>
      </main>
      )}

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M4 5h16v11H4zM2 19h20M9 16v3m6-3v3" />
            </svg>
          </span>
          <span>tech<span className="brand-accent">corner</span></span>
        </a>
        <p>បច្ចេកវិទ្យាងាយស្រួល សម្រាប់អ្នករាល់គ្នា។</p>
        <span className="copyright">© 2026 Tech Corner</span>
      </footer>
    </div>
  )
}

export default App
