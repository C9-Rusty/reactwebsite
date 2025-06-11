import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import "./styles.css";

const products = [
  {
    id: 1,
    name: "Raspberry Pi 5",
    price: 45.0,
    image: "https://via.placeholder.com/150",
    description: "Latest model with upgraded CPU and more GPIOs.",
    details: "The Raspberry Pi 5 features a 2.4GHz quad-core processor, 8GB RAM, and dual HDMI output. Ideal for DIY projects, robotics, and education."
  },
  {
    id: 2,
    name: "Arduino Uno R4",
    price: 22.5,
    image: "https://via.placeholder.com/150",
    description: "Affordable and reliable microcontroller board.",
    details: "The Arduino Uno R4 is the best entry-level board for learning electronics. Supports C/C++ and integrates seamlessly with sensors and motors."
  },
  {
    id: 3,
    name: "ESP32 Dev Board",
    price: 9.9,
    image: "https://via.placeholder.com/150",
    description: "WiFi + Bluetooth at raw price, no added taxes.",
    details: "ESP32 comes with built-in WiFi, BLE, dual-core CPU and tons of I/O. Perfect for IoT projects, automation, and wireless applications."
  }
];

function ProductCard({ product, addToCart }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}><img src={product.image} alt={product.name} /></Link>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="price">₹{product.price.toFixed(2)}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
}

function ProductList({ addToCart }) {
  return (
    <main>
      <h2>Featured Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </main>
  );
}

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) return <main><h2>Product Not Found</h2></main>;

  return (
    <main className="product-details">
      <img src={product.image} alt={product.name} />
      <div>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>{product.details}</p>
        <p className="price">₹{product.price.toFixed(2)}</p>
        <button onClick={() => addToCart(product)}>Add to Cart</button>
      </div>
    </main>
  );
}

function Cart({ cartItems, removeFromCart }) {
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);
  return (
    <main>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="cart-list">
          {cartItems.map((item, index) => (
            <li key={index}>
              {item.name} - ₹{item.price.toFixed(2)}
              <button onClick={() => removeFromCart(index)} className="remove-btn">Remove</button>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: ₹{total.toFixed(2)}</h3>
    </main>
  );
}

export default function App() {
  const [cart, setCart] = React.useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (indexToRemove) => {
    const updatedCart = cart.filter((_, index) => index !== indexToRemove);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

return (
  <Router>
    <div className="app">
      <header>
        <h1><Link to="/">TechFein</Link></h1>
        <p>No Tax. No Markup. Just Tech.</p>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart ({cart.length})</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<ProductList addToCart={addToCart} />} />
        <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cartItems={cart} removeFromCart={removeFromCart} />} />
      </Routes>

      <footer>
        <p>&copy; {new Date().getFullYear()} TechFein. All rights reserved.</p>
      </footer>
    </div>
  </Router>
 );
}
