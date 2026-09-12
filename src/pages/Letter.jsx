import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductList from '../components/product-list/ProductList'
import axios from 'axios'

export default function Letter() {
        const { l } = useParams()
        const [meals, setMeals] = useState([])
    
    async function getFood() {
        try {
            const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${l}`)
            console.log(res.data);
            setMeals(res.data.meals)
            return
        } catch (error) {
            console.error(error);

        }
    }
    useEffect(() => {
        getFood()
    }, [l])
  return (
    <div>
        <ProductList food={meals}/> 
    </div>
  )
}
