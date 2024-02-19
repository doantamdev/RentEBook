import React from 'react'
import Hero from './Hero'
import BestSeller from './BestSeller'
import GenresBook from './GenresBook'
import FeaturedBook from './FeaturedBook'
import { CustomerCard } from './CustomerCard'
import CustomerQuestion from "./CustomerQuestion"
import DiscountFooter from "./DiscountFooter"

const Home = () => {
  return (
    <div>
      <Hero />
      <BestSeller />
      <GenresBook />
      <FeaturedBook />
      <CustomerCard/>
      <CustomerQuestion/>
      <DiscountFooter />
    </div>
  )
}

export default Home
