import React from 'react'
import {categorieyImage} from './CategoryFullinfos'
import CategorieyCard from './CategoryCard'
import classes from './Category.module.css'
    

function category() {
 
  return (

    <section className={classes.category__container}>
        {
            categorieyImage.map((item, index)=>{
                return <CategorieyCard key={index} data={item}/>
            })

        }

    </section>

  )
}

export default category