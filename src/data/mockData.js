// Mock data for demonstration purposes
export const mockBrands = [
  {
    brandId: 'brand-1',
    name: 'Everlane',
    description: 'Radical transparency and ethical manufacturing. Creating exceptional basics and modern wardrobe essentials.',
    websiteUrl: 'https://everlane.com',
    sustainabilityScore: 8.5,
    certifications: ['B-Corp', 'OEKO-TEX', 'Carbon Neutral'],
    aestheticTags: ['minimalist', 'casual', 'modern']
  },
  {
    brandId: 'brand-2',
    name: 'Patagonia',
    description: 'We are in business to save our home planet. Outdoor clothing built to last.',
    websiteUrl: 'https://patagonia.com',
    sustainabilityScore: 9.2,
    certifications: ['Fair Trade', 'Bluesign', '1% for the Planet'],
    aestheticTags: ['athletic', 'outdoor', 'casual']
  },
  {
    brandId: 'brand-3',
    name: 'Eileen Fisher',
    description: 'Simple, sustainable designs for women who value quality and conscious living.',
    websiteUrl: 'https://eileenfisher.com',
    sustainabilityScore: 8.8,
    certifications: ['EILEEN FISHER RENEW', 'OEKO-TEX', 'Cradle to Cradle'],
    aestheticTags: ['minimalist', 'formal', 'artsy']
  },
  {
    brandId: 'brand-4',
    name: 'Reformation',
    description: 'Being naked is the #1 most sustainable option. We are #2.',
    websiteUrl: 'https://thereformation.com',
    sustainabilityScore: 7.9,
    certifications: ['Climate Neutral', 'OEKO-TEX'],
    aestheticTags: ['vintage', 'bohemian', 'feminine']
  },
  {
    brandId: 'brand-5',
    name: 'Kotn',
    description: 'Creating quality everyday essentials while investing in Egyptian cotton farmers.',
    websiteUrl: 'https://kotn.com',
    sustainabilityScore: 8.1,
    certifications: ['GOTS', 'Fair Trade'],
    aestheticTags: ['minimalist', 'casual', 'timeless']
  },
  {
    brandId: 'brand-6',
    name: 'People Tree',
    description: 'Pioneer of sustainable fashion using organic cotton and fair trade principles.',
    websiteUrl: 'https://peopletree.co.uk',
    sustainabilityScore: 9.0,
    certifications: ['GOTS', 'Fair Trade', 'WFTO'],
    aestheticTags: ['bohemian', 'artsy', 'vintage']
  }
]

export const mockProducts = [
  {
    productId: 'product-1',
    brandId: 'brand-1',
    brand: mockBrands[0],
    name: 'Organic Cotton Crew Sweatshirt',
    description: 'A classic crewneck sweatshirt made from 100% organic cotton. Perfect for everyday wear.',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    productUrl: 'https://everlane.com/products/mens-organic-cotton-crew-sweatshirt',
    price: 68,
    category: 'tops',
    sustainableMaterials: ['organic cotton'],
    aestheticTags: ['minimalist', 'casual']
  },
  {
    productId: 'product-2',
    brandId: 'brand-2',
    brand: mockBrands[1],
    name: 'Better Sweater Fleece Jacket',
    description: 'Warm fleece jacket made from recycled polyester. Ideal for outdoor activities.',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
    productUrl: 'https://patagonia.com/product/womens-better-sweater-fleece-jacket',
    price: 99,
    category: 'outerwear',
    sustainableMaterials: ['recycled polyester'],
    aestheticTags: ['athletic', 'outdoor']
  },
  {
    productId: 'product-3',
    brandId: 'brand-3',
    brand: mockBrands[2],
    name: 'Tencel Midi Dress',
    description: 'Elegant midi dress made from sustainable Tencel fabric. Perfect for work or special occasions.',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
    productUrl: 'https://eileenfisher.com/tencel-midi-dress',
    price: 248,
    category: 'dresses',
    sustainableMaterials: ['tencel'],
    aestheticTags: ['minimalist', 'formal']
  },
  {
    productId: 'product-4',
    brandId: 'brand-4',
    brand: mockBrands[3],
    name: 'Vintage-Inspired Floral Dress',
    description: 'Beautiful floral dress with vintage silhouette, made from sustainable viscose.',
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop',
    productUrl: 'https://thereformation.com/vintage-floral-dress',
    price: 178,
    category: 'dresses',
    sustainableMaterials: ['sustainable viscose'],
    aestheticTags: ['vintage', 'bohemian']
  },
  {
    productId: 'product-5',
    brandId: 'brand-5',
    brand: mockBrands[4],
    name: 'Essential Organic Cotton Tee',
    description: 'Perfectly fitted organic cotton t-shirt. A wardrobe essential that goes with everything.',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    productUrl: 'https://kotn.com/organic-cotton-tee',
    price: 32,
    category: 'tops',
    sustainableMaterials: ['organic cotton'],
    aestheticTags: ['minimalist', 'casual']
  },
  {
    productId: 'product-6',
    brandId: 'brand-6',
    brand: mockBrands[5],
    name: 'Hemp Blend Wide-Leg Trousers',
    description: 'Comfortable wide-leg trousers made from hemp and organic cotton blend.',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    productUrl: 'https://peopletree.co.uk/hemp-trousers',
    price: 89,
    category: 'bottoms',
    sustainableMaterials: ['hemp', 'organic cotton'],
    aestheticTags: ['bohemian', 'artsy']
  },
  {
    productId: 'product-7',
    brandId: 'brand-1',
    brand: mockBrands[0],
    name: 'Recycled Cashmere Scarf',
    description: 'Luxurious scarf made from recycled cashmere. Soft, warm, and sustainable.',
    imageUrl: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop',
    productUrl: 'https://everlane.com/recycled-cashmere-scarf',
    price: 78,
    category: 'accessories',
    sustainableMaterials: ['recycled cashmere'],
    aestheticTags: ['minimalist', 'formal']
  },
  {
    productId: 'product-8',
    brandId: 'brand-2',
    brand: mockBrands[1],
    name: 'Organic Cotton Joggers',
    description: 'Comfortable joggers made from organic cotton. Perfect for active days or lounging.',
    imageUrl: 'https://images.unsplash.com/photo-1506629905740-8f394f3d38b0?w=400&h=400&fit=crop',
    productUrl: 'https://patagonia.com/organic-cotton-joggers',
    price: 79,
    category: 'bottoms',
    sustainableMaterials: ['organic cotton'],
    aestheticTags: ['athletic', 'casual']
  },
  {
    productId: 'product-9',
    brandId: 'brand-4',
    brand: mockBrands[3],
    name: 'Linen Button-Up Shirt',
    description: 'Classic button-up shirt made from sustainable linen. Breathable and timeless.',
    imageUrl: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400&h=400&fit=crop',
    productUrl: 'https://thereformation.com/linen-button-up',
    price: 98,
    category: 'tops',
    sustainableMaterials: ['linen'],
    aestheticTags: ['minimalist', 'casual']
  },
  {
    productId: 'product-10',
    brandId: 'brand-3',
    brand: mockBrands[2],
    name: 'Wool Blend Blazer',
    description: 'Professional blazer made from sustainably sourced wool blend. Perfect for the office.',
    imageUrl: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&h=400&fit=crop',
    productUrl: 'https://eileenfisher.com/wool-blazer',
    price: 398,
    category: 'outerwear',
    sustainableMaterials: ['sustainable wool'],
    aestheticTags: ['formal', 'minimalist']
  },
  {
    productId: 'product-11',
    brandId: 'brand-6',
    brand: mockBrands[5],
    name: 'Artisan-Made Wrap Dress',
    description: 'Hand-crafted wrap dress made by fair trade artisans using organic dyes.',
    imageUrl: 'https://images.unsplash.com/photo-1566479179817-0dfd5de05b30?w=400&h=400&fit=crop',
    productUrl: 'https://peopletree.co.uk/wrap-dress',
    price: 135,
    category: 'dresses',
    sustainableMaterials: ['organic cotton'],
    aestheticTags: ['artsy', 'bohemian']
  },
  {
    productId: 'product-12',
    brandId: 'brand-5',
    brand: mockBrands[4],
    name: 'Essential Denim Jacket',
    description: 'Classic denim jacket made from organic cotton denim. A timeless wardrobe staple.',
    imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
    productUrl: 'https://kotn.com/denim-jacket',
    price: 118,
    category: 'outerwear',
    sustainableMaterials: ['organic cotton'],
    aestheticTags: ['casual', 'vintage']
  }
]