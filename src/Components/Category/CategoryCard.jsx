import React from 'react'
import classes from './Category.module.css'
import { Link } from 'react-router-dom'

function CatagoryCard({data}) {
  console.log(data);

   
  return (
    <div className={classes.category}>
        <Link to={`/category/${data.name}`}>
        <span>
            <h2>{data.title}</h2>
        </span>
            <img src={data.image} alt={data.title} />
        </Link>
      <p>Shop Now</p>
    </div>
  )
}

export default CatagoryCard