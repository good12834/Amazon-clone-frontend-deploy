import React from 'react'
import CarouselEffect from '../../Carousel/Carousel'
import LayOut from '../../LayOut/LayOut'
import Category from '../../Category/category'
import Product from '../../Product/Product'


function Landing() {
  return (
    <LayOut>

   <CarouselEffect/>
   <Category/>
   <Product/>

    </LayOut>
  )
}

export default Landing