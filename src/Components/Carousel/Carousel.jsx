import React from 'react'
import { Carousel } from 'react-responsive-carousel';
import {img} from './img/data';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import classes from './Carousel.module.css';

function CarouselEffect() {
  return (
    <div className={classes.hero__img}>
        <Carousel
            autoPlay={true}
            infiniteLoop={true}
            showIndicators={false}
            
            showThumbs={false}
            
        >
            {
                img.map((imageItemLink, index)=>{
                    return(
                        <div key={index}>
                            <img src={imageItemLink} alt="" />
                        </div>
                    )
                })
            }
        </Carousel>
    </div>
  )
}

export default CarouselEffect