import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductList from '../components/product-list/ProductList'
import axios from 'axios'

export default function Search() {
    const { text } = useParams()
        const [meals, setMeals] = useState([])
    
    async function getFood() {
        try {
            const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${text}`)
            console.log(res.data);
            setMeals(res.data.meals)
            return
        } catch (error) {
            console.error(error);

        }
    }
    useEffect(() => {
        getFood()

    }, [text])
    return (
        <div className='home'>
            <ProductList food={meals}/>
        </div>
    )
}
