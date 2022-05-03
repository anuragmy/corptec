import React, { useState, useEffect } from "react";
import { PRODUCTS, DISCOUNTS } from "../Constants";
import "./style.css";

const Checkout = () => {
  const [products, setPorducts] = useState(PRODUCTS);
  const [total, setTotal] = useState(0);
  const [text, setText] = useState("");
  const [isValid, setIsValid] = useState("");
  const [discountInfo, setDiscountInfo] = useState("");
  const [newPrice, setNewPrice] = useState(0);

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.length > 8) return;
    setText(val.toUpperCase());
  };

  const handleReset = () => {
    const newProducts = products;
    setPorducts(newProducts.map((item) => ({ ...item, quantity: 0 })));
    setNewPrice(0);
    setDiscountInfo("");
    setIsValid("");
    setText("");
  };

  const removeCode = () => {
    setNewPrice(0);
    setDiscountInfo("");
    setIsValid("");
    setText("");
  };

  const applyCode = () => {
    if (!text) {
      setIsValid("");
      return;
    }
    const isPresent = DISCOUNTS.find((item) => item.name === text);
    if (!isPresent) return setIsValid("Invalid Promo Code");
    console.log(isPresent);
    setDiscountInfo(isPresent);
    if (!total || total < isPresent.basePrice)
      return setIsValid(
        `Please add products more than $${isPresent.basePrice}`
      );

    setIsValid(`${text} applied with ${isPresent.percent} discount`);
    setNewPrice(total - 0.1 * total);
  };

  const handleAddProduct = (id) => {
    const newProducts = products;

    const np = newProducts.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    setPorducts(np);
  };

  useEffect(() => {
    let newTotal = products.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    setTotal(newTotal);
    if (discountInfo?.basePrice && newTotal > discountInfo?.basePrice) {
      setNewPrice(total - discountInfo?.discountedRatio * total);
      setIsValid(`${text} applied with ${discountInfo.percent} discount`);
    }

    if (discountInfo?.basePrice && newTotal < discountInfo?.basePrice) {
      setNewPrice(0);
      setIsValid(`
      Please add products more than $${discountInfo.basePrice}
      `);
    }
  }, [products]);

  const handleRemoveProduct = (id) => {
    const newProducts = products;

    const np = newProducts.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity !== 0 ? item.quantity - 1 : 0 }
        : item
    );

    setPorducts(np);
  };
  return (
    <div>
      <h2>Checkout</h2>
      <div className="product_wrapper">
        <div>
          {products.map(({ id, name, price, quantity }) => (
            <div key={id} className="product">
              <div className="item">
                <p>{name}</p>
                <p className="price">${price}</p>
              </div>
              <div className="actions">
                <div className="quantity">
                  <p>X {quantity}</p>
                </div>
                <button onClick={() => handleAddProduct(id)}>Add</button>
                <button onClick={() => handleRemoveProduct(id)}>remove</button>
              </div>
            </div>
          ))}
          <div className="discount">
            <input
              type="text"
              placeholder="PROMO CODE"
              id="discount"
              value={text}
              onChange={handleChange}
            />
            <button onClick={applyCode}>Apply</button>
            {discountInfo?.basePrice && (
              <button onClick={removeCode}>Remove</button>
            )}
          </div>
          {isValid && (
            <p style={{ color: isValid.includes("applied") ? "green" : "red" }}>
              {isValid}
            </p>
          )}

          <br />
          <hr />

          <div className="total">
            <p>Total</p>
            <p style={{ textDecoration: newPrice ? "line-through" : false }}>
              {total.toFixed(2)}
            </p>
            {newPrice > 0 && <p>{newPrice.toFixed(2)}</p>}
          </div>
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
