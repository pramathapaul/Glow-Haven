import React from 'react'
import Hero from '../components/home/Hero'
import FeaturedCollections from '../components/home/FeaturedCollections'
import BestSellers from '../components/home/BestSellers'
import BrandStory from '../components/home/BrandStory'
import TrendingProducts from '../components/home/TrendingProducts'
import Testimonials from '../components/home/Testimonials'
import Newsletter from '../components/home/Newsletter'

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <BestSellers />
      <BrandStory />
      <TrendingProducts />
      <Testimonials />
      <Newsletter />
    </>
  )
}

export default Home