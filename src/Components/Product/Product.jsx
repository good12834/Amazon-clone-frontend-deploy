import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import classes from './Product.module.css'

function Product() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch('https://fakestoreapi.com/products')

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()
                setProducts(data)

                console.log(`Loaded ${data.length} products from Fake Store API`)
            } catch (error) {
                console.error('Failed to load products:', error)
                setError('Failed to load products. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    if (loading) {
        return (
            <div className={classes.loading__container}>
                <div className={classes.loading__text}>Loading amazing products...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={classes.error__container}>
                <div className={classes.error__text}>Oops! Something went wrong: {error}</div>
            </div>
        )
    }

    return (
        <div style={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh',
            padding: '40px 0'
        }}>
            <div style={{
                textAlign: 'center',
                marginBottom: '40px'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    color: '#232f3e',
                    marginBottom: '10px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    Our Products
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: '#6c757d',
                    maxWidth: '600px',
                    margin: '0 auto',
                    lineHeight: '1.6'
                }}>
                   
                </p>
                <p style={{
                    fontSize: '0.9rem',
                    color: '#999',
                    margin: '10px auto 0',
                    maxWidth: '600px'
                }}>
                   
                </p>
            </div>

            <section className={classes.product__container}>
                {products.map((singleProduct) => (
                    <ProductCard
                        product={singleProduct}
                        key={singleProduct.id}
                    />
                ))}
            </section>
        </div>
    )
}

export default Product