import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Landing from './Pages/Landing/Landing'
import Product from './Product/Product'

import Orders from './Pages/Orders/Orders'
import Cart from './Pages/Cart/Cart'
import Payment from './Pages/Payment/Payment'
import Results from './Pages/Results/Results'
import Checkout from './Pages/Checkout/Checkout'
import OrderConfirmation from './Pages/Checkout/OrderConfirmation'

import Signup from './Pages/Auth/Signup'
import Signin from './Pages/Auth/Signin'
import ProductDetail from './Pages/ProductDetail/ProductDetail'
import LayOut from './LayOut/LayOut'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
// Initialize Stripe
const stripePromise = loadStripe('pk_test_51S6FliHbSZOieXg7TjglCBbuZ3HwQS57uqedMtPK7eF2P6jok42vEibDXH7ZCglC1AuVFDrVCpeTBS0wlWJIwmfZ00b01T7ecH');


function Routering() {
  return (
        <Routes>

            <Route path='/' element={<Landing/>}/>
            <Route path='/category' element={<LayOut><Product/></LayOut>}/>
            <Route path='/category/:categoryName' element={<Results/>}/>
            <Route path='/products' element={<LayOut><Product/></LayOut>}/>

            <Route path='/signin' element={<Signin/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/Auth' element={<Signin/>}/>
            <Route path='/orders' element={<Orders/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/checkout' element={<Checkout/>}/>
            <Route path='/order-confirmation' element={<OrderConfirmation/>}/>
            <Route path='/Category/:CategoryName' element={<Results/>}/>
            <Route path='/product/:id' element={<ProductDetail/>}/>
            <Route path='/payment' element={<Payment/>}/>
            {/* Catch-all route for unknown URLs */}
            <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>

  )
}

export default Routering